import { LiveContent } from "../types/interface";
import db from "./db";
import { sendLiveDataToDiscord } from "./discord";
import _ from "lodash";
import { downloadFile, isEqualLive } from "./utile";
import path from "path";

const API_URL = "https://api.chzzk.naver.com/service/v3";

export async function getChzzkLiveDetail(channelId: string) {
  const json = (await (
    await fetch(`${API_URL}/channels/${channelId}/live-detail`, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
      },
    })
  ).json()) as LiveContent;
  return json;
}

export async function updateChzzkChannels() {
  const channels = await db.channel.findMany({
    select: {
      id: true,
    },
  });

  for (let channel of channels) {
    const result = await getChzzkLiveDetail(channel.id);

    if (result.code === 200) {
      const live = result.content;
      await db.channel.update({
        where: {
          id: channel.id,
        },
        data: {
          name: live.channel.channelName,
          profile: live.channel.channelImageUrl,
        },
      });

      const prevLive = await db.live.findUnique({
        where: {
          id: live.liveId,
        },
      });

      if (prevLive) {
        const newLive = await db.live.update({
          where: {
            id: prevLive.id,
          },
          data: {
            category: live.categoryType,
            live_category: live.liveCategory,
            live_category_value: live.liveCategoryValue,
            title: live.liveTitle,
          },
        });
        // 여기 수정
        if (!isEqualLive(prevLive, newLive)) {
          // 다른 방송으로 변경 했을때만 thumnail을 변경.
          const thumbnailId = await downloadChzzkThumbnail(live.liveImageUrl);

          const newLive = await db.live.update({
            where: { id: prevLive.id },
            data: { thumbnail: thumbnailId },
          });

          await sendLiveDataToDiscord(newLive);
        }
        if (live.closeDate) {
          await db.live.update({
            where: {
              id: prevLive.id,
            },
            data: {
              close: new Date(live.closeDate),
            },
          });
        }
      } else {
        const thumbnailId = await downloadChzzkThumbnail(live.liveImageUrl);
        const newLive = await db.live.create({
          data: {
            id: live.liveId,
            category: live.categoryType,
            live_category: live.liveCategory,
            live_category_value: live.liveCategoryValue,
            thumbnail: thumbnailId,
            title: live.liveTitle,
            open: new Date(live.openDate),
            channel: {
              connect: {
                id: channel.id,
              },
            },
          },
        });
        await sendLiveDataToDiscord(newLive);
      }
    } else {
      console.error(`#${result.code}-${result.message}`);
    }
  }
}

export function getChzzkThumbnail(url: string) {
  const splitUrl = url.split("/image");
  const baseUrl = splitUrl[0];

  return `${baseUrl}/image_480.jpg?date=${new Date().getTime()}`;
}

/** chzzk섬네일이 시간별로 변동이 생겨 사용.  */
export async function downloadChzzkThumbnail(liveThumbnail: string) {
  const IMAGE_DIR = path.join(__dirname, "../public", "image");
  const url = getChzzkThumbnail(liveThumbnail);
  const thumbnailId = `${new Date().getTime()}`;
  const outputPath = path.join(IMAGE_DIR, thumbnailId);
  await downloadFile(url, outputPath);
  return thumbnailId;
}
