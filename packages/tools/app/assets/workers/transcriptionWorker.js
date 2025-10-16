import { pipeline } from '@huggingface/transformers';

const BASE_MODEL = 'Xenova/whisper-tiny.en';
let transcriber = null;
let isEnglishModel = true;

self.onmessage = async (event) => {
	const { type, payload } = event.data;

	switch (type) {
		case 'loadModel':
			try {
				self.postMessage({ type: 'status', status: 'loading', progress: 0 });
				if (payload.model.includes('.en')) {
					isEnglishModel = true;
				} else {
					isEnglishModel = false;
				}
				console.log('Loading model:', payload.model || BASE_MODEL);
				console.log('Is English:', isEnglishModel);

				transcriber = await pipeline(
					'automatic-speech-recognition',
					payload.model || BASE_MODEL,
				);
				self.postMessage({ type: 'status', status: 'loaded', progress: 100 });
			} catch (error) {
				self.postMessage({ type: 'error', error: error.message });
			}
			break;

		case 'transcribe':
			if (!transcriber) {
				self.postMessage({ type: 'error', error: 'Model not loaded' });
				return;
			}
			try {
				self.postMessage({
					type: 'status',
					status: 'transcribing',
					progress: 0,
				});
				const { audio, language, model } = payload;
				console.log(
					'Transcribing audio:',
					audio,
					'with language:',
					language,
					'and model:',
					model,
				);
				const settings = {
					language,
					return_timestamps: true,
				};

				const result = await transcriber(
					audio,
					!isEnglishModel ? settings : {},
				);
				self.postMessage({ type: 'status', status: 'done', progress: 100 });
				self.postMessage({ type: 'result', result });
			} catch (error) {
				self.postMessage({ type: 'error', error: error.message });
			}
			break;

		case 'unloadModel':
			transcriber = null;
			self.postMessage({ type: 'status', status: 'unloaded', progress: 100 });
			break;

		default:
			self.postMessage({ type: 'error', error: 'Unknown message type' });
			break;
	}
};
