import axios from 'axios';
import dotenv from 'dotenv';
import main from './geminiNews'; // Import your summarizer function

dotenv.config();

// Helper to extract image src from HTML <img> tag
function extractImgSrc(html: string): string | null {
  const match = html?.match(/<img[^>]+src="([^">]+)"/);
  return match ? match[1] : null;
}

async function fetchStudentFriendlyTechNews() {
  const API_KEY = process.env.GUARDIAN_API_KEY;
  const BASE_URL = 'https://content.guardianapis.com';

  if (!API_KEY) {
    console.error('⚠️  Missing Guardian API key. Please set GUARDIAN_API_KEY in your .env file.');
    return;
  }

  try {
    const keywords = 'AI OR coding OR apps OR education OR student OR startup';

    // 1) Get the single newest relevant article
    const { data: searchData } = await axios.get(`${BASE_URL}/search`, {
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
    const { data: fullData } = await axios.get(`${BASE_URL}/${result.id}`, {
      params: {
        'api-key': API_KEY,
        'show-fields': 'headline,bodyText,thumbnail,main',
      },
    });

    const fields = fullData.response.content.fields;
    const imageUrl = fields.thumbnail || extractImgSrc(fields.main) || null;

    const newsSummary = await main(fields.bodyText);

    console.log('\n🔥 Hot Tech News for Students 🔥\n');
    console.log(`📰 Headline:\n${fields.headline}\n`);
    console.log(`💡 Summary:\n${newsSummary}\n`);
    console.log(`🖼️ Image URL:\n${imageUrl ?? 'No image available'}\n`);

    return {
      headline: fields.headline,
      summary: newsSummary,
      imageUrl,
    };

  } catch (err) {
    if (err instanceof Error) {
      console.error('Error fetching student tech news:', err.message);
    } else {
      console.error('Error fetching student tech news:', err);
    }
    return null;
  }
}

export default fetchStudentFriendlyTechNews;
