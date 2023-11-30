import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

// Initialize an LLM from OpenAI GPT-4

// Initialize a template called "SummarizeInspiration"
const summarizeInspirationTemplate = new PromptTemplate({
  template: `You are using the following text as an inspiration for a musical composition. Come up with a summary of the 
  input text that would best capture the essence of this focusing on song structure, tempo, keys, motifs and any other relevant 
  details you garner from this text. Also, consider the provided key and time signature.:

Text: {text}
Key: {key}
TimeSignature: {timesignature}
Summary:`,
  inputVariables: ["text", "key", "timesignature"],
});

// Initialize a template called "ComposeRendition"
const composeRenditionTemplate = new PromptTemplate({
  template: `You are an AI that composes music based on a written composition plan. Output your rendition in abcjs notation:

Summary: {summary}
Rendition:`,
  inputVariables: ["summary"],
});

// Initialize LLMChains
const summarizeInspirationChain = new LLMChain({
  llm,
  prompt: summarizeInspirationTemplate,
  outputKey: "summary",
});

const composeRenditionChain = new LLMChain({
  llm,
  prompt: composeRenditionTemplate,
  outputKey: "rendition",
});

// Function that takes an input string called "inspiration", a string called "key", and a string called "timesignature", runs the SummarizeInspiration template then returns the result
export async function generateCompositionPlan(inspiration: string, key: string, timesignature: string) {
  const summaryResult = await summarizeInspirationChain.call({ text: inspiration, key: key, timesignature: timesignature });
  return summaryResult;
}

// Function that takes a string called "compositionPlan", runs the ComposeRendition template then returns the result
export async function generateMusicalRendition(compositionPlan: string) {
  const renditionResult = await composeRenditionChain.call({ summary: compositionPlan });
  return renditionResult.rendition;
}

