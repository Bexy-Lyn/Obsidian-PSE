import type { ChemicalElement } from "../data/elements";

export type ElectronBlock = "s" | "p" | "d" | "f";

export function getElectronBlock(element: ChemicalElement): ElectronBlock {
  const n = element.number;

  // Conventional detached f-block representation:
  // La–Lu and Ac–Lr
  if ((n >= 57 && n <= 71) || (n >= 89 && n <= 103)) {
    return "f";
  }

  // Helium has a filled 1s orbital,
  // despite its position in group 18.
  if (n === 2) {
    return "s";
  }

  if (element.group === 1 || element.group === 2) {
    return "s";
  }

  if (element.group !== null && element.group >= 3 && element.group <= 12) {
    return "d";
  }

  return "p";
}

export function getBlockOrbitalLabel(element: ChemicalElement): string {
  const block = getElectronBlock(element);

  switch (block) {
    case "s":
      return `${element.period}s`;

    case "p":
      return `${element.period}p`;

    case "d":
      return `${element.period - 1}d`;

    case "f":
      return `${element.period - 2}f`;
  }
}
