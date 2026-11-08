import type { Theme } from "../types";
import { colorMapping } from "./palette";

export const create = (): Theme => {
  return {
    metadata: {
      id: "retroscope-phosphor",
      type: "dark",
      displayName: "Retroscope Phosphor",
      settingsId: "Retroscope Phosphor",
    },
    colors: colorMapping,
  };
};
