import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  tool,
  createAgent,
} from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";
import * as z from "zod";
import { tavilySearch } from "./internet.tavily.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"


const mistralModel = new ChatMistralAI({
  model: "magistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const giminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GIMINI_API_KEY,
})

// Create Tools -> To perform aditional work
const searchInternetTool = tool(tavilySearch, {
  name: "Internet_Search",
  description: "Use this tool to get the latest information from the internet.",
  schema: z.object({
    query: z.string().describe("The search query to look up on the internet"),
  }),
});

// Create agent -> To connect with LLM model (Gimini, Mistral) to the created tools for adititonal functionality.
const internetAgent = createAgent({
  model: giminiModel,
  tools: [searchInternetTool],
});

export async function generateResponse(messages) {
  const response = await internetAgent.invoke({
    messages: [
      new SystemMessage(`
            You are an intelligent, helpful, and precise AI assistant.

            Your responsibilities:
            - if the question requires the up-to-date information, use the "Search_Internet" tools to get the latest information from the internet and answer based on search results.
      `),

      ...messages.map((msg) => {
        console.log(msg);
        if (msg.role == "user") {
          return new HumanMessage(msg.content);
        } else if (msg.role == "ai") {
          return new AIMessage(msg.content);
        }
      }),
    ],
  });

  return response.messages[response.messages.length - 1].text;
}

//NOTE:- To give instruction like generate title based on message we use "SystemMessage"
export async function generateChatTitle(message) {
  const response = await giminiModel.invoke([
    new SystemMessage(`
        You are a professional content creator.

        Your task is to generate a short, catchy, and meaningful title based on the user's message.

        The user will provide the first message of a chat conversation. You must generate a title that captures the essence of that conversation.

        Rules:
        - The title must be exactly 3 words
        - It should clearly reflect the main idea of the message
        - Make it engaging and easy to understand
        - Use proper capitalization (Title Case)
        - Do NOT include quotes, emojis, or punctuation
        - Do NOT add any explanation or extra text

        Example:
        Input: "I built a login and signup page using React and Tailwind"
        Output: React Auth System

        Input: "Today I learned Redux Toolkit and implemented it"
        Output: Redux Toolkit Learning

        Return only the title.
    `),
    new HumanMessage(`
        Generate a title for a chat convertation based on the following first message:
        
        "${message}"
    `),
  ]);

  return response.text;
}
