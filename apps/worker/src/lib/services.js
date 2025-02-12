import { CORS_HEADERS } from "./constants.js";

async function classifyText({ request, hf }) {
	const { textToClassify } = await request.json();
	const res = await hf.textClassification({
		model: "SamLowe/roberta-base-go_emotions",
		inputs: textToClassify,
	});

	return new Response(JSON.stringify(res), {
		headers: { ...corsHeaders, "Content-Type": "application/json" },
	});
}

async function translateText({ request, hf }) {
	const { textToTranslate } = await request.json();
	const res = await hf.translation({
		model: "facebook/mbart-large-50-many-to-many-mmt",
		inputs: textToTranslate,
		parameters: {
			src_lang: "en_XX",
			tgt_lang: "es_XX",
		},
	});

	return new Response(
		JSON.stringify({
			res,
		}),
		{
			headers: { ...corsHeaders, "Content-Type": "application/json" },
		}
	);
}

async function textToSpeach(request, hf) {
	if (!request) {
		console.error("Request object is undefined");
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
		});
	}

	try {
		const requestBody = await request.json();
		console.log("Request Body:", requestBody);

		const { text } = requestBody;

		if (!text) {
			console.error("Text field is missing in the request body");
			return new Response(
				JSON.stringify({ error: "Text field is missing in the request body" }),
				{
					status: 400,
					headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
				}
			);
		}

		const res = await hf.textToSpeech({
			model: "espnet/kan-bayashi_ljspeech_vits",
			inputs: text,
		});

		console.log({ res });

		return new Response(JSON.stringify(res), {
			headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("Error processing request:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
		});
	}
}

export const services = {
	classifyText,
	textToSpeach,
	translateText,
};
