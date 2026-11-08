import type { Theme } from "../types";
import { colorMapping } from "./palette";

export const create = (): Theme => {
  return {
    metadata: {
      id: "retroscope-cassette",
      type: "dark",
      displayName: "Retroscope Cassette",
      settingsId: "Retroscope Cassette",
    },
    colors: colorMapping,
  };
};
