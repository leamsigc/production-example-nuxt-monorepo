import { ref, computed } from 'vue';
import ImageBackgroundTransformer from '@/assets/workers/imageBackgroundRemoverWorker?worker';
type WorkerStatus =
	| 'idle'
	| 'loading'
	| 'loaded'
	| 'processing'
	| 'done'
	| 'error';

const worker = ref<Worker | null>(null);
const status = ref<WorkerStatus>('idle');
const progress = ref<number>(0);
const error = ref<string | null>(null);
const result = ref<File[]>([]);
const selectedModel = ref<string>('briaai/RMBG-1.4');
// const selectedModel = ref<string>('onnx-community/BEN2-ONNX');

export const useImageTransformer = () => {
	const initWorker = () => {
		if (!worker.value) {
			worker.value = new ImageBackgroundTransformer();

			worker.value.onmessage = (event) => {
				console.log('Worker message:', event.data);

				const {
					type,
					status: workerStatus,
					progress: workerProgress,
					error: workerError,
					result: workerResult,
				} = event.data;

				switch (type) {
					case 'status':
						status.value = workerStatus;
						if (workerProgress !== undefined) {
							progress.value = workerProgress;
						}
						break;
					case 'error':
						status.value = 'error';
						error.value = workerError;
						break;
					case 'result':
						result.value = [workerResult];
						break;
				}
			};
		}
	};

	const start = async () => {
		initWorker();
		worker.value?.postMessage({
			type: 'loadModel',
			payload: { model: selectedModel.value },
		});
	};
	const startWithModel = async () => {
		if (!worker.value) {
			initWorker();
		} else {
			worker.value.postMessage({ type: 'unloadModel' });
		}

		worker.value?.postMessage({
			type: 'loadModel',
			payload: { model: selectedModel.value },
		});
	};

	const run = async (image: File) => {
		if (status.value === 'idle') {
			await start();
		}

		try {
			// Convert AudioBuffer to Float32Array for the worker
			worker.value?.postMessage({
				type: 'run',
				payload: {
					image,
					model: selectedModel.value,
				},
			});
		} catch (err) {
			error.value = (err as Error).message;
			status.value = 'error';
		}
	};

	return {
		start,
		run,
		status,
		progress,
		error,
		result,
		isLoaded: computed(
			() => status.value === 'loaded' || status.value === 'done',
		),
		isRunning: computed(() => status.value === 'processing'),
		selectedModel,
		changeModel: (model: string) => {
			selectedModel.value = model;
			startWithModel();
		},
	};
};
