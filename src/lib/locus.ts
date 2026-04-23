const PAY_API_BASE = process.env.LOCUS_API_BASE || 'https://api.paywithlocus.com/api';
const BUILD_API_BASE = 'https://api.buildwithlocus.com';

function payHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.LOCUS_API_KEY}`,
  };
}

async function payRequest<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${PAY_API_BASE}${path}`, {
    method,
    headers: payHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as Record<string, string>).message || (err as Record<string, string>).error || `PayWithLocus ${res.status}`);
  }

  const json = await res.json() as { success?: boolean; data?: unknown };
  return (json.success && json.data ? json.data : json) as T;
}

export type CheckoutSession = {
  id: string;
  amount: string;
  currency: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED';
  description?: string;
  expiresAt: string;
  checkoutUrl?: string;
  paymentTxHash?: string;
  payerAddress?: string;
  paidAt?: string;
  webhookSecret?: string;
};

export type WalletBalance = {
  balance: string;
  token: string;
  wallet_address: string;
};

export type BuildToken = {
  token: string;
  expiresIn: string;
};

export const locus = {
  payment: {
    async createSession(data: {
      amount: string;
      description?: string;
      successUrl?: string;
      cancelUrl?: string;
      webhookUrl?: string;
      metadata?: Record<string, string>;
      receiptConfig?: {
        enabled: boolean;
        fields: {
          creditorName?: string;
          lineItems?: Array<{ description: string; amount: string }>;
          subtotal?: string;
          taxRate?: string;
          taxAmount?: string;
          logoUrl?: string;
          companyAddress?: string;
          supportEmail?: string;
        };
      };
    }): Promise<CheckoutSession> {
      return payRequest<CheckoutSession>('POST', '/checkout/sessions', data);
    },

    async getSession(sessionId: string): Promise<CheckoutSession> {
      return payRequest<CheckoutSession>('GET', `/checkout/sessions/${sessionId}`);
    },

    async getBalance(): Promise<WalletBalance> {
      return payRequest<WalletBalance>('GET', '/pay/balance');
    },
  },

  build: {
    async exchangeToken(): Promise<BuildToken | null> {
      const apiKey = process.env.LOCUS_API_KEY;
      if (!apiKey) return null;

      try {
        const res = await fetch(`${BUILD_API_BASE}/v1/auth/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ apiKey }),
        });
        if (!res.ok) return null;
        return res.json();
      } catch {
        return null;
      }
    },

    async getBillingBalance(token: string) {
      const res = await fetch(`${BUILD_API_BASE}/v1/billing/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Build billing ${res.status}`);
      return res.json();
    },

    async deployFromRepo(token: string, data: { name: string; repo: string; branch?: string }) {
      const res = await fetch(`${BUILD_API_BASE}/v1/projects/from-repo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, branch: data.branch || 'main' }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as Record<string, string>).message || `Build deploy ${res.status}`);
      }
      return res.json();
    },

    async listProjects(token: string) {
      const res = await fetch(`${BUILD_API_BASE}/v1/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Build list ${res.status}`);
      return res.json();
    },
  },
};
