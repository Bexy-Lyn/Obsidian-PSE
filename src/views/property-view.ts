import { renderSimpleGrid } from "./simple-grid";
import { createPropertyScale } from "../utils/property-scale";
import type { NumericProperty } from "../utils/property-scale";

export function renderPropertyView(
  container: HTMLElement,
  baseColor: string,
  property: NumericProperty,
): void {
  const scale = createPropertyScale(property, baseColor);

  renderSimpleGrid(container, {
    getColor: scale.getColor,
    isInactive: scale.isInactive,
  });
}
