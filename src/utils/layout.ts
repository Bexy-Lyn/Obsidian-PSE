import type { ChemicalElement } from "../data/elements";

export interface GridPosition {
  row: number;
  column: number;
}

export function getElementPosition(element: ChemicalElement): GridPosition {
  const { number, period, group } = element;

  // Lanthanoide: La (57) bis Lu (71)
  if (number >= 57 && number <= 71) {
    return {
      row: 9,
      column: number - 54,
    };
  }

  // Actinoide: Ac (89) bis Lr (103)
  if (number >= 89 && number <= 103) {
    return {
      row: 10,
      column: number - 86,
    };
  }

  // Hauptperiodensystem
  if (group === null) {
    throw new Error(`Keine Rasterposition für ${element.symbol}`);
  }

  return {
    row: period,
    column: group,
  };
}
