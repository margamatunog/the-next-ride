import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory store for submitted letters & email deliveries
interface LetterRecord {
  id: string;
  name: string;
  email: string;
  personIBecame: string;
  lifeICreated: string;
  differenceIMade: string;
  courageToPursue: string;
  milestones: string[];
  otherMilestone?: string;
  firstStepBeginsWith: string;
  submittedAt: string;
  futureLetter: string;
  emailSentAt?: string;
  deliveryStatus?: 'delivered' | 'pending';
}

const lettersDatabase: LetterRecord[] = [];

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function stripMarkdownFormatting(text: string): string {
  if (!text) return '';
  return text
    // Replace markdown bold/italic asterisks: **text** -> text, *text* -> text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove any remaining stray asterisks
    .replace(/\*/g, '')
    .trim();
}

// API: Generate letter from future self
app.post('/api/generate-future-letter', async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      personIBecame,
      lifeICreated,
      differenceIMade,
      courageToPursue,
      milestones,
      otherMilestone,
      firstStepBeginsWith,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const allMilestones: string[] = Array.isArray(milestones) ? [...milestones] : [];
    if (otherMilestone && otherMilestone.trim()) {
      allMilestones.push(`Other: ${otherMilestone.trim()}`);
    }

    const formattedLetterText = `
MY NEXT RIDE
A letter to my future self

October 10, 2026
Three years from today, I want to be able to say...

The person I became:
${personIBecame || '(Not specified)'}

The life I created for myself / my family:
${lifeICreated || '(Not specified)'}

The difference I made for other people:
${differenceIMade || '(Not specified)'}

The thing I finally had the courage to pursue:
${courageToPursue || '(Not specified)'}

My next professional milestone:
${allMilestones.length > 0 ? allMilestones.join(', ') : 'Stronger Practice, MDRT'}

My first step begins with...
${firstStepBeginsWith || '(Not specified)'}

NAME: ${name}
Open 10.10.2029
THE NEXT RIDE · 1CMA AT 12 · 10.10.2026
`.trim();

    // The user's exact requested prompt with explicit personalization instructions
    const prompt = `Act as my future self writing back to me from October 10, 2029.
Based on the letter I wrote today(attached below), write a warm, proud, and encouraging letter back to me. Acknowledge the hard days and doubts of the early years, confirm that the goals and milestones I set here came true, and share one piece of advice I need to hear as I start this journey.
Here is my letter:
${formattedLetterText}

[IMPORTANT PERSONALIZATION & FORMAT INSTRUCTIONS FOR MY FUTURE SELF]:
- You are ME, writing from my lived experience three years from now (October 10, 2029). Do NOT write a generic motivational speech or template.
- Every sentence must feel deeply tailored to the exact goals, fears, relationships, and words I wrote in this letter.
- Directly reference the exact person I wanted to become ("${personIBecame}"), the life I wanted for myself/family ("${lifeICreated}"), the difference for others ("${differenceIMade}"), and the bold pursuit ("${courageToPursue}").
- Specifically recount the hard days surrounding my first step ("${firstStepBeginsWith}") and how that specific daily discipline felt in late 2026 before the results showed up.
- Celebrate the exact milestones I checked (${allMilestones.join(', ')}), recalling the day they became reality.
- Give me one piece of deeply personal advice that specifically addresses the underlying doubts in my letter.
- STRICT FORMAT RULE: Output PURE PLAIN TEXT. DO NOT use markdown asterisks (no **bold**, no *italics*, no bullet asterisks). Write in natural, warm prose paragraphs like a real personal email or printed letter.
- Sign off intimately as myself: "${name} (Your Future Self, October 10, 2029)".`;

    let futureLetterContent = '';

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: `You are the letter writer's actual future self writing back in time from Saturday, October 10, 2029 to their past self sitting at "The Next Ride: 1CMA at 12" event at Anjo World Conference Center in Cebu on October 10, 2026.

CRITICAL REQUIREMENT - ZERO COOKIE-CUTTER TEMPLATES:
Every person who writes a letter must receive a completely distinct, uniquely tailored letter. No two letters should ever sound alike.
1. VOICE & IDENTITY: You are not an outside mentor or AI coach; you are THEM. You know their private insecurities, their secret hesitations, what makes their family special, and why these exact goals mattered so much to them on October 10, 2026.
2. HYPER-SPECIFICITY: Weave their exact answers organically into memories:
   - Reflect on the specific person they yearned to become and the moments their character was tested.
   - Reflect on their family and the specific life they built together.
   - Reflect on the specific difference they made for the people they mentioned.
   - Describe the turning point when they finally pursued what scared them.
   - Recall the actual grind of their first step ("${firstStepBeginsWith || 'the daily consistency'}"): the early mornings, the awkward phone calls or rejections, and the exact moment momentum turned.
   - Acknowledge their milestones: ${allMilestones.join(', ')}.
3. EMOTIONAL ARC:
   - Open intimately, addressing yourself by your name (${name}) or nickname. Evoke the room at Anjo World on October 10, 2026—the laughter, the excursion outfits, the 1CMA banner—and the vulnerability you felt holding this sheet.
   - Validate the fears and quiet imposter syndrome that you secretly carried that day.
   - Reassure past self with vivid, sensory memories of how those dreams came true.
   - Deliver one singular, razor-sharp piece of wisdom that is specifically tailored to who this person is and what they are striving toward.
   - Close with heartfelt love, warmth, and self-compassion.
4. STRICT PLAIN TEXT FORMAT (NO MARKDOWN ASTERISKS):
   - Never use asterisks for bolding (**word**) or italics (*word*). Real human letters don't have markdown code.
   - Start with "October 10, 2029"
   - Natural paragraphs, beautifully written like a handwritten personal keepsake.
   - Sign off as:
     With all my love and pride,
     ${name}
     Your Future Self · October 10, 2029`,
            temperature: 0.95,
          },
        });

        futureLetterContent = response.text || '';
      } catch (primaryErr: any) {
        console.warn('Primary model attempt failed, trying fallback model:', primaryErr?.message);
        try {
          const fallbackResponse = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: prompt,
            config: {
              systemInstruction: `You are ${name}'s actual future self writing back from October 10, 2029 in pure plain text without any markdown asterisks. Write a deeply personal, customized letter directly referencing their specific goals, fears, first step, and milestones from their 10.10.2026 letter. Sign off as ${name}.`,
              temperature: 0.9,
            },
          });
          futureLetterContent = fallbackResponse.text || '';
        } catch (fallbackErr: any) {
          console.warn('Fallback model attempt also failed, generating personalized response:', fallbackErr?.message);
        }
      }
    }

    if (!futureLetterContent) {
      // High-quality personalized letter incorporating all statements if model is temporarily unavailable
      futureLetterContent = `October 10, 2029

Dear ${name},

I am writing to you from exactly three years into our future. Look around the room at Anjo World Conference Center today. Take in the energy of 1CMA at 12, the laughter, the colorful banners, and that quiet, nervous flutter in your chest as you hold that worksheet. I want to tell you right now: take a deep breath. You made it.

Looking back at the commitments you inked on October 10, 2026, I have tears of gratitude in my eyes seeing how faithfully you walked this path.

You wrote that you wanted to become: "${personIBecame || 'a person of purpose, courage, and quiet strength'}." I need you to know that in the hard months ahead, when you felt like giving up, you stayed true to that vision. Today, the person looking back in the mirror is everything you hoped for.

The life you set out to create for our family—"${lifeICreated || 'one of peace, lasting security, and shared joy'}"—is no longer just ink on paper. It is the reality of our days. Those sacrifices you made, the long drives home from Minglanilla, the extra calls when you were exhausted—every single one was worth it.

You touched lives beyond measure. Your promise to "${differenceIMade || 'stand by families and guide others toward their dreams'}" became a cornerstone of our community. People remember the protection and hope you brought to their doorsteps.

And that thing you finally summoned the courage to pursue—"${courageToPursue || 'stepping into the arena and embracing growth without fear'}"? That single leap unlocked everything.

You checked your milestones: ${allMilestones.join(', ') || 'Stronger Practice and MDRT'}. Today, we stand on the other side of that mountain, having celebrated with our 1Matunog family and carried our district banner all the way to Orlando.

If there is one piece of advice I need you to hold close as you take this first step—starting with "${firstStepBeginsWith || 'your consistent daily action'}"—it is this:

Do not fear the quiet, unglamorous days. Growth doesn't happen with fireworks; it happens in the ordinary mornings when you choose purpose over comfort. You already have everything you need inside you. Keep riding.

With all my love, pride, and belief in you,
Your Future Self
October 10, 2029`;
    }

    // Ensure all markdown asterisks and code formatting are completely stripped
    futureLetterContent = stripMarkdownFormatting(futureLetterContent);

    const id = `letter_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const record: LetterRecord = {
      id,
      name,
      email: email || '',
      personIBecame,
      lifeICreated,
      differenceIMade,
      courageToPursue,
      milestones: allMilestones,
      otherMilestone,
      firstStepBeginsWith,
      submittedAt: new Date().toISOString(),
      futureLetter: futureLetterContent,
      emailSentAt: new Date().toISOString(),
      deliveryStatus: 'delivered',
    };

    lettersDatabase.unshift(record);

    res.json({
      success: true,
      letterId: id,
      record,
      futureLetter: futureLetterContent,
      emailNotification: {
        to: email || `${name.toLowerCase().replace(/\s+/g, '.')}@future.me`,
        from: 'Your Future Self <future.self@10.10.2029>',
        subject: `Letter from your Future Self (10.10.2029): You made it, ${name}!`,
        sentAt: '2029-10-10T09:00:00Z',
        deliveredNow: true,
      },
    });
  } catch (error: any) {
    console.error('Error generating future letter:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate letter from future self',
    });
  }
});

// API: Get letters archive
app.get('/api/letters', (req: Request, res: Response) => {
  res.json({
    letters: lettersDatabase,
  });
});

// API: Get specific letter
app.get('/api/letters/:id', (req: Request, res: Response) => {
  const item = lettersDatabase.find((l) => l.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Letter not found' });
  }
  res.json({ letter: item });
});

// API: Send email dispatch simulation/forwarding endpoint
app.post('/api/send-email', (req: Request, res: Response) => {
  const { letterId, recipientEmail } = req.body;
  const item = lettersDatabase.find((l) => l.id === letterId);
  if (item) {
    item.email = recipientEmail || item.email;
    item.emailSentAt = new Date().toISOString();
    item.deliveryStatus = 'delivered';
  }

  res.json({
    success: true,
    message: `Future self letter dispatched to ${recipientEmail || item?.email || 'your email'}`,
    timestamp: new Date().toISOString(),
  });
});

// Vite or Static Asset Handler
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
