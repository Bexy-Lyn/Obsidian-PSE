import elementData from "./elements.json";

export type ElementCategory =
  | "alkali"
  | "alkaline-earth"
  | "transition"
  | "post-transition"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble-gas"
  | "lanthanide"
  | "actinide";

export interface ChemicalElement {
  number: number;
  symbol: string;
  name: string;
  mass: string | null;

  group: number | null;
  period: number;
  category: ElementCategory;

  electronegativity?: number | null;
  meltingPoint?: number | null;
  boilingPoint?: number | null;
  electronConfiguration?: string | null;
  oxidationStates?: string | null;
  atomicRadius?: number | null;
  ionizationEnergy?: number | null;
}

export const ELEMENTS: ChemicalElement[] = elementData as ChemicalElement[];
