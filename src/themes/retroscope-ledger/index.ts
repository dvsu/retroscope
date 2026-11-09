import type { Theme } from "../types";
import { colorMapping } from "./palette";

export const create = (): Theme => {
  return {
    metadata: {
      id: "retroscope-ledger",
      type: "light",
      displayName: "Retroscope Ledger",
      settingsId: "Retroscope Ledger",
    },
    colors: colorMapping,
  };
};
