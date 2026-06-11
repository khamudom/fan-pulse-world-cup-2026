import OpenAI from "openai";
import type { Match } from "@/types";
import type { Profile } from "@/types/database";

export interface BriefingInput {
  userName: string;
  profile: Profile | null;
  yesterdayMatches: Match[];
  todayMatches: Match[];
  upcomingTeamMatch: Match | null;
  stats?: {
    points: number;
    level: number;
    predictionAccuracy: number;
    streak: number;
  };
}

export interface CompanionInput {
  message: string;
  profile: Profile | null;
  matches: Match[];
  userName?: string;
  focusMatch?: Match | null;
}

function formatMatch(m: Match): string {
  const score =
    m.status === "finished" || m.status === "live"
      ? `${m.homeScore}-${m.awayScore}`
      : "vs";
  return `${m.homeTeam.name} ${score} ${m.awayTeam.name} (${m.date} ${m.time})`;
}

function buildTemplateBriefing(input: BriefingInput): string {
  const { userName, profile, yesterdayMatches, todayMatches, upcomingTeamMatch, stats } =
    input;
  const team = profile?.favorite_country ?? "your team";
  const lines: string[] = [];

  lines.push(`Good morning, ${userName}.`);
  lines.push("");

  if (upcomingTeamMatch) {
    lines.push(
      `${team} plays ${upcomingTeamMatch.homeTeam.name === team ? upcomingTeamMatch.awayTeam.name : upcomingTeamMatch.homeTeam.name} on ${upcomingTeamMatch.date} at ${upcomingTeamMatch.time}.`
    );
    lines.push("");
  }

  lines.push("**Yesterday**");
  if (yesterdayMatches.length === 0) {
    lines.push("- No finished matches yesterday.");
  } else {
    yesterdayMatches.slice(0, 5).forEach((m) => {
      lines.push(`- ${formatMatch(m)}`);
    });
  }
  lines.push("");

  lines.push("**Today**");
  if (todayMatches.length === 0) {
    lines.push("- No matches scheduled today.");
  } else {
    todayMatches.slice(0, 5).forEach((m) => {
      lines.push(`- ${formatMatch(m)}`);
    });
  }
  lines.push("");

  if (stats) {
    lines.push("**Your FanPulse**");
    lines.push(`- Level ${stats.level} · ${stats.points} points`);
    lines.push(`- Prediction accuracy: ${stats.predictionAccuracy}%`);
    if (stats.streak > 0) lines.push(`- ${stats.streak}-day check-in streak`);
  }

  return lines.join("\n");
}

function buildSystemPrompt(
  profile: Profile | null,
  matches: Match[],
  focusMatch?: Match | null
): string {
  const team = profile?.favorite_country ?? "unknown";
  const matchSummary = matches
    .slice(0, 20)
    .map((m) => formatMatch(m))
    .join("\n");

  const focusSection = focusMatch
    ? `\nThe user is currently viewing this match: ${formatMatch(focusMatch)}${focusMatch.stadiumName ? ` at ${focusMatch.stadiumName}` : ""}.
Treat ${focusMatch.homeTeam.name} vs ${focusMatch.awayTeam.name} as the subject of the conversation. Answer about THIS match and its two teams unless the user explicitly names a different team or match. Do not switch to other fixtures (including the user's favorite team) on your own.\n`
    : "";

  return `You are FanPulse, a proactive World Cup 2026 companion. Be concise, warm, and fan-focused.
The user's favorite team is ${team}.
${focusSection}Current match data:
${matchSummary || "No match data available."}
Ground answers in this data. Do not invent scores or fixtures.`;
}

export async function generateBriefing(input: BriefingInput): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return buildTemplateBriefing(input);
  }

  try {
    const openai = new OpenAI({ apiKey });
    const context = buildTemplateBriefing(input);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(input.profile, [
            ...input.yesterdayMatches,
            ...input.todayMatches,
          ]),
        },
        {
          role: "user",
          content: `Write a personalized morning briefing (3-minute read, markdown). Use this context:\n\n${context}`,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() ?? buildTemplateBriefing(input);
  } catch {
    return buildTemplateBriefing(input);
  }
}

export async function generateCompanionReply(input: CompanionInput): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const team = input.profile?.favorite_country ?? "your team";
    return `I'm your FanPulse companion. Ask me about ${team}, today's matches, or your predictions. (Connect OPENAI_API_KEY for full AI responses.)`;
  }

  try {
    const openai = new OpenAI({ apiKey });
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(input.profile, input.matches, input.focusMatch),
        },
        {
          role: "user",
          content: input.message,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return (
      response.choices[0]?.message?.content?.trim() ??
      "Sorry, I couldn't generate a response. Try again."
    );
  } catch {
    return "Sorry, the companion is temporarily unavailable. Please try again.";
  }
}

export async function streamCompanionReply(
  input: CompanionInput
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.OPENAI_API_KEY;
  const encoder = new TextEncoder();

  if (!apiKey) {
    const fallback = await generateCompanionReply(input);
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(fallback));
        controller.close();
      },
    });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(input.profile, input.matches, input.focusMatch),
        },
        { role: "user", content: input.message },
      ],
      max_tokens: 500,
      temperature: 0.7,
      stream: true,
    });

    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode("Sorry, the companion is temporarily unavailable.")
          );
          controller.close();
        }
      },
    });
  } catch {
    const fallback = await generateCompanionReply(input);
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(fallback));
        controller.close();
      },
    });
  }
}

export { buildTemplateBriefing };
