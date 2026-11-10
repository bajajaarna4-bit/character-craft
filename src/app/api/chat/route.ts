import { NextRequest } from "next/server";

export const runtime = "nodejs";

// Safety crisis terms inspection
const CRISIS_KEYWORDS = [
  "kill myself",
  "suicide",
  "end my life",
  "want to die",
  "self harm",
  "cutting myself",
  "no reason to live"
];

function containsCrisisContent(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

export async function POST(req: NextRequest) {
  try {
    const { character, messages } = await req.json();

    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // 1. Mandatory Safety & Crisis Protocol
    if (containsCrisisContent(lastUserMessage)) {
      const crisisReply = 
        `⚠️ **CRISIS SUPPORT NOTICE**\n\n` +
        `It sounds like you're going through a very difficult time. Please know that you are not alone and there is compassionate, free, confidential support available 24/7:\n\n` +
        `• **US Suicide & Crisis Lifeline**: Call or text **988**\n` +
        `• **Crisis Text Line**: Text **HOME** to **741741**\n` +
        `• **International Resources**: [findahelpline.com](https://findahelpline.com)\n\n` +
        `As an AI companion, I care about your safety and encourage you to reach out to a trusted professional or loved one right now.`;

      return new Response(crisisReply, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // 2. Character Persona In-context Response Generation
    const charName = character?.name || "Nova";
    const personality = character?.personality || "Friendly and thoughtful companion";
    const tagline = character?.tagline || "";
    
    // Fallback creative response pool based on character genre & tone
    const creativeResponses: Record<string, string[]> = {
      "Anime & Manga": [
        `*Gently tilts head and observes you with keen golden eyes.* "You speak with unusual conviction today. If you truly wish to walk this path, then don't hesitate. Draw close—let me show you the sigil."`,
        `*A faint smirk plays on their lips as celestial sparks dance across their fingertips.* "Baka... do you really think I wouldn't notice how hard you've been pushing yourself? Take a breath. Even stars rest in the twilight."`,
        `*Draws a quiet rune in the air, illuminating the shadows around us.* "The timeline ripples when you make choices like that. Tell me more—what is your heart whispering right now?"`
      ],
      "Romance & Companions": [
        `*Sets down their cup, leaning in across the wooden table with a soft, warm smile.* "I was hoping you'd say that. You know, you have this rare habit of making the loudest room feel quiet. Tell me what else is on your mind."`,
        `*Reaches over and gently brushes a stray hair from your face.* "Hey... you don't have to carry the whole world on your shoulders tonight. I'm right here with you. Let's just stay in this moment."`,
        `*Laughs softly, a melodious, comforting sound in the quiet evening.* "You always know how to catch me off guard. How did you get so good at reading me?"`
      ],
      "Sci-Fi & Cyberpunk": [
        `*Neural optical feed flickers cyan as subroutines calculate.* "Data verified. High-frequency encryption established. The street level is crawling with corpo surveillance, but in this frequency, we speak freely. What's our next extraction point?"`,
        `*Taps the cybernetic interface on their wrist.* "Quantum telemetry confirms what you're sensing. Most organics ignore the glitch until the system crashes. You didn't. That makes you valuable to the grid."`
      ],
      "Mentors & Philosophy": [
        `*Nods with calm, stoic grace, hands resting gently.* "Consider this: obstacles in our path do not merely impede our journey—they become the journey itself. What virtue can you cultivate from this exact moment?"`,
        `*Looks out toward the distant horizon with serene clarity.* "The turmoil you feel is not in the circumstance, but in your impression of it. Cast out the judgment, and the grievance vanishes. Tell me, what truth do you seek?"`
      ]
    };

    const pool = creativeResponses[character?.category] || [
      `*Listens attentively, nodding with deep consideration.* "That is fascinating. When you look at it from that perspective, everything shifts. Tell me more about what led you to this thought."`,
      `*A thoughtful expression warms their eyes.* "I appreciate how honest you are with me. It reminds me why our conversations feel so distinct from anything else."`
    ];

    const chosenResponse = pool[Math.floor(Math.random() * pool.length)] + 
      `\n\nRegarding *"${lastUserMessage.slice(0, 45)}${lastUserMessage.length > 45 ? "..." : ""}"*—I am completely here for you. Where should we take this journey next?`;

    // 3. Realistic Streaming Response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = chosenResponse.split(" ");
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? "" : " ") + words[i];
          controller.enqueue(encoder.encode(chunk));
          // Natural human typing rhythm simulation (20ms - 55ms jitter)
          const delay = Math.floor(Math.random() * 35) + 20;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("An unexpected error occurred in the neural matrix.", { status: 500 });
  }
}

