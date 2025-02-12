import { errorHandler } from "./helpers.js";

async function classifyText({ textToClassify, hf }) {
	return errorHandler(async () => {
		const res = await hf.textClassification({
			model: "SamLowe/roberta-base-go_emotions",
			inputs: textToClassify,
		});
		return res[0].label;
	});
}

async function translateText({ textToTranslate, hf }) {
	return errorHandler(async () => {
		const res = await hf.translation({
			model: "facebook/mbart-large-50-many-to-many-mmt",
			inputs: textToTranslate,
			parameters: {
				src_lang: "en_XX",
				tgt_lang: "es_XX",
			},
		});
		return res.translation_text;
	});
}

async function textToSpeach({ text, hf }) {
	return errorHandler(async () => {
		const res = await hf.textToSpeech({
			model: "espnet/kan-bayashi_ljspeech_vits",
			inputs: text,
		});

		const $audioElement = document.querySelector("#speech");
		const blobAsURL = URL.createObjectURL(res);
		$audioElement.src = blobAsURL;
	});
}

export const services = {
	classifyText,
	textToSpeach,
	translateText,
};
