import { MarkdownRenderChild, Plugin, parseYaml } from "obsidian";

import { PSE_VIEW_IDS, renderPSEView } from "./views/render-view";

import type { PSEViewId } from "./views/render-view";

import { translate } from "./i18n";

// ---------------------------------------------
// Configuration
// ---------------------------------------------

interface PSEConfig {
  color: string;
  views: PSEViewId[];
}

const DEFAULT_CONFIG: PSEConfig = {
  color: "#167474",
  views: ["default"],
};

function isValidHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

function isPSEViewId(value: unknown): value is PSEViewId {
  return (
    typeof value === "string" &&
    (PSE_VIEW_IDS as readonly string[]).includes(value)
  );
}

function parsePSEConfig(source: string): PSEConfig {
  let parsed: unknown;

  try {
    parsed = parseYaml(source);
  } catch (error) {
    console.error("[PSE] Failed to parse YAML configuration:", error);

    return {
      ...DEFAULT_CONFIG,
      views: [...DEFAULT_CONFIG.views],
    };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      ...DEFAULT_CONFIG,
      views: [...DEFAULT_CONFIG.views],
    };
  }

  const data = parsed as Record<string, unknown>;

  // Base color
  const color = isValidHexColor(data.color) ? data.color : DEFAULT_CONFIG.color;

  if (data.color !== undefined && !isValidHexColor(data.color)) {
    console.warn("[PSE] Invalid color. Using default:", DEFAULT_CONFIG.color);
  }

  // Enabled views
  let views: PSEViewId[] = [...DEFAULT_CONFIG.views];

  if (Array.isArray(data.views)) {
    const validViews = data.views.filter(isPSEViewId);

    // Remove duplicates while preserving order.
    const uniqueViews = [...new Set(validViews)];

    if (uniqueViews.length > 0) {
      views = uniqueViews;
    }

    const invalidViews = data.views.filter((view) => !isPSEViewId(view));

    if (invalidViews.length > 0) {
      console.warn("[PSE] Ignoring unsupported views:", invalidViews);
    }
  } else if (data.views !== undefined) {
    console.warn("[PSE] The 'views' setting must be an array.");
  }

  return { color, views };
}

// ---------------------------------------------
// Markdown render child
// ---------------------------------------------

class PSEViewChild extends MarkdownRenderChild {
  private cleanupView?: () => void;

  constructor(
    container: HTMLElement,
    private readonly config: PSEConfig,
  ) {
    super(container);
  }

  onload(): void {
    this.render();
  }

  onunload(): void {
    this.cleanupView?.();
    this.cleanupView = undefined;
  }

  private render(): void {
    const root = this.containerEl;

    root.empty();
    root.addClass("pse-container");

    root.style.setProperty("--pse-base-color", this.config.color);

    const tabs = root.createDiv({
      cls: "pse-tabs",
    });

    const content = root.createDiv({
      cls: "pse-view-content",
    });

    const buttons = new Map<PSEViewId, HTMLButtonElement>();

    let activeView: PSEViewId = this.config.views[0] ?? "default";

    const activate = (view: PSEViewId): void => {
      // Clean up the previous renderer first.
      this.cleanupView?.();
      this.cleanupView = undefined;

      content.empty();

      activeView = view;

      // Update the selected tab.
      for (const [id, button] of buttons) {
        const selected = id === activeView;

        button.toggleClass("is-active", selected);

        button.setAttribute("aria-selected", String(selected));

        button.setAttribute("tabindex", selected ? "0" : "-1");
      }

      // Render the selected view.
      const cleanup = renderPSEView(content, activeView, this.config.color);

      if (typeof cleanup === "function") {
        this.cleanupView = cleanup;
      }
    };

    // Only show tabs when multiple views are enabled.
    if (this.config.views.length > 1) {
      tabs.setAttribute("role", "tablist");

      for (const view of this.config.views) {
        const button = tabs.createEl("button", {
          cls: "pse-tab",
          text: translate("views", view),
          attr: {
            type: "button",
            role: "tab",
            "aria-selected": "false",
            tabindex: "-1",
          },
        });

        button.addEventListener("click", () => {
          activate(view);
        });

        buttons.set(view, button);
      }
    } else {
      tabs.remove();
    }

    // Render the initial view.
    activate(activeView);
  }
}

// ---------------------------------------------
// Plugin entry point
// ---------------------------------------------

export default class PSEPlugin extends Plugin {
  onload(): void {
    this.registerMarkdownCodeBlockProcessor("pse", (source, el, ctx) => {
      const config = parsePSEConfig(source);

      const container = el.createDiv({
        cls: "pse-wrapper",
      });

      ctx.addChild(new PSEViewChild(container, config));
    });
  }
}
