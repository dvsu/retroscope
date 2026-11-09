import type { Theme } from "../types";
import { colorMapping } from "./palette";

export const create = (): Theme => {
  return {
    metadata: {
      id: "retroscope-dawn",
      type: "light",
      displayName: "Retroscope Dawn",
      settingsId: "Retroscope Dawn",
    },
    colors: colorMapping,
  };
};
