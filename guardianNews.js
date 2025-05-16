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
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const geminiNews_1 = __importDefault(require("./geminiNews")); // Import your summarizer function
dotenv_1.default.config();
// Helper to extract image src from HTML <img> tag
function extractImgSrc(html) {
    const match = html === null || html === void 0 ? void 0 : html.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : null;
}
function fetchStudentFriendlyTechNews() {
    return __awaiter(this, void 0, void 0, function* () {
        const API_KEY = process.env.GUARDIAN_API_KEY;
        const BASE_URL = 'https://content.guardianapis.com';
        if (!API_KEY) {
            console.error('⚠️  Missing Guardian API key. Please set GUARDIAN_API_KEY in your .env file.');
            return;
        }
        try {
            const keywords = 'AI OR coding OR apps OR education OR student OR startup';
            // 1) Get the single newest relevant article
            const { data: searchData } = yield axios_1.default.get(`${BASE_URL}/search`, {
                params: {
                    section: 'technology',
                    'order-by': 'newest',
                    q: keywords,
                    'page-size': 1,
                    'api-key': API_KEY,
                },
            });
            const result = searchData.response.results[0];
            if (!result) {
                console.log('No relevant tech article found.');
                return;
            }
            // 2) Fetch full details including headline, body, and image
            const { data: fullData } = yield axios_1.default.get(`${BASE_URL}/${result.id}`, {
                params: {
                    'api-key': API_KEY,
                    'show-fields': 'headline,bodyText,thumbnail,main',
                },
            });
            const fields = fullData.response.content.fields;
            const imageUrl = fields.thumbnail || extractImgSrc(fields.main) || null;
            const newsSummary = yield (0, geminiNews_1.default)(fields.bodyText);
            console.log('\n🔥 Hot Tech News for Students 🔥\n');
            console.log(`📰 Headline:\n${fields.headline}\n`);
            console.log(`💡 Summary:\n${newsSummary}\n`);
            console.log(`🖼️ Image URL:\n${imageUrl !== null && imageUrl !== void 0 ? imageUrl : 'No image available'}\n`);
            return {
                headline: fields.headline,
                summary: newsSummary,
                imageUrl,
            };
        }
        catch (err) {
            if (err instanceof Error) {
                console.error('Error fetching student tech news:', err.message);
            }
            else {
                console.error('Error fetching student tech news:', err);
            }
            return null;
        }
    });
}
exports.default = fetchStudentFriendlyTechNews;
