import { Live } from "@prisma/client";
import _ from "lodash";

export async function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(true);
    }, ms)
  );
}

export function isEqualLive(prevLive: Live, newLive: Live) {
  const { thumbnail: prevThum, ...prevData } = prevLive;
  const { thumbnail: newThum, ...newData } = newLive;
  return _.isEqual(prevData, newData);
}

import fs from "fs";
export async function downloadFile(url: string, outputPath: string) {
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buffer) => fs.writeFileSync(outputPath, Buffer.from(buffer)));
}
