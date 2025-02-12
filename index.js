import { HfInference } from '@huggingface/inference';

if (!process.env.HF_TOKEN) {
  throw new Error('HF_TOKEN environment variable is not set');
}

const hf = new HfInference(process.env.HF_TOKEN);
const textToClassify = "I just bought a new camera. It's the best camera I've ever owned!";
const textToTranslate = "It's an exciting time to be an AI engineer";

async function classifyText({ textToClassify }) {
  try {
    const res = await hf.textClassification({
      model: 'SamLowe/roberta-base-go_emotions',
      inputs: textToClassify,
    });
    return res[0].label;
  } catch (error) {
    console.error('Classification error:', error.message);
    if (error.message.includes('401')) {
      console.error('Invalid or expired token. Please check your HF_TOKEN.');
    }
  }
}

async function translateText({ textToTranslate }) {
  try {
    const res = await hf.translation({
      model: 'facebook/mbart-large-50-many-to-many-mmt',
      inputs: textToTranslate,
      parameters: {
        src_lang: 'en_XX',
        tgt_lang: 'es_XX',
      },
    });
    return res.translation_text;
  } catch (error) {
    console.error('Translation error:', error.message);
    if (error.message.includes('401')) {
      console.error('Invalid or expired token. Please check your HF_TOKEN.');
    }
  }
}

console.log(await classifyText({ textToClassify }));
console.log(await translateText({ textToTranslate }));
