import { Plugin, parseYaml } from "obsidian";

interface PSEConfig {
  color: string;
  views: string[];
}

const DEFAULT_CONFIG: PSEConfig = {
  color: "#167474",
  views: ["default"],
};

export default class PSEPlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor("pse", (source, el) => {
      const config = this.parseConfig(source);

      const container = el.createDiv({
        cls: "pse-container",
      });

      container.style.setProperty("--pse-base-color", config.color);

      container.createDiv({
        cls: "pse-placeholder",
        text: "Periodensystem – Standardansicht",
      });
    });
  }

  private parseConfig(source: string): PSEConfig {
    let parsed: unknown;

    try {
      parsed = parseYaml(source);
    } catch {
      return { ...DEFAULT_CONFIG };
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...DEFAULT_CONFIG };
    }

    const data = parsed as Record<string, unknown>;

    const color =
      typeof data.color === "string" && /^#[0-9a-fA-F]{6}$/.test(data.color)
        ? data.color
        : DEFAULT_CONFIG.color;

    const views = Array.isArray(data.views)
      ? data.views.filter((view): view is string => typeof view === "string")
      : [...DEFAULT_CONFIG.views];

    return {
      color,
      views: views.length ? views : [...DEFAULT_CONFIG.views],
    };
  }
}
