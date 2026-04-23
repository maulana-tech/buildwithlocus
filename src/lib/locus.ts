const BUILD_BASE_URL = 'https://api.buildwithlocus.com';
const PAY_BASE_URL = 'https://api.paywithlocus.com/api';

async function getBuildToken(): Promise<string | null> {
  const apiKey = process.env.LOCUS_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${BUILD_BASE_URL}/v1/auth/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token || data.access_token || null;
  } catch {
    return null;
  }
}

async function payRequest<T>(path: string, data: Record<string, unknown>): Promise<T> {
  const url = `${PAY_BASE_URL}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.LOCUS_API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || body.error || `PayWithLocus error: ${res.status}`);
  }

  const json = await res.json();
  return json.success ? json.data : json;
}

export type LocusSession = {
  id: string;
  checkoutUrl: string;
  amount: string;
  currency: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED';
  expiresAt: string;
  description?: string;
};

export type LocusBalance = {
  wallet_address: string;
  chain: string;
  usdc_balance: string;
};

export const locus = {
  payment: {
    async createSession(data: {
      amount: string;
      currency: string;
      description?: string;
      successUrl?: string;
      cancelUrl?: string;
      webhookUrl?: string;
      metadata?: Record<string, string>;
    }): Promise<LocusSession> {
      return payRequest<LocusSession>('/checkout/sessions', data);
    },

    getSession(id: string): Promise<LocusSession> {
      return payRequest<LocusSession>(`/checkout/session/${id}`, {});
    },

    getBalance(): Promise<LocusBalance> {
      return payRequest<LocusBalance>('/pay/balance', {});
    },
  },

  build: {
    async listProjects() {
      const token = await getBuildToken();
      if (!token) throw new Error('No build token');
      const res = await fetch(`${BUILD_BASE_URL}/v1/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },

    async createProject(name: string, repo: string) {
      const token = await getBuildToken();
      if (!token) throw new Error('No build token');
      const res = await fetch(`${BUILD_BASE_URL}/v1/projects/from-repo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, repo, branch: 'main' }),
      });
      return res.json();
    },
  },
};