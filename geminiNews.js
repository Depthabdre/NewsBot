"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GeminiAPIkey });
// Create a chat instance that stores history
const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: [], // Start with empty history
});
function main(message) {
    return __awaiter(this, void 0, void 0, function* () {
        message += "\n summerized the above text in a maximum of six sentences. Do not include any introduction, summary, or extra text — only the news itself in a maximum of six sentences. and also make it very easy to undersand by making space between the sentences.  ";
        message += "\n summerized the above text in a maximum of six sentences. Do not include any introduction, summary, or extra text — only the news itself in a maximum of six sentences.";
        // Send the message to the chat
        const response = yield chat.sendMessage({ message });
        // Access and return the model's reply text
        return response.text;
    });
}
// const hotnews = main("Search the web (excluding personal responses) for the latest football news (not American football) from May 9, 2025, and give me one hot and relevant news piece for college students. Do not include any introduction, summary, or extra text — only the news itself in a maximum of six sentences.");
// hotnews.then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.error('Error:', error);
// });
exports.default = main;
