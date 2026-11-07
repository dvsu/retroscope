import type { Theme } from "../types";
import { colorMapping } from "./palette";

export const create = (): Theme => {
  return {
    metadata: {
      id: "retroscope-soft",
      type: "dark",
      displayName: "Retroscope Soft",
    },
    colors: colorMapping,
  };
};
