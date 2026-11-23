import type { ElementCategory } from "../data/elements";

const HUE_SHIFTS: Record<ElementCategory, number> = {
  alkali: -105,
  "alkaline-earth": -80,
  transition: 0,
  "post-transition": 45,
  metalloid: 75,
  nonmetal: 125,
  halogen: 155,
  "noble-gas": 180,
  lanthanide: -15,
  actinide: -15,
};

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));

    switch (max) {
      case r:
        hue = ((g - b) / delta) % 6;
        break;
      case g:
        hue = (b - r) / delta + 2;
        break;
      default:
        hue = (r - g) / delta + 4;
    }

    hue *= 60;
  }

  return [(hue + 360) % 360, saturation * 100, lightness * 100];
}

export function getCategoryColor(
  baseColor: string,
  category: ElementCategory,
): string {
  const [hue, saturation] = hexToHsl(baseColor);
  const shiftedHue = (hue + HUE_SHIFTS[category] + 360) % 360;

  return `hsl(${shiftedHue}, ${Math.min(saturation, 55)}%, 68%)`;
}
