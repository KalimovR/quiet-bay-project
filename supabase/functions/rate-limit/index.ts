import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RATE_LIMIT_MS = 1300;

// Хранилище в памяти (на один Edge-инстанс)
const lastMessageMap = new Map<string, number>();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  const now = Date.now();
  const lastTime = lastMessageMap.get(ip) ?? 0;

  if (now - lastTime < RATE_LIMIT_MS) {
    return new Response(
      JSON.stringify({
        error: "Too many messages",
        retryAfterMs: RATE_LIMIT_MS - (now - lastTime),
      }),
      {
        status: 429,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  }

  lastMessageMap.set(ip, now);

  return new Response(
    JSON.stringify({ ok: true }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    }
  );
});
