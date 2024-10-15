import { serve } from "@hono/node-server";
import { Hono } from "hono";
import db from "../lib/db";
import { sleep } from "../lib/lib";

const channel = new Hono().basePath("/channel");

channel.post("/insert", async (c) => {
  const body = await c.req.json();
  const channelId = body["channel_id"];

  if (channelId) {
    try {
      await db.channel.create({
        data: {
          id: channelId,
        },
      });
    } catch (error) {
      return c.json({
        ok: false,
        error: error,
      });
    }
    return c.json({
      ok: true,
      channelId: channelId,
    });
  }
  return c.json({
    ok: false,
    error: "channel_id 값이 없습니다.",
  });
});

channel.get("/:channelId/live", async (c) => {
  const { channelId } = c.req.param();
  if (!channelId) return c.json({ ok: false, error: "not found channel id" });
  const lives = await db.live.findMany({
    where: {
      channel_id: channelId,
    },
  });
  return c.json({
    ok: true,
    lives: lives,
  });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: channel.fetch,
  port,
});

import {} from "../lib/discord";

(async () => {
  while (true) {
    console.log("3 second!");
    // 10분에 한번씩 반복
    await sleep(1000 * 60 * 1);
  }
})();
