// File: newsBot.ts
import { Bot } from 'grammy';
import dotenv from 'dotenv';
import fetchStudentFriendlyTechNews from './guardianNews';
dotenv.config();
if (process.env.BOT_TOKEN && process.env.CHANNEL_ID) {

    const bot = new Bot(process.env.BOT_TOKEN);
    bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
    bot.on("message", async (ctx) => {
        const userText = ctx.message.text;
        if (ctx.from?.id == Number(process.env.ADMIN_ID)) {
            if (userText?.toLowerCase() == "post") {
                const news = await fetchStudentFriendlyTechNews();

                if (process.env.CHANNEL_ID && news) {
                    const channelId = process.env.CHANNEL_ID;

                    const messageText = `📰 <b>${news.headline}</b>\n\n💡 ${news.summary}`;

                    if (news.imageUrl) {
                        // Send as a photo with caption
                        await bot.api.sendPhoto(channelId, news.imageUrl, {
                            caption: messageText,
                            parse_mode: "HTML",
                        });
                    } else {
                        // Fallback: send as plain text
                        await bot.api.sendMessage(channelId, messageText, {
                            parse_mode: "HTML",
                        });
                    }
                } else {
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
    })
    bot.start();

}
