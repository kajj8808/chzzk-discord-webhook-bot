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
