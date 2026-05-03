// =====================================================
// POSTS API SERVICE
// Backend endpoints (see /api/posts...):
//   GET    /api/posts                      (public)
//   GET    /api/posts/:idOrSlug            (public)
//   POST   /api/posts                      (admin, multipart)
//   PATCH  /api/posts/:id                  (admin)
//   DELETE /api/posts/:id                  (admin)
//   DELETE /api/posts/:id/images           (admin, body { url })
//   GET    /api/posts/:idOrSlug/comments   (public)
//   POST   /api/posts/:idOrSlug/comments   (logged-in)
//   PATCH  /api/posts/comments/:commentId  (own/admin)
//   DELETE /api/posts/comments/:commentId  (own/admin)
// =====================================================

export type PostStatus = 'draft' | 'published';

export interface PostAuthor {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
}

export interface Post {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  images?: string[];
  author?: PostAuthor | string;
  category?: string;
  tags?: string[];
  status: PostStatus;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  _id?: string;
  id?: string;
  post?: string;
  author?: PostAuthor | string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PostListQuery {
  page?: number;
  limit?: number;
  status?: PostStatus | 'all';
  tag?: string;
  category?: string;
  search?: string;
}

export interface PostListResult {
  items: Post[];
  total: number;
  page: number;
  limit: number;
}

// =====================================================
// CONFIGURATION
// =====================================================

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.whataboutyou.net/api').replace(/\/+$/, '');

// Strip trailing /api from base to get the origin for static /uploads files.
const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

export const resolveImageUrl = (url?: string | null): string => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`;
  return `${API_ORIGIN}/${url}`;
};

const getAuthToken = (): string | null => localStorage.getItem('adminToken');

const buildQueryString = (q: Record<string, string | number | undefined | null>): string => {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null || v === '') continue;
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  return parts.length ? `?${parts.join('&')}` : '';
};

// =====================================================
// LOW-LEVEL REQUEST HELPER
// =====================================================

async function request<T>(
  endpoint: string,
  options: RequestInit & { auth?: boolean; isFormData?: boolean } = {}
): Promise<T> {
  const { auth, isFormData, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...((headers as Record<string, string>) || {}),
  };
  if (auth) {
    const token = getAuthToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const res = await fetch(url, { ...rest, headers: finalHeaders });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson?.message) detail = Array.isArray(errJson.message) ? errJson.message.join(', ') : errJson.message;
      else if (errJson?.error) detail = errJson.error;
    } catch { /* ignore */ }
    throw new Error(detail);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// =====================================================
// SHAPE NORMALIZERS — backend may return any of:
//   Post[]                                          (raw array)
//   { data: Post[], total, page, limit }            (flat)
//   { data: { items, total, page, limit } }         (wrapped)
//   { items, total, page, limit }                   (already shaped)
// =====================================================

function normalizePostList(raw: unknown, fallbackPage: number, fallbackLimit: number): PostListResult {
  if (Array.isArray(raw)) {
    return { items: raw as Post[], total: raw.length, page: fallbackPage, limit: fallbackLimit };
  }
  const obj = raw as Record<string, unknown>;
  if (obj && typeof obj === 'object') {
    if (Array.isArray((obj as { items?: unknown }).items)) {
      const o = obj as { items: Post[]; total?: number; page?: number; limit?: number };
      return { items: o.items, total: o.total ?? o.items.length, page: o.page ?? fallbackPage, limit: o.limit ?? fallbackLimit };
    }
    const data = (obj as { data?: unknown }).data;
    if (Array.isArray(data)) {
      const o = obj as { data: Post[]; total?: number; page?: number; limit?: number };
      return { items: o.data, total: o.total ?? o.data.length, page: o.page ?? fallbackPage, limit: o.limit ?? fallbackLimit };
    }
    if (data && typeof data === 'object' && Array.isArray((data as { items?: unknown }).items)) {
      const d = data as { items: Post[]; total?: number; page?: number; limit?: number };
      return { items: d.items, total: d.total ?? d.items.length, page: d.page ?? fallbackPage, limit: d.limit ?? fallbackLimit };
    }
  }
  return { items: [], total: 0, page: fallbackPage, limit: fallbackLimit };
}

function unwrap<T>(raw: unknown): T {
  if (raw && typeof raw === 'object' && 'data' in (raw as Record<string, unknown>)) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

// =====================================================
// PUBLIC API
// =====================================================

export const postsApi = {
  // 1. GET /posts
  async list(query: PostListQuery = {}): Promise<PostListResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const qs = buildQueryString({
      page,
      limit,
      status: query.status === 'all' ? undefined : query.status,
      tag: query.tag,
      category: query.category,
      search: query.search,
    });
    const raw = await request<unknown>(`/posts${qs}`);
    return normalizePostList(raw, page, limit);
  },

  // 2. GET /posts/:idOrSlug
  async get(idOrSlug: string): Promise<Post> {
    const raw = await request<unknown>(`/posts/${encodeURIComponent(idOrSlug)}`);
    return unwrap<Post>(raw);
  },

  // 3. POST /posts (multipart)
  async create(form: FormData): Promise<Post> {
    const raw = await request<unknown>(`/posts`, {
      method: 'POST',
      body: form,
      auth: true,
      isFormData: true,
    });
    return unwrap<Post>(raw);
  },

  // 4. PATCH /posts/:id (json)
  async update(id: string, body: Partial<Post>): Promise<Post> {
    const raw = await request<unknown>(`/posts/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      auth: true,
    });
    return unwrap<Post>(raw);
  },

  // 5. DELETE /posts/:id
  async remove(id: string): Promise<void> {
    await request<unknown>(`/posts/${encodeURIComponent(id)}`, { method: 'DELETE', auth: true });
  },

  // 6. DELETE /posts/:id/images
  async removeImage(id: string, imageUrl: string): Promise<Post> {
    const raw = await request<unknown>(`/posts/${encodeURIComponent(id)}/images`, {
      method: 'DELETE',
      body: JSON.stringify({ url: imageUrl }),
      auth: true,
    });
    return unwrap<Post>(raw);
  },

  // 7. GET /posts/:idOrSlug/comments
  async listComments(idOrSlug: string): Promise<Comment[]> {
    const raw = await request<unknown>(`/posts/${encodeURIComponent(idOrSlug)}/comments`);
    const data = unwrap<unknown>(raw);
    if (Array.isArray(data)) return data as Comment[];
    if (data && typeof data === 'object' && Array.isArray((data as { items?: unknown }).items)) {
      return (data as { items: Comment[] }).items;
    }
    return [];
  },

  // 8. POST /posts/:idOrSlug/comments
  async addComment(idOrSlug: string, content: string): Promise<Comment> {
    const raw = await request<unknown>(`/posts/${encodeURIComponent(idOrSlug)}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
      auth: true,
    });
    return unwrap<Comment>(raw);
  },

  // 9. PATCH /posts/comments/:commentId
  async updateComment(commentId: string, content: string): Promise<Comment> {
    const raw = await request<unknown>(`/posts/comments/${encodeURIComponent(commentId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
      auth: true,
    });
    return unwrap<Comment>(raw);
  },

  // 10. DELETE /posts/comments/:commentId
  async deleteComment(commentId: string): Promise<void> {
    await request<unknown>(`/posts/comments/${encodeURIComponent(commentId)}`, { method: 'DELETE', auth: true });
  },
};

export const postIdOf = (p: Post): string => (p._id ?? p.id ?? '') as string;
export const commentIdOf = (c: Comment): string => (c._id ?? c.id ?? '') as string;
export const isLoggedIn = (): boolean => !!getAuthToken();
