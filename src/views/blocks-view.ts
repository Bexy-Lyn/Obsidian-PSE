import { renderSimpleGrid } from "./simple-grid";
import { getElectronBlock, getBlockOrbitalLabel } from "../utils/blocks";
import { getBlockColor } from "../utils/colors";

export function renderBlocksView(
  container: HTMLElement,
  baseColor: string,
): void {
  renderSimpleGrid(container, {
    getColor: (element) => getBlockColor(baseColor, getElectronBlock(element)),

    getLabel: (element) => getBlockOrbitalLabel(element),
  });
}
