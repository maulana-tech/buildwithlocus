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
      const apiKey = process.env.LOCUS_API_KEY;
      const apiBase = process.env.LOCUS_API_BASE || "https://api.paywithlocus.com/api";

      if (!apiKey) {
        console.warn("[Payment Agent] No LOCUS_API_KEY set, using mock.");
        this.publishMockLink(config);
        return;
      }

      const res = await fetch(`${apiBase}/checkout/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          amount: String(config.amount.value),
          description: config.branding.button_label || "Payment",
          successUrl: config.redirects.success_url,
          cancelUrl: config.redirects.failure_url,
          metadata: {
            widget_id: config.widget_id,
            merchant_id: config.merchant_id,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as Record<string, string>).message || `API error ${res.status}`);
      }

      const data = await res.json() as { success?: boolean; data?: { id?: string }; id?: string };
      const session = data.success ? data.data : data;
      const sessionId = (session as Record<string, unknown>).id as string;
      const checkoutUrl = `https://checkout.paywithlocus.com/${sessionId}`;

      this.publish({
        type: "payment.link.created",
        payload: {
          widget_id: config.widget_id,
          url: checkoutUrl,
        },
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[Payment Agent] API call failed, falling back to mock:", msg);
      this.publishMockLink(config);
    }
  }

  private publishMockLink(config: WidgetConfig) {
    const mockUrl = `https://checkout.paywithlocus.com/mock-${config.widget_id}`;
    this.publish({
      type: "payment.link.created",
      payload: { widget_id: config.widget_id, url: mockUrl },
    });
  }
}
