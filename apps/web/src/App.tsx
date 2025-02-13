import { FormEvent, useState } from "react";

const PROD_URL =
	"https://hugging-face-worker.openai-api-by-alextomas.workers.dev";

function App() {
	const [textToSpeach, setTextToSepach] = useState("");
	const [speach, setSpeach] = useState("");

	const handleTextToSpeachSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (textToSpeach) {
			const response = await fetch(`${PROD_URL}/text-to-speech`, {
				// Use your actual URL
				method: "POST",
				body: JSON.stringify({ text: textToSpeach }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				// handle error
				return;
			}
			const blob = await response.blob();
			const blobAsURL = URL.createObjectURL(blob);
			setSpeach(blobAsURL);
		}
	};

	return (
		<main className="flex flex-col items-center justify-center min-w-screen min-h-screen">
			<img src="/public/hf-logo.svg" />

			<form
				onSubmit={handleTextToSpeachSubmit}
				className="flex flex-col gap-10 justify-center"
			>
				<h3>Text to Speach</h3>
				{speach && <audio src={speach} controls />}
				<label>Introduce some text to convert it to audio</label>
				<textarea
					value={textToSpeach}
					onChange={(e) => {
						setTextToSepach(e.target.value);
					}}
				/>

				<button type="submit">Convert</button>
			</form>
		</main>
	);
}

export default App;
