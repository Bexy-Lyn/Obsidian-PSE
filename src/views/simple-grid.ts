import { ELEMENTS } from "../data/elements";
import type { ChemicalElement } from "../data/elements";
import { getElementPosition } from "../utils/layout";

export interface SimpleGridOptions {
  getColor: (element: ChemicalElement) => string;
  getLabel: (element: ChemicalElement) => string;
  isInactive?: (element: ChemicalElement) => boolean;
}

export function renderSimpleGrid(
  container: HTMLElement,
  options: SimpleGridOptions,
): void {
  const scroll = container.createDiv({
    cls: "pse-grid-scroll",
  });

  const grid = scroll.createDiv({
    cls: "pse-grid pse-simple-grid",
  });

  for (const element of ELEMENTS) {
    const position = getElementPosition(element);

    const tile = grid.createDiv({
      cls: "pse-element pse-simple-element",
    });

    tile.style.gridColumn = String(position.column);
    tile.style.gridRow = String(position.row);
    tile.style.backgroundColor = options.getColor(element);

    if (options.isInactive?.(element)) {
      tile.addClass("pse-element-inactive");
    }

    tile.createDiv({
      cls: "pse-element-number",
      text: String(element.number),
    });

    tile.createDiv({
      cls: "pse-element-symbol",
      text: element.symbol,
    });

    tile.createDiv({
      cls: "pse-element-value",
      text: options.getLabel(element),
    });
  }
}
