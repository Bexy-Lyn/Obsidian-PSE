import { renderSimpleGrid } from "./simple-grid";
import { getElectronBlock } from "../utils/blocks";
import { getBlockColor } from "../utils/colors";

export function renderBlocksView(
  container: HTMLElement,
  baseColor: string,
): void {
  renderSimpleGrid(container, {
    getColor: (element) => getBlockColor(baseColor, getElectronBlock(element)),
  });
}
