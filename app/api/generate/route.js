import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SEED_EXAMPLES = {
  "Freedom & Time": [
    "Closing your laptop at 2PM on a Wednesday because you can.\n\nNo boss. No permission. No guilt.\n\nThis is what we're building towards as Nigerian techies.\n\nThe freedom to own your time is the real bag.\n\nYa Allah, make it happen 🤲",
    "Imagine waking up on a Tuesday in Lagos,\nnot rushing for danfo,\nnot praying NEPA brings light for the office.\n\nJust opening your laptop. On YOUR terms.\n\nThat's the techie dream. Build it daily. 💻",
  ],
  "Wealth & Mindset": [
    "Real wealth as a Nigerian techie:\n\n→ Dollar income, naira expenses\n→ No panic when exchange rate shifts\n→ Helping your family without checking your balance\n→ Sleeping at night without calculating costs\n\nWe go get there. 🙏",
    "Dollar-denominated skills + naira cost of living = one of the best arbitrages in the world.\n\nWe live in Nigeria. We earn globally.\n\nSomeone is reading this and still sleeping on the opportunity. Wake up. 🌅",
  ],
  "The Techie Grind": [
    "Nobody in Nigeria told us tech was easy.\n\nBad light. Expensive data. No mentors. No roadmap.\n\nAnd we still learned to code, design, market, and ship.\n\nIf that's not proof we can build anything — I don't know what is. 🔥",
    "NEPA takes light.\nYou switch to inverter.\nInverter dies.\nYou use hotspot.\nHotspot is slow.\nYou still ship.\n\nOther developers call that adversity.\nWe call it Tuesday. 😤💪",
  ],
  "Remote Work": [
    "The best thing about remote work as a Nigerian developer:\n\nYour value is determined by your output, not your proximity to the office.\n\nCode speaks every language.\nDesign has no borders.\n\nBuild and get paid globally. 🌐",
  ],
  "Freelancing": [
    "Your first $100 freelancing will feel more valuable than your first ₦100k salary.\n\nBecause YOU earned it. No company. No boss. No permission slip.\n\nJust your skill, your client, your money. 💪",
    "The biggest freelancing mistake I see Nigerian techies make:\n\nUndercharging because they feel guilty charging foreign clients 'that much.'\n\nYour location doesn't reduce your value.\nCharge what you're worth. 💵",
  ],
  "Community & Giving": [
    "When you blow, carry people with you.\n\nNot after you check your account.\nNot 'when the time is right.'\n\nThe best Nigerian techies I know help freely.\n\nAbundance mentality > scarcity mindset. 🤝",
  ],
  "Travel & Experiences": [
    "Travels, meals, and memories with the people you love — not just stuff.\n\nThe laptop bag goes everywhere.\nSo does the freedom to use it wherever you choose.\n\nThis is the life. Keep building. 🧳",
  ],
  "Family & Peace": [
    "Going to sleep without fretting about costs.\n\nWaking up without dreading the day.\n\nThese sound simple but for many Nigerian families, they're the real dream.\n\nTech can buy back that peace. Build. 💚",
  ],
  "Imposter Syndrome": [
    "You're not a fraud.\n\nYou're a self-taught Nigerian techie who built skills with bad internet, inconsistent light, and zero institutional support.\n\nYou earned your seat at every table. Don't forget that. 🪑",
  ],
  "Nigeria Specific": [
    "Nigeria has produced world-class engineers, designers, PMs, and founders.\n\nWith no stable power.\nExpensive data.\nAnd a system that rarely invests in us.\n\nAbeg, respect Nigerian techies. We're built different. 🦁",
  ],
};

export async function POST(request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json(
        { error: "ANTHROPIC_API_KEY is not set. Add it to your .env.local file or Vercel environment variables." },
        { status: 500 }
      );
    }

    const { category, recentTweets = [], customPrompt = "" } = await request.json();

    const examples = (SEED_EXAMPLES[category] || []).join("\n\n---\n\n");
    const recentTexts = recentTweets
      .slice(-5)
      .map((t) => t.tweet)
      .join("\n\n---\n\n");

    const systemPrompt = `You are a tweet ghostwriter for Feranmite, a Nigerian tech content creator who posts daily about the Nigerian techie lifestyle.

Writing style rules:
- Raw, honest, aspirational, and deeply Nigerian in voice
- Mix of English and occasional Pidgin/Yoruba words (e.g. "abeg", "oga", "wahala", "japa", "danfo", "NEPA", "suya", "sapa")
- Structure: short punchy lines, line breaks for rhythm, sometimes lists with →
- End every tweet with a short punchy line + 1 relevant emoji
- NEVER use hashtags
- Tweet length: 150-280 characters of actual content, multi-line
- Topics: freedom, remote work, freelancing, dollar income, Nigerian resilience, family, peace of mind, community
- Deeply rooted in the Lagos/Nigeria experience but with global tech ambitions
- Tone: like a big brother/sister who made it and wants to pull you up

NEVER repeat these recently generated tweets:
${recentTexts || "None yet"}

Respond with ONLY the tweet text. No quotes, no labels, no explanation.`;

    const userPrompt = customPrompt
      ? `Write a tweet about: "${customPrompt}" in the category "${category}"`
      : `Write a fresh, original tweet in the category: "${category}"\n\nStyle examples:\n\n${examples}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const tweet = message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    return Response.json({ tweet, category });
  } catch (error) {
    console.error("Generate error:", error);
    return Response.json(
      { error: error.message || "Failed to generate tweet" },
      { status: 500 }
    );
  }
}
