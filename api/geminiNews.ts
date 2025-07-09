import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GeminiAPIkey });



// Create a chat instance that stores history
const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: [], // Start with empty history
});

async function main(message: string) {
    message += "\n summerized the above text in a maximum of six sentences. Do not include any introduction, summary, or extra text — only the news itself in a maximum of six sentences. and also make it very easy to undersand by making space between the sentences.  ";
       message += "\n summerized the above text in a maximum of six sentences. Do not include any introduction, summary, or extra text — only the news itself in a maximum of six sentences.";

    // Send the message to the chat
    const response = await chat.sendMessage({ message });

    // Access and return the model's reply text
    return response.text;
}

// const hotnews = main("Search the web (excluding personal responses) for the latest football news (not American football) from May 9, 2025, and give me one hot and relevant news piece for college students. Do not include any introduction, summary, or extra text — only the news itself in a maximum of six sentences.");




// hotnews.then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.error('Error:', error);
// });

export default main;