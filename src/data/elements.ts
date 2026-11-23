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
  mass: number | null;
  group: number;
  period: number;
  category: ElementCategory;
  electronegativity?: number | null;
  meltingPoint?: number | null;
  boilingPoint?: number | null;
  electronConfiguration?: string;
}

// Erste Testdaten für das Layout.
// Die vollständigen 118 Elemente folgen später.
export const ELEMENTS: ChemicalElement[] = [
  {
    number: 1,
    symbol: "H",
    name: "Wasserstoff",
    mass: 1.008,
    group: 1,
    period: 1,
    category: "nonmetal",
    electronegativity: 2.2,
    meltingPoint: -259.16,
    boilingPoint: -252.87,
    electronConfiguration: "1s¹",
  },
  {
    number: 2,
    symbol: "He",
    name: "Helium",
    mass: 4.0026,
    group: 18,
    period: 1,
    category: "noble-gas",
    boilingPoint: -268.93,
    electronConfiguration: "1s²",
  },
  {
    number: 3,
    symbol: "Li",
    name: "Lithium",
    mass: 6.94,
    group: 1,
    period: 2,
    category: "alkali",
    electronegativity: 0.98,
  },
  {
    number: 4,
    symbol: "Be",
    name: "Beryllium",
    mass: 9.0122,
    group: 2,
    period: 2,
    category: "alkaline-earth",
    electronegativity: 1.57,
  },
  {
    number: 5,
    symbol: "B",
    name: "Bor",
    mass: 10.81,
    group: 13,
    period: 2,
    category: "metalloid",
    electronegativity: 2.04,
  },
  {
    number: 6,
    symbol: "C",
    name: "Kohlenstoff",
    mass: 12.011,
    group: 14,
    period: 2,
    category: "nonmetal",
    electronegativity: 2.55,
  },
  {
    number: 7,
    symbol: "N",
    name: "Stickstoff",
    mass: 14.007,
    group: 15,
    period: 2,
    category: "nonmetal",
    electronegativity: 3.04,
  },
  {
    number: 8,
    symbol: "O",
    name: "Sauerstoff",
    mass: 15.999,
    group: 16,
    period: 2,
    category: "nonmetal",
    electronegativity: 3.44,
  },
  {
    number: 9,
    symbol: "F",
    name: "Fluor",
    mass: 18.998,
    group: 17,
    period: 2,
    category: "halogen",
    electronegativity: 3.98,
  },
  {
    number: 10,
    symbol: "Ne",
    name: "Neon",
    mass: 20.18,
    group: 18,
    period: 2,
    category: "noble-gas",
  },
  {
    number: 13,
    symbol: "Al",
    name: "Aluminium",
    mass: 26.982,
    group: 13,
    period: 3,
    category: "post-transition",
    electronegativity: 1.61,
  },
  {
    number: 26,
    symbol: "Fe",
    name: "Eisen",
    mass: 55.845,
    group: 8,
    period: 4,
    category: "transition",
    electronegativity: 1.83,
    meltingPoint: 1538,
    boilingPoint: 2862,
    electronConfiguration: "[Ar] 3d⁶ 4s²",
  },
];
