import { serve } from "@hono/node-server";
import { Hono } from "hono";
import db from "../lib/db";
import { sleep } from "../lib/utile";
import {
  downloadChzzkThumbnail,
  getChzzkLiveDetail,
  getChzzkThumbnail,
  updateChzzkChannels,
} from "../lib/chzzk";
import express from "express";
import { writeFileSync } from "fs";

const expressApp = express();

expressApp.use(express.static("public"));

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

const port = 5000;

expressApp.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
/* serve({
  fetch: channel.fetch,
  port,
}); */

(async () => {
  while (true) {
    // 5분에 한번씩 반복
    await sleep(1000 * 60 * 5);
    await updateChzzkChannels();
    break;
  }
})();
