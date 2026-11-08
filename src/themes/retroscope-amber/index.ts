import type { Theme } from "../types";
import { colorMapping } from "./palette";

export const create = (): Theme => {
  return {
    metadata: {
      id: "retroscope-amber",
      type: "dark",
      displayName: "Retroscope Amber",
      settingsId: "Retroscope Amber",
    },
    colors: colorMapping,
  };
};
