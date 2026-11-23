import { ELEMENTS } from "../data/elements";
import type { ChemicalElement } from "../data/elements";

export type NumericProperty =
  | "atomicRadius"
  | "electronegativity"
  | "electronAffinity"
  | "ionizationEnergy";

export interface PropertyScale {
  getColor: (element: ChemicalElement) => string;
  isInactive: (element: ChemicalElement) => boolean;
  min: number | null;
  max: number | null;
}

export function createPropertyScale(
  property: NumericProperty,
  baseColor: string,
): PropertyScale {
  const values = ELEMENTS.map((element) => element[property]).filter(
    (value): value is number =>
      typeof value === "number" && Number.isFinite(value),
  );

  const min = values.length > 0 ? Math.min(...values) : null;
  const max = values.length > 0 ? Math.max(...values) : null;

  function isInactive(element: ChemicalElement): boolean {
    const value = element[property];

    return typeof value !== "number" || !Number.isFinite(value);
  }

  function getColor(element: ChemicalElement): string {
    const value = element[property];

    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      min === null ||
      max === null
    ) {
      return "#909090";
    }

    const normalized = max === min ? 1 : (value - min) / (max - min);

    const percentage = Math.max(0, Math.min(100, normalized * 100));

    return `color-mix(in srgb, ${baseColor} ${percentage}%, #909090)`;
  }

  return { getColor, isInactive, min, max };
}
