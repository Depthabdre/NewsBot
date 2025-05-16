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
// File: newsBot.ts
const grammy_1 = require("grammy");
const dotenv_1 = __importDefault(require("dotenv"));
const guardianNews_1 = __importDefault(require("./guardianNews"));
dotenv_1.default.config();
if (process.env.BOT_TOKEN && process.env.CHANNEL_ID) {
    const bot = new grammy_1.Bot(process.env.BOT_TOKEN);
    bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
    bot.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userText = ctx.message.text;
        if (((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.id) == Number(process.env.ADMIN_ID)) {
            if ((userText === null || userText === void 0 ? void 0 : userText.toLowerCase()) == "post") {
                const news = yield (0, guardianNews_1.default)();
                if (process.env.CHANNEL_ID && news) {
                    const channelId = process.env.CHANNEL_ID;
                    const messageText = `📰 <b>${news.headline}</b>\n\n💡 ${news.summary}`;
                    if (news.imageUrl) {
                        // Send as a photo with caption
                        yield bot.api.sendPhoto(channelId, news.imageUrl, {
                            caption: messageText,
                            parse_mode: "HTML",
                        });
                    }
                    else {
                        // Fallback: send as plain text
                        yield bot.api.sendMessage(channelId, messageText, {
                            parse_mode: "HTML",
                        });
                    }
                }
                else {
                    if (!process.env.CHANNEL_ID) {
                        console.error("Error: CHANNEL_ID is not defined in the environment variables.");
                    }
                    if (!news) {
                        console.error("Error: Failed to fetch news or news is null.");
                    }
                    console.error("CHANNEL_ID is not defined in the environment variables or news is null.");
                }
            }
        }
    }));
    bot.start();
}
