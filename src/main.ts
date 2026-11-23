import { Plugin, parseYaml, MarkdownRenderChild } from "obsidian";
import { renderDefaultView } from "./views/default-view";

interface PSEConfig {
  color: string;
  views: string[];
}

const DEFAULT_CONFIG: PSEConfig = {
  color: "#167474",
  views: ["default"],
};

class PSEViewChild extends MarkdownRenderChild {
  private cleanup?: () => void;

  constructor(
    containerEl: HTMLElement,
    private readonly color: string,
  ) {
    super(containerEl);
  }

  onload(): void {
    this.cleanup = renderDefaultView(this.containerEl, this.color);
  }

  onunload(): void {
    this.cleanup?.();
  }
}

export default class PSEPlugin extends Plugin {
  async onload() {
    this.registerMarkdownCodeBlockProcessor("pse", (source, el, ctx) => {
      const config = this.parseConfig(source);

      const container = el.createDiv({
        cls: "pse-container",
      });

      container.style.setProperty("--pse-base-color", config.color);

      ctx.addChild(new PSEViewChild(container, config.color));
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
