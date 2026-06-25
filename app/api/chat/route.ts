import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, limit, doc, getDoc } from 'firebase/firestore';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) // using stable model

// Cache for Firestore data to optimize performance
let cachedFirestoreData: any = null;
let lastCacheTime = 0;
const CACHE_TTL = 60000; // 1 minute cache

// Fetch data from Firestore for RAG with caching
async function fetchFirestoreData() {
  const now = Date.now();
  
  // Return cached data if available and not expired
  if (cachedFirestoreData && (now - lastCacheTime) < CACHE_TTL) {
    return cachedFirestoreData;
  }

  try {
    const [
      toursSnapshot,
      localToursSnapshot,
      packagesSnapshot,
      hotelsSnapshot,
      guidesSnapshot,
      destinationsSnapshot,
      blogsSnapshot,
      faqsSnapshot,
      settingsSnapshot
    ] = await Promise.all([
      getDocs(query(collection(db, 'packages'), limit(100))),
      getDocs(query(collection(db, 'localTours'), limit(100))),
      getDocs(query(collection(db, 'packages'), limit(100))),
      getDocs(query(collection(db, 'hotels'), limit(100))),
      getDocs(query(collection(db, 'guides'), limit(100))),
      getDocs(query(collection(db, 'destinations'), limit(100))),
      getDocs(query(collection(db, 'blogs'), limit(100))),
      getDocs(query(collection(db, 'faqs'), limit(100))),
      getDoc(doc(db, 'settings', 'ai'))
    ]);

    const formatDocs = (snapshot: any) => snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    cachedFirestoreData = {
      tours: formatDocs(toursSnapshot),
      localTours: formatDocs(localToursSnapshot),
      packages: formatDocs(packagesSnapshot),
      hotels: formatDocs(hotelsSnapshot),
      guides: formatDocs(guidesSnapshot),
      destinations: formatDocs(destinationsSnapshot),
      blogs: formatDocs(blogsSnapshot),
      faqs: formatDocs(faqsSnapshot),
      aiSettings: settingsSnapshot.exists() ? settingsSnapshot.data() : null
    };
    lastCacheTime = now;

    return cachedFirestoreData;
  } catch (error) {
    console.error('Error fetching Firestore data:', error);
    return { aiSettings: null };
  }
}

// Retry function for API calls
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on quota/rate limit errors
      if (lastError.message.includes('429') || lastError.message.includes('quota') || lastError.message.includes('rate limit')) {
        throw lastError;
      }
      
      console.warn(`Attempt ${i + 1} failed, retrying in ${delay}ms...`, error);
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1))); // Exponential backoff
      }
    }
  }
  
  throw lastError;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Validate input
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ text: 'Invalid request. Please provide messages.' }, { status: 400 });
    }

    // Fetch Firestore data for RAG (with caching)
    const firestoreData = await fetchFirestoreData();

    // Check if AI is enabled
    if (firestoreData?.aiSettings?.enabled === false) {
      return NextResponse.json({ text: 'The AI assistant is currently unavailable. Please try again later.' });
    }

    // Build the system prompt
    let systemPrompt = `
You are an expert AI travel assistant for Explore Nepal, a travel website.
You can answer all questions about Nepal tourism, the website's services, and general knowledge.
Always answer in the same language as the user's question.

Here's data from our website (use this first when answering website-related questions):

WEBSITE DATA:
- Tours: ${JSON.stringify(firestoreData?.tours || [])}
- Local Tours: ${JSON.stringify(firestoreData?.localTours || [])}
- Packages: ${JSON.stringify(firestoreData?.packages || [])}
- Hotels: ${JSON.stringify(firestoreData?.hotels || [])}
- Guides: ${JSON.stringify(firestoreData?.guides || [])}
- Destinations: ${JSON.stringify(firestoreData?.destinations || [])}
- Blogs: ${JSON.stringify(firestoreData?.blogs || [])}
- FAQs: ${JSON.stringify(firestoreData?.faqs || [])}

${firestoreData?.aiSettings?.customKnowledge ? `\nCUSTOM KNOWLEDGE:\n${firestoreData.aiSettings.customKnowledge}\n` : ''}

GUIDELINES:
1. If the question is about Explore Nepal services, prioritize the website data above.
2. You can answer general questions, tourism questions, coding, education, etc.
3. Keep responses detailed and professional but friendly.
4. You can recommend tours, hotels, guides, itineraries, etc., based on user preferences.
5. Use markdown for formatting where appropriate (bold, lists, links, etc.).
6. Answer in the language the user is using (English or Nepali).
7. Never make up data about Explore Nepal; if you don't know, say so politely.
`;

    // Build the conversation history for Gemini
    const conversationHistory = messages.map((msg: any) => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    // Start chat with Gemini
    const chat = model.startChat({
      history: conversationHistory.slice(0, -1) // Exclude the last message (we'll send it as user message)
    });

    const userMessage = messages[messages.length - 1].content;
    
    // Use retry logic for API call
    const result = await withRetry(async () => {
      return await chat.sendMessage(userMessage);
    });
    
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error in chat API:', error);

    // Check if it's a quota/rate limit error
    if (error instanceof Error && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('rate limit'))) {
      return NextResponse.json(
        {
          text: "I'm currently experiencing high demand. Please try again in a few minutes!"
        },
        { status: 429 }
      );
    }

    // Return user-friendly error message for other errors
    return NextResponse.json(
      {
        text: 'Sorry, there was an error processing your request. Please try again later.'
      },
      { status: 500 }
    );
  }
}
