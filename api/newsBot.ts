// File: newsBot.ts

import { Bot, webhookCallback } from "grammy";
import dotenv from "dotenv";
import fetchStudentFriendlyTechNews from "./guardianNews";

dotenv.config();

const token = process.env.BOT_TOKEN;
const channelId = process.env.CHANNEL_ID;
const adminId = Number(process.env.ADMIN_ID);

if (!token) throw new Error("BOT_TOKEN is unset");
if (!channelId) throw new Error("CHANNEL_ID is unset");

const bot = new Bot(token);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));

bot.on("message", async (ctx) => {
    const userText = ctx.message.text;

    if (ctx.from?.id === adminId && userText?.toLowerCase() === "post") {
        const news = await fetchStudentFriendlyTechNews();

        if (!news) {
            console.error("Error: Failed to fetch news or news is null.");
            return;
        }

        const messageText = `📰 <b>${news.headline}</b>\n\n💡 ${news.summary}`;

        try {
            if (news.imageUrl) {
                await bot.api.sendPhoto(channelId, news.imageUrl, {
                    caption: messageText,
                    parse_mode: "HTML",
                });
            } else {
                await bot.api.sendMessage(channelId, messageText, {
                    parse_mode: "HTML",
                });
            }
        } catch (error) {
            console.error("Error sending news to the channel:", error);
        }
    }
});

// Export the webhook callback so it can be used in a server
export default webhookCallback(bot, "https");
