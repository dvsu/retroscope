import type { Theme } from "../types";
import { colorMapping } from "./palette";

export const create = (): Theme => {
  return {
    metadata: {
      id: "retroscope-high-contrast",
      type: "dark",
      displayName: "Retroscope High Contrast",
    },
    colors: colorMapping,
  };
};
