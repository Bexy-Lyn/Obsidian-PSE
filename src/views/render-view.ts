import { renderDefaultView } from "./default-view";
import { renderBlocksView } from "./blocks-view";
import { renderPropertyView } from "./property-view";

export const PSE_VIEW_IDS = [
  "default",
  "blocks",
  "atomic-radius",
  "electronegativity",
  "electron-affinity",
  "ionization-energy",
] as const;

export type PSEViewId = (typeof PSE_VIEW_IDS)[number];

export function renderPSEView(
  container: HTMLElement,
  view: PSEViewId,
  baseColor: string,
): (() => void) | void {
  switch (view) {
    case "default":
      return renderDefaultView(container, baseColor);

    case "blocks":
      renderBlocksView(container, baseColor);
      return;

    case "atomic-radius":
      renderPropertyView(container, baseColor, "atomicRadius");
      return;

    case "electronegativity":
      renderPropertyView(container, baseColor, "electronegativity");
      return;

    case "electron-affinity":
      renderPropertyView(container, baseColor, "electronAffinity");
      return;

    case "ionization-energy":
      renderPropertyView(container, baseColor, "ionizationEnergy");
      return;
  }
}
