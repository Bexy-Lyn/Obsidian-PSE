import { ELEMENTS, type ChemicalElement } from "../data/elements";
import { getCategoryColor } from "../utils/colors";

function formatNumber(value: number): string {
  return value.toLocaleString("de-DE", {
    maximumFractionDigits: 4,
  });
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
    text: `${element.name} (${element.symbol})`,
  });

  addProperty(tooltip, "Ordnungszahl", String(element.number));

  addProperty(
    tooltip,
    "Atommasse",
    element.mass == null ? null : `${formatNumber(element.mass)} u`,
  );

  addProperty(
    tooltip,
    "Elektronegativität (Pauling)",
    element.electronegativity == null
      ? null
      : formatNumber(element.electronegativity),
  );

  addProperty(
    tooltip,
    "Schmelzpunkt",
    element.meltingPoint == null
      ? null
      : `${formatNumber(element.meltingPoint)} °C`,
  );

  addProperty(
    tooltip,
    "Siedepunkt",
    element.boilingPoint == null
      ? null
      : `${formatNumber(element.boilingPoint)} °C`,
  );

  addProperty(
    tooltip,
    "Elektronenkonfiguration",
    element.electronConfiguration,
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

  function showTooltip(tile: HTMLElement, element: ChemicalElement): void {
    activeTile = tile;
    fillTooltip(tooltip, element);
    tooltip.hidden = false;
    positionTooltip(tile);
  }

  function hideTooltip(tile: HTMLElement): void {
    if (activeTile !== tile) return;

    activeTile = null;
    tooltip.hidden = true;
  }

  for (const element of ELEMENTS) {
    const tile = grid.createDiv({
      cls: "pse-element",
      attr: {
        tabindex: "0",
        "aria-label": `${element.name}, Ordnungszahl ${element.number}`,
      },
    });

    tile.style.gridColumn = String(element.group);
    tile.style.gridRow = String(element.period);

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
      text: element.name,
    });

    tile.createDiv({
      cls: "pse-element-mass",
      text: element.mass == null ? "—" : formatNumber(element.mass),
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

    //tile.setAttribute("aria-describedby", "pse-element-tooltip");
  }

  const reposition = () => {
    if (activeTile) positionTooltip(activeTile);
  };

  window.addEventListener("resize", reposition);
  window.addEventListener("scroll", reposition, true);

  // Cleanup-Funktion für den Obsidian-Lebenszyklus
  return () => {
    window.removeEventListener("resize", reposition);
    window.removeEventListener("scroll", reposition, true);
    tooltip.remove();
  };
}
