import tattoos from "../data/tattoos.js";

import { MiscTattooDef, OutfitTattooDef, TattooDef } from "./types.js";
import { arrayOf } from "./utils.js";

export enum OutfitTattooStatus {
  NONE = 0,
  HAVE_OUTFIT = 1,
  HAVE = 2,
}

export function loadTattoos(
  lastKnownSize = 0,
): { data: typeof tattoos; size: number } | null {
  const size = JSON.stringify(tattoos).length;

  if (size === lastKnownSize) return null;

  return {
    data: tattoos as unknown as typeof tattoos,
    size: size,
  };
}

export function isOutfitTattoo(tattoo: TattooDef): tattoo is OutfitTattooDef {
  return "outfit" in tattoo;
}

export function isMiscTattoo(tattoo: TattooDef): tattoo is MiscTattooDef {
  return "misc" in tattoo;
}

export function getMaxTattooLevel(tattoo: TattooDef): number {
  return arrayOf(tattoo.image).length;
}

export function getOutfitTattoos(
  tattoos: readonly TattooDef[],
): OutfitTattooDef[] {
  return tattoos.filter(isOutfitTattoo).sort((a, b) => a.outfit - b.outfit);
}

export function getMiscTattoos(tattoos: readonly TattooDef[]): MiscTattooDef[] {
  return tattoos.filter(isMiscTattoo).sort((a, b) => a.misc - b.misc);
}

export type RawTattoo = [id: number, level: number];

// Hobo tattoos level up as high as 19. I can't imagine this ever going higher than 32.
const tattooLevelRadix = 32;

export const compressTattoos = (tattoos: RawTattoo[]) =>
  tattoos
    .sort((a, b) => a[0] - b[0])
    .reduce(
      (r, tattoo) =>
        `${r}${"0".repeat(tattoo[0] - r.length - 1)}${tattoo[1].toString(
          tattooLevelRadix,
        )}`,
      "",
    )
    .replace(/0+$/, "");

export const expandTattoos = (s = ""): RawTattoo[] =>
  s.split("").map((c, i) => [i + 1, parseInt(c, tattooLevelRadix)]);
