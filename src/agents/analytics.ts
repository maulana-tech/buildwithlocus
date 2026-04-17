import { BaseAgent } from "./base";
import { AgentEvent, Transaction } from "./state";

type WidgetAnalytics = {
  widget_id: string;
  total_revenue: number;
  transaction_count: number;
  failure_count: number;
  method_breakdown: Record<string, { count: number; revenue: number }>;
  last_updated: string;
};

export class AnalyticsAgent extends BaseAgent {
  private analyticsStore: Map<string, WidgetAnalytics> = new Map();

  handleEvent(event: AgentEvent) {
    switch (event.type) {
      case "payment.link.created":
        this.registerWidget(event.payload.widget_id);
        break;
      case "transaction.completed":
        this.trackTransaction(event.payload);
        break;
      case "transaction.failed":
        this.trackFailure(event.payload);
        break;
      case "dashboard.data.requested":
        this.serveDashboardData(event.payload.widget_id);
        break;
    }
  }

  private registerWidget(widgetId: string) {
    if (!this.analyticsStore.has(widgetId)) {
      this.analyticsStore.set(widgetId, {
        widget_id: widgetId,
        total_revenue: 0,
        transaction_count: 0,
        failure_count: 0,
        method_breakdown: {},
        last_updated: new Date().toISOString(),
      });
    }
    console.log(`[Analytics Agent] Widget ${widgetId} registered for tracking.`);
  }

  private trackTransaction(transaction: Transaction) {
    const data = this.analyticsStore.get(transaction.widget_id);
    if (!data) {
      this.registerWidget(transaction.widget_id);
      return;
    }

    data.transaction_count += 1;
    data.total_revenue += transaction.amount;
    data.last_updated = new Date().toISOString();

    const method = data.method_breakdown[transaction.method] || { count: 0, revenue: 0 };
    method.count += 1;
    method.revenue += transaction.amount;
    data.method_breakdown[transaction.method] = method;

    console.log(`[Analytics Agent] Tracked transaction ${transaction.id}: +${transaction.amount} ${transaction.method}`);
  }

  private trackFailure(payload: { id: string; reason: string }) {
    console.log(`[Analytics Agent] Transaction ${payload.id} failed: ${payload.reason}`);
  }

  private serveDashboardData(widgetId?: string) {
    if (widgetId) {
      const data = this.analyticsStore.get(widgetId);
      console.log(`[Analytics Agent] Dashboard data for ${widgetId}:`, data);
    } else {
      console.log(`[Analytics Agent] Dashboard data (all widgets):`, Object.fromEntries(this.analyticsStore));
    }
  }

  getAnalytics(widgetId?: string): WidgetAnalytics | Record<string, WidgetAnalytics> {
    if (widgetId) {
      return this.analyticsStore.get(widgetId) || {
        widget_id: widgetId,
        total_revenue: 0,
        transaction_count: 0,
        failure_count: 0,
        method_breakdown: {},
        last_updated: new Date().toISOString(),
      };
    }
    return Object.fromEntries(this.analyticsStore);
  }
}
