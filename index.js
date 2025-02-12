import { HfInference } from '@huggingface/inference';

if (!process.env.HF_TOKEN) {
  throw new Error('HF_TOKEN environment variable is not set');
}

const hf = new HfInference(process.env.HF_TOKEN);
const textToClassify = "I just bought a new camera. It's the best camera I've ever owned!";

async function classifyText() {
  try {
    const res = await hf.textClassification({
      model: 'SamLowe/roberta-base-go_emotions',
      inputs: textToClassify, // Note: changed 'input' to 'inputs'
    });
    console.log(res[0].label);
  } catch (error) {
    console.error('Classification error:', error.message);
    if (error.message.includes('401')) {
      console.error('Invalid or expired token. Please check your HF_TOKEN.');
    }
  }
}

classifyText();
