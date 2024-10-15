import { Live } from "@prisma/client";
import { EmbedBuilder, WebhookClient } from "discord.js";
import db from "./db";
import { getChzzkThumbnail } from "./chzzk";

const webhookClient = new WebhookClient({
  url: process.env.WEBHOOK_URL!,
});

export async function sendLiveDataToDiscord(live: Live) {
  const channel = await db.channel.findUnique({
    where: {
      id: live.channel_id!,
    },
  });
  if (channel) {
    const embed = new EmbedBuilder()
      .setTitle(live.title)
      .setColor("Green")
      .setAuthor({
        name: channel.name ?? "name error",
        iconURL: channel.profile ?? "icon error",
        url: `https://chzzk.naver.com/${channel.id}`,
      })
      .setDescription(`${live.live_category_value} - ${live.live_category}`)
      .setURL(`https://chzzk.naver.com/live/${live.channel_id}`)
      .setThumbnail(getChzzkThumbnail(live.thumbnail))
      .setTimestamp();

    webhookClient.send({
      embeds: [embed],
    });
  } else {
    webhookClient.send(`Error: ${live.channel_id}`);
  }
}
