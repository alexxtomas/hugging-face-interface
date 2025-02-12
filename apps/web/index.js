const text = "It's an exciting time to be an A.I. engineer.";

const PROD_URL =
	"https://hugging-face-worker.openai-api-by-alextomas.workers.dev";

const response = await fetch("http://localhost:8787/text-to-speech", {
	method: "POST",
	body: JSON.stringify({
		text,
	}),
	headers: {
		"Content-Type": "application/json",
	},
});

console.log(response);

if (response.ok) {
	const $audioElement = document.querySelector("#speech");
	const blobAsURL = URL.createObjectURL(await response.blob);
	$audioElement.src = blobAsURL;
}
