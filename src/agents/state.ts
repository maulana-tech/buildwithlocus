export type MerchantState = {
  id: string;
  api_key: string;
  verified: boolean;
};

export type WidgetConfig = {
  widget_id: string;
  merchant_id: string;
  branding: {
    logo_url: string;
    primary_color: string;
    button_label: string;
  };
  payment_methods: string[];
  amount: {
    type: "fixed" | "customer_defined";
    value: number;
    currency: string;
  };
  redirects: {
    success_url: string;
    failure_url: string;
  };
};

export type Transaction = {
  id: string;
  widget_id: string;
  method: string;
  amount: number;
  status: string;
};

export type BlockType = "profile" | "link" | "checkout";

export type BaseBlock = {
  id: string;
  type: BlockType;
  visible: boolean;
};

export type ProfileBlock = BaseBlock & {
  type: "profile";
  name: string;
  bio: string;
  avatar_url?: string;
};

export type LinkBlock = BaseBlock & {
  type: "link";
  title: string;
  url: string;
  icon?: string;
};

export type CheckoutBlock = BaseBlock & {
  type: "checkout";
  widget_id: string;
};

export type Block = ProfileBlock | LinkBlock | CheckoutBlock;

export type SiteConfig = {
  id: string;
  username: string;
  title: string;
  theme: "modern" | "retro" | "dark" | "glass" | "neon";
  font: "inter" | "playfair" | "mono" | "space";
  layout: "stack" | "grid";
  blocks: Block[];
  branding: {
    primary_color: string;
  };
};

export type GlobalState = {
  merchant: MerchantState;
  widgets: Array<{
    widget_id: string;
    config: WidgetConfig;
    payment_link: string;
    status: "active" | "paused" | "archived";
  }>;
  sites: SiteConfig[];
  currentSiteId?: string;
  transactions: Transaction[];
  analytics: {
    by_widget: Record<string, unknown>;
  };
};

export const initialState: GlobalState = {
  merchant: { id: "", api_key: "", verified: false },
  widgets: [],
  sites: [],
  transactions: [],
  analytics: { by_widget: {} },
};

export type AgentEvent =
  | { type: "widget.config.saved"; payload: WidgetConfig }
  | { type: "site.updated"; payload: SiteConfig }
  | { type: "block.added"; payload: { siteId: string; block: Block } }
  | { type: "payment.link.created"; payload: { widget_id: string; url: string } }
  | { type: "transaction.completed"; payload: Transaction }
  | { type: "transaction.failed"; payload: { id: string; reason: string } }
  | { type: "dashboard.data.requested"; payload: { widget_id?: string } }
  | { type: "disbursement.triggered"; payload: { amount: number } };

export type EventCallback = (event: AgentEvent) => void;

class EventBus {
  private listeners: Set<EventCallback> = new Set();

  subscribe(callback: EventCallback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  publish(event: AgentEvent) {
    console.log(`[EventBus] Publishing: ${event.type}`, event.payload);
    this.listeners.forEach((cb) => cb(event));
  }
}

export const eventBus = new EventBus();
