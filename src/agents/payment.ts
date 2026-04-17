import { BaseAgent } from "./base";
import { AgentEvent, WidgetConfig } from "./state";

export class PaymentAgent extends BaseAgent {
  handleEvent(event: AgentEvent) {
    if (event.type === "widget.config.saved") {
      this.createPaymentLink(event.payload);
    }
  }

  private async createPaymentLink(config: WidgetConfig) {
    console.log("[Payment Agent] Creating Locus payment link...");

    try {
      const baseUrl = process.env.LOCUS_BASE_URL || "https://api.locus.sh";
      const apiKey = process.env.LOCUS_API_KEY;

      if (!apiKey) {
        console.warn("[Payment Agent] No LOCUS_API_KEY set, using mock.");
        this.publishMockLink(config);
        return;
      }

      const res = await fetch(`${baseUrl}/v1/payment-links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          amount: config.amount.value,
          currency: config.amount.currency,
          payment_methods: config.payment_methods,
          success_url: config.redirects.success_url,
          failure_url: config.redirects.failure_url,
          metadata: {
            widget_id: config.widget_id,
            merchant_id: config.merchant_id,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `API error ${res.status}`);
      }

      const data = await res.json();
      this.publish({
        type: "payment.link.created",
        payload: {
          widget_id: config.widget_id,
          url: data.url || data.payment_link_url,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Payment Agent] API call failed, falling back to mock:", msg);
      this.publishMockLink(config);
    }
  }

  private publishMockLink(config: WidgetConfig) {
    const mockUrl = `https://pay.locus.sh/${config.widget_id}`;
    this.publish({
      type: "payment.link.created",
      payload: { widget_id: config.widget_id, url: mockUrl },
    });
  }
}
