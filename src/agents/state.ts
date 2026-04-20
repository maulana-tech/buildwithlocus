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

export type SectionType = 'hero' | 'features' | 'pricing' | 'checkout' | 'testimonials' | 'faq' | 'footer';

export type HeroSection = {
  id: string;
  type: 'hero';
  headline: string;
  subtext: string;
  cta_label: string;
  cta_url: string;
  background_image?: string;
  alignment: 'left' | 'center' | 'right';
};

export type FeaturesSection = {
  id: string;
  type: 'features';
  title: string;
  items: Array<{ id: string; icon: string; title: string; description: string }>;
  columns: 2 | 3 | 4;
};

export type PricingSection = {
  id: string;
  type: 'pricing';
  title: string;
  plans: Array<{
    id: string;
    name: string;
    price: string;
    period: string;
    features: string[];
    cta_label: string;
    highlighted: boolean;
  }>;
  columns: 2 | 3 | 4;
};

export type CheckoutSection = {
  id: string;
  type: 'checkout';
  title: string;
  description: string;
  amount: number;
  currency: string;
  payment_methods: string[];
  cta_label: string;
};

export type TestimonialsSection = {
  id: string;
  type: 'testimonials';
  title: string;
  items: Array<{ id: string; name: string; role: string; content: string; avatar?: string }>;
};

export type FaqSection = {
  id: string;
  type: 'faq';
  title: string;
  items: Array<{ id: string; question: string; answer: string }>;
};

export type FooterSection = {
  id: string;
  type: 'footer';
  brand_name: string;
  tagline: string;
  links: Array<{ id: string; label: string; url: string }>;
  socials: Array<{ id: string; platform: string; url: string }>;
};

export type PageSection = HeroSection | FeaturesSection | PricingSection | CheckoutSection | TestimonialsSection | FaqSection | FooterSection;

export type PageConfig = {
  id: string;
  username: string;
  title: string;
  theme: 'modern' | 'retro' | 'dark' | 'glass' | 'neon';
  primary_color: string;
  sections: PageSection[];
};

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
  | { type: "page.updated"; payload: PageConfig }
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
