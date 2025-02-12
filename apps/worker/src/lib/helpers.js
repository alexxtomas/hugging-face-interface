export async function errorHandler(cb) {
	try {
		return await cb();
	} catch (error) {
		if (error.message.includes("401")) {
			console.error("Invalid or expired token. Please check your HF_TOKEN.");
			return;
		}
		console.error("Error", error.message);
	}
}
