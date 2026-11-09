import type { Theme } from "../types";
import { colorMapping } from "./palette";

export const create = (): Theme => {
  return {
    metadata: {
      id: "retroscope-paper",
      type: "light",
      displayName: "Retroscope Paper",
      settingsId: "Retroscope Paper",
    },
    colors: colorMapping,
  };
};
