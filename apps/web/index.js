const text = "It's an exciting time to be an A.I. engineer.";
const PROD_URL =
	"https://hugging-face-worker.openai-api-by-alextomas.workers.dev";

async function fetchAudio() {
	try {
		const response = await fetch("http://localhost:8787/text-to-speech", {
			// Use your actual URL
			method: "POST",
			body: JSON.stringify({ text }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			// Get more detailed error information if possible
			let errorText = await response.text(); // Try to get the error message as text
			throw new Error(
				`Network response was not ok: ${response.status} - ${response.statusText} - ${errorText}`
			);
		}

		const blob = await response.blob();
		console.log("blob", blob);
		const $audioElement = document.querySelector("#speech");
		const blobAsURL = URL.createObjectURL(blob);
		$audioElement.src = blobAsURL;
	} catch (error) {
		console.error("There has been a problem with your fetch operation:", error);
	}
}

await fetchAudio();
