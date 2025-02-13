import { HfInference } from "@huggingface/inference";
import { services } from "./lib/services.js";
import { CORS_HEADERS } from "./lib/constants.js";

export default {
	async fetch(request, env, ctx) {
		console.log("Hugging Face Token:", env.HF_TOKEN);
		if (request.method === "OPTIONS") {
			return new Response(null, { headers: CORS_HEADERS });
		}
		if (request.method !== "POST") {
			return new Response(JSON.stringify({ error: "Method not allowed" }), {
				status: 405,
				headers: CORS_HEADERS,
			});
		}
		const url = new URL(request.url);
		const hf = new HfInference(env.HF_TOKEN);

		try {
			switch (url.pathname) {
				case "/translate-text":
					return await services.translateText({ request, hf });
				case "/text-to-speech":
					return await services.textToSpeach({ request, hf });
				case "/classify-text":
					return await services.classifyText(request, hf);
				default:
					return new Response(JSON.stringify({ error: "Path not found" }), {
						status: 404,
						headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
					});
			}
		} catch (error) {
			console.error(error);
			return new Response(JSON.stringify({ error: "Internal server error" }), {
				status: 500,
				headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
			});
		}
	},
};
