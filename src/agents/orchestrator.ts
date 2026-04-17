import { BaseAgent } from "./base";
import { AgentEvent, SiteConfig, WidgetConfig } from "./state";

export class OrchestratorAgent extends BaseAgent {
  handleEvent(event: AgentEvent) {
    switch (event.type) {
      case "widget.config.saved":
        this.handleWidgetConfigSaved(event.payload);
        break;
      case "site.updated":
        this.handleSiteUpdated(event.payload);
        break;
      case "payment.link.created":
        this.handlePaymentLinkCreated(event.payload);
        break;
    }
  }

  private handleWidgetConfigSaved(config: WidgetConfig) {
    console.log("[Orchestrator] Widget config saved. Routing to Payment Agent...");
    this.publish({ type: "widget.config.saved", payload: config });
  }

  private handleSiteUpdated(site: SiteConfig) {
    console.log(`[Orchestrator] Site ${site.id} updated. Syncing with Analytics Agent...`);
  }

  private handlePaymentLinkCreated(payload: { widget_id: string; url: string }) {
    console.log("[Orchestrator] Payment link created. Routing to Analytics Agent...");
    this.publish({ type: "payment.link.created", payload });
  }
}
