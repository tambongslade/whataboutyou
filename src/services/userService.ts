const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.whataboutyou.net/api').replace(/\/+$/, '');

export interface AppUser {
  _id?: string;
  id?: string;
  email: string;
  nom?: string;
  prenom?: string;
  numeroTelephone?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  [key: string]: unknown;
}

export interface UsersListResult {
  items: AppUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const userIdOf = (u: AppUser): string => (u._id ?? u.id ?? '') as string;

const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const normalize = (raw: unknown, page: number, limit: number): UsersListResult => {
  if (Array.isArray(raw)) {
    return { items: raw as AppUser[], total: raw.length, page, limit, totalPages: 1 };
  }
  if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>;
    const items =
      (Array.isArray(o.items) && (o.items as AppUser[])) ||
      (Array.isArray(o.users) && (o.users as AppUser[])) ||
      (Array.isArray(o.data) && (o.data as AppUser[])) ||
      [];
    const total = typeof o.total === 'number' ? o.total : items.length;
    const totalPages = typeof o.totalPages === 'number' ? o.totalPages : 1;
    const p = typeof o.page === 'number' ? o.page : page;
    const l = typeof o.limit === 'number' ? o.limit : limit;
    return { items, total, page: p, limit: l, totalPages };
  }
  return { items: [], total: 0, page, limit, totalPages: 1 };
};

export const userService = {
  async list(query: { page?: number; limit?: number; search?: string } = {}): Promise<UsersListResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (query.search) params.set('search', query.search);

    const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`, { headers: authHeaders() });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `Erreur ${response.status}`);
    }
    return normalize(await response.json(), page, limit);
  },

  async remove(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `Erreur ${response.status}`);
    }
  },

  async updateRole(id: string, role: string): Promise<AppUser> {
    const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ role }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || `Erreur ${response.status}`);
    }
    return response.json();
  },
};
