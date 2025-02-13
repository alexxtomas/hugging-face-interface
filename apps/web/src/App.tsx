import { useMutation } from "@tanstack/react-query";
import { FormEvent, useRef, useState } from "react";
import { toast } from "sonner";

const PROD_URL =
	"https://hugging-face-worker.openai-api-by-alextomas.workers.dev";

function App() {
	const [textToTranslate, setTextToTranslate] = useState("");
	const [textToSpeech, setTextToSpeech] = useState("");

	const [translatedText, setTranslatedText] = useState("");
	const [speech, setSpeech] = useState("");
	const translatedTextModalRef = useRef<HTMLDialogElement>(null);

	const translateTextMutation = useMutation({
		mutationFn: async (text: string) => {
			const response = await fetch(`${PROD_URL}/translate-text`, {
				method: "POST",
				body: JSON.stringify({ text }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Request failed with status ${response.status}: ${errorText}`
				);
			}

			return response.json();
		},
		onSuccess: (data) => {
			setTranslatedText(data.translation);
			toast.success("Translation generated successfully!");
		},
		onError: () => {
			toast.error("An error occurred while generating translation :(");
			setTranslatedText("");
		},
	});

	const textToSpeachMutation = useMutation({
		mutationFn: async (text: string) => {
			const response = await fetch(`${PROD_URL}/text-to-speech`, {
				method: "POST",
				body: JSON.stringify({ text }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Request failed with status ${response.status}: ${errorText}`
				);
			}

			return response.blob();
		},
		onSuccess: (blob) => {
			const blobAsURL = URL.createObjectURL(blob);
			setSpeech(blobAsURL);
			console.log("here");
			toast.success("Audio generated successfully!");
		},
		onError: () => {
			toast.error("An error occurred while generating audio :(");
			setSpeech("");
		},
	});

	const handleTranslateTextSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (textToTranslate) {
			translateTextMutation.mutate(textToSpeech);
		}
	};

	const handleTextToSpeechSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (textToSpeech) {
			textToSpeachMutation.mutate(textToSpeech);
		}
	};

	return (
		<main className="flex flex-col gap-4 items-center justify-center mx-auto max-w-screen-sm min-h-screen">
			<img src="/public/hf-logo.svg" alt="HF Logo" />
			<section className="grid grid-cols-2 gap-8 overflow-y-scroll">
				<form
					onSubmit={handleTranslateTextSubmit}
					className="grid grid-rows-[1fr_auto] gap-2"
				>
					<div className="flex flex-col items-center prose">
						<h3>Translate Text to Spanish 🇪🇸</h3>
						<div
							className="tooltip tooltip-warning"
							data-tip={
								!translatedText
									? "When you translate some text, this button will be enabled"
									: "Click to see translated text"
							}
						>
							<button
								disabled={!translatedText}
								className="btn rounded-lg"
								onClick={() => translatedTextModalRef.current?.showModal()}
							>
								See translated text
							</button>
						</div>

						<dialog
							ref={translatedTextModalRef}
							id="translatedTextModal"
							className="modal"
						>
							<div className="modal-box">
								<h3 className="font-bold text-lg">Hello!</h3>
								<p className="py-4">
									Press ESC key or click the button below to close
								</p>
								<div className="modal-action">
									<form method="dialog">
										{/* if there is a button in form, it will close the modal */}
										<button className="btn">Close</button>
									</form>
								</div>
							</div>
						</dialog>
					</div>
					<div className="flex flex-col space-y-2">
						<label className="text-lg">
							Introduce some text to translate it to Spanish
						</label>
						<textarea
							className="textarea textarea-bordered w-full"
							value={textToTranslate}
							onChange={(e) => setTextToTranslate(e.target.value)}
						/>
						<button
							type="submit"
							className="btn btn-outline btn-warning rounded-lg w-full"
							disabled={textToSpeachMutation.isPending}
						>
							{textToSpeachMutation.isPending ? "Loading..." : "Generate Audio"}
						</button>
					</div>
				</form>
				<form
					onSubmit={handleTextToSpeechSubmit}
					className="grid grid-rows-[1fr_auto] gap-2"
				>
					<div className="flex flex-col items-center prose">
						<h3>Text to Speech 🎙️</h3>
						<audio src={speech} controls />
					</div>
					<div className="flex flex-col space-y-2">
						<label className="text-lg">
							Introduce some text to convert it to audio
						</label>
						<textarea
							className="textarea textarea-bordered w-full"
							value={textToSpeech}
							onChange={(e) => setTextToSpeech(e.target.value)}
						/>
						<button
							type="submit"
							className="btn btn-outline btn-warning rounded-lg w-full"
							disabled={textToSpeachMutation.isPending}
						>
							{textToSpeachMutation.isPending ? "Loading..." : "Generate Audio"}
						</button>
					</div>
				</form>
			</section>
		</main>
	);
}

export default App;
