import 'dotenv/config';
import { tavily as Tavily } from '@tavily/core';

const tvly = Tavily({
    apiKey: process.env.TAVILY_API_KEY,
})

export async function tavilySearch({query}) {
    console.log("Tavely Called:!: "+query);
    console.log(query);
    try {
        const response = await tvly.search(query, {
            maxResults: 5,
            searchDepth: "advanced"
        });
        console.log(response);
        return JSON.stringify(response);
    } catch (error) {
        console.log("Errro while using talvy!",error);
    }
}
