import { ELEMENTS, type ChemicalElement } from "../data/elements";
import { getCategoryColor } from "../utils/colors";
import { getElementPosition } from "../utils/layout";
import {
  getPSELanguage,
  getElementName,
  getCategoryName,
  translate,
  formatPSEValue,
  formatAtomicMass,
} from "../i18n";

function formatNumber(value: number): string {
  return formatPSEValue(value);
}

function addProperty(
  parent: HTMLElement,
  label: string,
  value: string | null | undefined,
): void {
  if (value == null) return;

  const row = parent.createDiv({
    cls: "pse-tooltip-row",
  });

  row.createSpan({
    cls: "pse-tooltip-label",
    text: label,
  });

  row.createSpan({
    cls: "pse-tooltip-value",
    text: value,
  });
}

function fillTooltip(tooltip: HTMLElement, element: ChemicalElement): void {
  tooltip.empty();

  tooltip.createDiv({
    cls: "pse-tooltip-heading",
    text: `${getElementName(element)} (${element.symbol})`,
  });

  addProperty(
    tooltip,
    translate("properties", "atomicNumber"),
    String(element.number),
  );

  addProperty(
    tooltip,
    translate("properties", "atomicMass"),
    element.mass == null ? null : `${element.mass} u`,
  );

  addProperty(
    tooltip,
    translate("properties", "category"),
    getCategoryName(element.category),
  );

  addProperty(
    tooltip,
    translate("properties", "electronegativity"),
    element.electronegativity == null
      ? null
      : formatNumber(element.electronegativity),
  );

  addProperty(
    tooltip,
    translate("properties", "meltingPoint"),
    element.meltingPoint == null
      ? null
      : `${formatNumber(element.meltingPoint)} °C`,
  );

  addProperty(
    tooltip,
    translate("properties", "boilingPoint"),
    element.boilingPoint == null
      ? null
      : `${formatNumber(element.boilingPoint)} °C`,
  );

  addProperty(
    tooltip,
    translate("properties", "electronConfiguration"),
    element.electronConfiguration,
  );

  addProperty(
    tooltip,
    translate("properties", "oxidationStates"),
    element.oxidationStates,
  );

  addProperty(
    tooltip,
    translate("properties", "atomicRadius"),
    element.atomicRadius == null
      ? null
      : `${formatNumber(element.atomicRadius)} pm`,
  );

  addProperty(
    tooltip,
    translate("properties", "ionizationEnergy"),
    element.ionizationEnergy == null
      ? null
      : `${formatNumber(element.ionizationEnergy)} eV`,
  );
}

export function renderDefaultView(
  container: HTMLElement,
  baseColor: string,
): () => void {
  const grid = container.createDiv({
    cls: "pse-grid",
  });

  const tooltip = document.body.createDiv({
    cls: "pse-tooltip",
  });

  tooltip.setAttribute("role", "tooltip");
  tooltip.hidden = true;
  let pinnedTile: HTMLElement | null = null;
  let activeTile: HTMLElement | null = null;

  function positionTooltip(tile: HTMLElement): void {
    const rect = tile.getBoundingClientRect();

    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;

    const left = Math.max(
      8,
      Math.min(rect.left, window.innerWidth - tooltipWidth - 8),
    );

    const below = rect.bottom + 8;
    const above = rect.top - tooltipHeight - 8;

    const top =
      below + tooltipHeight <= window.innerHeight ? below : Math.max(8, above);

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function closeTooltip(): void {
    pinnedTile = null;
    activeTile = null;
    tooltip.hidden = true;
    tooltip.classList.remove("pse-tooltip-pinned");
  }

  function showTooltip(
    tile: HTMLElement,
    element: ChemicalElement,
    pinned = false,
  ): void {
    if (pinnedTile && !pinned) return;

    activeTile = tile;

    if (pinned) {
      pinnedTile = tile;
    }

    fillTooltip(tooltip, element);

    tooltip.hidden = false;
    tooltip.classList.toggle("pse-tooltip-pinned", pinned);

    if (!pinned) {
      positionTooltip(tile);
    }
  }

  function hideTooltip(tile: HTMLElement): void {
    if (pinnedTile || activeTile !== tile) return;

    activeTile = null;
    tooltip.hidden = true;
  }

  const onPointerDown = (event: PointerEvent) => {
    if (!pinnedTile) return;

    const target = event.target;

    if (
      target instanceof Node &&
      !tooltip.contains(target) &&
      !grid.contains(target)
    ) {
      closeTooltip();
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeTooltip();
    }
  };

  for (const element of ELEMENTS) {
    const tile = grid.createDiv({
      cls: "pse-element",
      attr: {
        tabindex: "0",
        "aria-label": `${getElementName(element)}, ${translate(
          "properties",
          "atomicNumber",
        )} ${element.number}`,
      },
    });

    tile.addEventListener("click", (event) => {
      event.stopPropagation();

      if (pinnedTile === tile) {
        closeTooltip();
      } else {
        showTooltip(tile, element, true);
      }
    });

    const position = getElementPosition(element);

    tile.style.gridColumn = String(position.column);
    tile.style.gridRow = String(position.row);

    tile.style.backgroundColor = getCategoryColor(baseColor, element.category);

    tile.createDiv({
      cls: "pse-element-number",
      text: String(element.number),
    });

    tile.createDiv({
      cls: "pse-element-symbol",
      text: element.symbol,
    });

    tile.createDiv({
      cls: "pse-element-name",
      text: getElementName(element),
    });

    tile.createDiv({
      cls: "pse-element-mass",
      text: formatAtomicMass(element.mass),
    });

    tile.addEventListener("mouseenter", () => {
      showTooltip(tile, element);
    });

    tile.addEventListener("mouseleave", () => {
      hideTooltip(tile);
    });

    tile.addEventListener("focus", () => {
      showTooltip(tile, element);
    });

    tile.addEventListener("blur", () => {
      hideTooltip(tile);
    });

    tile.setAttribute("aria-describedby", "pse-element-tooltip");
  }

  const reposition = () => {
    if (activeTile && !pinnedTile) {
      positionTooltip(activeTile);
    }
  };

  window.addEventListener("resize", reposition);
  window.addEventListener("scroll", reposition, true);
  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("keydown", onKeyDown);

  // Cleanup-Funktion für den Obsidian-Lebenszyklus
  return () => {
    window.removeEventListener("resize", reposition);
    window.removeEventListener("scroll", reposition, true);
    document.removeEventListener("pointerdown", onPointerDown);
    document.removeEventListener("keydown", onKeyDown);
    tooltip.remove();
  };
}
