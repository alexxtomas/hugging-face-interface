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
	console.log({ request });
	if (!request) {
		console.error("Request object is undefined");
		return new Response(
			JSON.stringify({ error: "Request object is undefined" }),
			{
				status: 400,
				headers: CORS_HEADERS,
			}
		);
	}
	try {
		const { textToTranslate } = await request.json();

		if (!textToTranslate) {
			const errorMessage =
				"'textToTranslate' field is missing in the request body";
			console.error(errorMessage);
			return new Response(JSON.stringify({ error: errorMessage }), {
				status: 400,
				headers: CORS_HEADERS,
			});
		}
		const res = await hf.translation({
			model: "facebook/mbart-large-50-many-to-many-mmt",
			inputs: textToTranslate,
			parameters: {
				src_lang: "en_XX",
				tgt_lang: "es_XX",
			},
		});

		console.log("Response from Hugging Face API:", res);

		const data = await res.json();
		console.log("Data:", data);

		return new Response(
			JSON.stringify({
				res,
			}),
			{
				headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
			}
		);
	} catch (error) {
		console.error("Error processing request:", error);
		return new Response(JSON.stringify({ error: "Internal server error" }), {
			status: 500,
			headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
		});
	}
}

async function textToSpeach({ request, hf }) {
	if (!request) {
		console.error("Request object is undefined");
		return new Response(
			JSON.stringify({ error: "Request object is undefined" }),
			{
				status: 400,
				headers: CORS_HEADERS,
			}
		);
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
					headers: CORS_HEADERS,
				}
			);
		}

		console.log("Calling Hugging Face textToSpeech API with text:", text);

		// Call the Hugging Face API
		const blob = await hf.textToSpeech({
			// Rename 'res' to 'blob' for clarity
			model: "espnet/kan-bayashi_ljspeech_vits",
			inputs: text,
		});

		console.log("Response from Hugging Face API:", blob);

		// Send the binary response back to the client
		return new Response(blob, {
			headers: { ...CORS_HEADERS, "Content-Type": "audio/flac" },
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
