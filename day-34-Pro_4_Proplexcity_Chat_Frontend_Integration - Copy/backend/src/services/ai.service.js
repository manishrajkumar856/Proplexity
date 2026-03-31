import { HumanMessage, SystemMessage, AIMessage } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";

const mistralModel = new ChatMistralAI({
  model: "magistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  const response = await mistralModel.invoke(messages.map(msg => {
    console.log(msg)
    if(msg.role == 'user'){
        return new HumanMessage(msg.content);
    }
    else if(msg.role == 'ai'){
        return new AIMessage(msg.content);
    }
  }));

  return response.text;
}

//NOTE:- To give instruction like generate title based on message we use "SystemMessage"
export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
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
    `)
  ]);

  return response.text;

}
