import type { Theme } from "../types";
import { colorMapping } from "./palette";

export const create = (): Theme => {
  return {
    metadata: {
      id: "retroscope",
      type: "dark",
      displayName: "Retroscope",
    },
    colors: colorMapping,
  };
};
