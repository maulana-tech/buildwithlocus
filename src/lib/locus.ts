const LOCUS_BASE_URL = process.env.LOCUS_BASE_URL || "https://api.locus.sh";
const LOCUS_API_KEY = process.env.LOCUS_API_KEY || "";
const BUILD_BASE_URL = "https://api.buildwithlocus.com";

export type LocusError = {
  errorCode: number;
  message: string;
  responseCode: string;
};

export type PaymentLinkRequest = {
  amount: number;
  currency: string;
  payment_methods: string[];
  success_url?: string;
  failure_url?: string;
  metadata?: Record<string, string>;
};

export type PaymentLink = {
  id: string;
  url: string;
  amount: number;
  currency: string;
  status: string;
  payment_methods: string[];
  created_at: string;
};

export type Transaction = {
  id: string;
  payment_link_id: string;
  amount: number;
  currency: string;
  method: string;
  status: "paid" | "failed" | "expired" | "pending";
  created_at: string;
};

export type BuildProject = {
  id: string;
  name: string;
  status: string;
  url?: string;
  created_at: string;
};

export type BuildService = {
  id: string;
  project_id: string;
  name: string;
  status: string;
  url?: string;
  port: number;
};

async function request<T>(
  base: string,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${base}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (base === BUILD_BASE_URL) {
    const token = await getBuildToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  } else {
    headers["Authorization"] = `Bearer ${LOCUS_API_KEY}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.message || body.error || `Locus API error: ${res.status}`
    );
  }

  return res.json();
}

let buildToken: string | null = null;
let buildTokenExpiry = 0;

async function getBuildToken(): Promise<string | null> {
  if (buildToken && Date.now() < buildTokenExpiry) return buildToken;

  try {
    const res = await fetch(`${BUILD_BASE_URL}/v1/auth/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: LOCUS_API_KEY }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    buildToken = data.token || data.access_token;
    buildTokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;
    return buildToken;
  } catch {
    return null;
  }
}

export const locus = {
  payment: {
    createLink(data: PaymentLinkRequest): Promise<PaymentLink> {
      return request<PaymentLink>(LOCUS_BASE_URL, "/v1/payment-links", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    listLinks(): Promise<PaymentLink[]> {
      return request<PaymentLink[]>(LOCUS_BASE_URL, "/v1/payment-links");
    },

    getLink(id: string): Promise<PaymentLink> {
      return request<PaymentLink>(LOCUS_BASE_URL, `/v1/payment-links/${id}`);
    },

    getMethods(): Promise<string[]> {
      return request<string[]>(LOCUS_BASE_URL, "/v1/payment-methods");
    },

    getTransactions(): Promise<Transaction[]> {
      return request<Transaction[]>(LOCUS_BASE_URL, "/v1/transactions");
    },

    getTransaction(id: string): Promise<Transaction> {
      return request<Transaction>(
        LOCUS_BASE_URL,
        `/v1/transactions/${id}`
      );
    },
  },

  build: {
    listProjects(): Promise<BuildProject[]> {
      return request<BuildProject[]>(BUILD_BASE_URL, "/v1/projects");
    },

    getProject(id: string): Promise<BuildProject> {
      return request<BuildProject>(BUILD_BASE_URL, `/v1/projects/${id}`);
    },

    createProject(data: {
      name: string;
      source?: string;
    }): Promise<BuildProject> {
      return request<BuildProject>(BUILD_BASE_URL, "/v1/projects", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    deploy(projectId: string): Promise<BuildProject> {
      return request<BuildProject>(
        BUILD_BASE_URL,
        `/v1/projects/${projectId}/deploy`,
        { method: "POST" }
      );
    },

    getServices(projectId: string): Promise<BuildService[]> {
      return request<BuildService[]>(
        BUILD_BASE_URL,
        `/v1/projects/${projectId}/services`
      );
    },
  },
};
