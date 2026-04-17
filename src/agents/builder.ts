import { BaseAgent } from "./base";
import { AgentEvent, WidgetConfig, SiteConfig } from "./state";

type ValidationError = { field: string; message: string };

function validateWidgetConfig(config: WidgetConfig): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!config.widget_id) errors.push({ field: "widget_id", message: "Widget ID is required" });
  if (!config.merchant_id) errors.push({ field: "merchant_id", message: "Merchant ID is required" });
  if (!config.branding.primary_color) errors.push({ field: "branding.primary_color", message: "Primary color is required" });
  if (!config.branding.button_label) errors.push({ field: "branding.button_label", message: "Button label is required" });
  if (!config.payment_methods || config.payment_methods.length === 0) {
    errors.push({ field: "payment_methods", message: "At least one payment method is required" });
  }
  if (config.amount.type === "fixed" && (!config.amount.value || config.amount.value <= 0)) {
    errors.push({ field: "amount.value", message: "Amount must be greater than 0 for fixed type" });
  }
  if (!config.amount.currency) errors.push({ field: "amount.currency", message: "Currency is required" });

  return errors;
}

function validateSiteConfig(config: SiteConfig): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!config.username || !/^[a-zA-Z0-9_-]+$/.test(config.username)) {
    errors.push({ field: "username", message: "Username must be alphanumeric (dashes/underscores ok)" });
  }
  if (!config.blocks || config.blocks.length === 0) {
    errors.push({ field: "blocks", message: "At least one block is required" });
  }

  config.blocks.forEach((block, i) => {
    if (block.type === "profile" && !("name" in block) ) {
      errors.push({ field: `blocks[${i}].name`, message: "Profile name is required" });
    }
    if (block.type === "link") {
      if (!("title" in block)) errors.push({ field: `blocks[${i}].title`, message: "Link title is required" });
      if (!("url" in block)) errors.push({ field: `blocks[${i}].url`, message: "Link URL is required" });
    }
  });

  return errors;
}

export class BuilderAgent extends BaseAgent {
  handleEvent(_event: AgentEvent) {}

  saveConfig(config: WidgetConfig): ValidationError[] {
    const errors = validateWidgetConfig(config);
    if (errors.length > 0) {
      console.warn("[Builder Agent] Validation errors:", errors);
      return errors;
    }

    console.log("[Builder Agent] Config valid. Publishing...");
    this.publish({ type: "widget.config.saved", payload: config });
    return [];
  }

  saveSite(site: SiteConfig): ValidationError[] {
    const errors = validateSiteConfig(site);
    if (errors.length > 0) {
      console.warn("[Builder Agent] Site validation errors:", errors);
      return errors;
    }

    console.log("[Builder Agent] Site valid. Publishing...");
    this.publish({ type: "site.updated", payload: site });
    return [];
  }
}
