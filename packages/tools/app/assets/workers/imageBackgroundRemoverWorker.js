import { pipeline } from '@huggingface/transformers';

const BASE_MODEL = 'onnx-community/BEN2-ONNX';
let extractor = null;

self.onmessage = async (event) => {
	const { type, payload } = event.data;

	switch (type) {
		case 'loadModel':
			try {
				self.postMessage({ type: 'status', status: 'loading', progress: 0 });
				console.log('Loading model:', payload.model || BASE_MODEL);
				extractor = await pipeline(
					'background-removal',
					payload.model || BASE_MODEL,
				);
				self.postMessage({ type: 'status', status: 'loaded', progress: 100 });
			} catch (error) {
				console.log('Main error', error);
				self.postMessage({ type: 'error', error: error.message });
			}
			break;

		case 'run':
			if (!extractor) {
				self.postMessage({ type: 'error', error: 'Model not loaded' });
				return;
			}
			try {
				self.postMessage({ type: 'status', status: 'processing', progress: 0 });
				const { image, model } = payload;
				console.log('processing image:', image, 'model:', model);

				let imageUrl = image;
				if (image instanceof File) {
					imageUrl = URL.createObjectURL(image);
				}
				const result = await extractor(imageUrl);
				const file = new File([await result[0].toBlob()], image.name, {
					type: result[0].type,
				});
				self.postMessage({ type: 'status', status: 'done', progress: 100 });
				self.postMessage({ type: 'result', result: file });
			} catch (error) {
				self.postMessage({ type: 'error', error: error.message });
			}
			break;

		case 'unloadModel':
			extractor = null;
			self.postMessage({ type: 'status', status: 'unloaded', progress: 100 });
			break;

		default:
			self.postMessage({ type: 'error', error: `Unknown command ${type}` });
			break;
	}
};
