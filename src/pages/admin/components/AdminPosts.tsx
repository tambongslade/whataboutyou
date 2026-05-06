import React, { useEffect, useMemo, useRef, useState } from 'react';
import { postsApi, postIdOf, resolveImageUrl, type Post, type PostStatus } from '../../../services/postsService';
import SectionHeader from './SectionHeader';

const formatDate = (iso?: string): string => {
  if (!iso) return '—';
  try {
    return new Date(iso)
      .toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      .replace(/\//g, '.');
  } catch {
    return '—';
  }
};

const AdminPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await postsApi.list({
        page: 1,
        limit: 100,
        status: statusFilter,
        search: search.trim() || undefined,
      });
      setPosts(result.items);
    } catch (err) {
      setError((err as Error).message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleDelete = async (post: Post) => {
    const id = postIdOf(post);
    if (!id) return;
    if (!confirm(`Supprimer le post "${post.title}" ?`)) return;
    try {
      await postsApi.remove(id);
      setPosts((prev) => prev.filter((p) => postIdOf(p) !== id));
    } catch (err) {
      alert((err as Error).message || 'Suppression impossible');
    }
  };

  const handleSaved = (saved: Post) => {
    const id = postIdOf(saved);
    setPosts((prev) => {
      const exists = prev.some((p) => postIdOf(p) === id);
      if (exists) return prev.map((p) => (postIdOf(p) === id ? saved : p));
      return [saved, ...prev];
    });
    setEditing(null);
    setCreating(false);
  };

  const stats = useMemo(() => {
    const published = posts.filter((p) => p.status === 'published').length;
    const drafts = posts.length - published;
    return { total: posts.length, published, drafts };
  }, [posts]);

  return (
    <div className="space-y-8">
      <SectionHeader
        index="07"
        eyebrow="Content"
        title="Posts"
        subtitle="Articles, actualités et contenus éditoriaux de la plateforme."
        meta={
          <span>
            {stats.published.toString().padStart(2, '0')} PUBLIÉS · {stats.drafts.toString().padStart(2, '0')} BROUILLONS
          </span>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-black/10">
            {(['all', 'published', 'draft'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setStatusFilter(opt)}
                className={`font-nekst text-[10px] tracking-[0.3em] uppercase px-4 py-2.5 transition-colors ${
                  statusFilter === opt
                    ? 'bg-black text-white'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {opt === 'all' ? 'Tous' : opt === 'published' ? 'Publié' : 'Brouillon'}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              refresh();
            }}
            className="relative flex-1 min-w-[200px]"
          >
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un titre..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/10 focus:border-black focus:outline-none focus:ring-0 text-sm placeholder:text-gray-400"
            />
          </form>

          <button
            onClick={() => setCreating(true)}
            className="group font-nekst text-[10px] tracking-[0.3em] uppercase bg-red-500 text-white px-5 py-2.5 hover:bg-black transition-colors flex items-center gap-2"
          >
            <span className="text-base leading-none">+</span>
            Nouveau Post
          </button>
        </div>
      </SectionHeader>

      <div className="bg-white border border-black/10">
        {loading ? (
          <div className="flex items-center gap-3 px-6 py-12">
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <span className="font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">Chargement…</span>
          </div>
        ) : error ? (
          <div className="border-l-2 border-red-500 bg-red-500/5 m-4 p-5">
            <div className="font-nekst text-[10px] tracking-[0.3em] uppercase text-red-700 mb-2">Erreur</div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="font-nekst text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-2">
              Aucun post
            </div>
            <div className="font-azonix text-2xl text-black">—</div>
            <button
              onClick={() => setCreating(true)}
              className="mt-6 font-nekst text-[10px] tracking-[0.3em] uppercase text-black hover:text-red-500 underline-offset-4 hover:underline"
            >
              Créer le premier →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-black/10">
                <tr>
                  <th className="px-6 py-4 text-left font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500 w-12">#</th>
                  <th className="px-6 py-4 text-left font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">Cover</th>
                  <th className="px-6 py-4 text-left font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">Titre</th>
                  <th className="px-6 py-4 text-left font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">Statut</th>
                  <th className="px-6 py-4 text-left font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">Catégorie</th>
                  <th className="px-6 py-4 text-left font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">Date</th>
                  <th className="px-6 py-4 text-right font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, i) => {
                  const cover = resolveImageUrl(post.coverImage);
                  return (
                    <tr key={postIdOf(post) || post.slug} className="border-b border-black/5 hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-[10px] text-gray-400 align-middle">
                        {String(i + 1).padStart(3, '0')}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        {cover ? (
                          <img src={cover} alt="" className="w-12 h-12 object-cover" />
                        ) : (
                          <div className="w-12 h-12 bg-stone-100 flex items-center justify-center font-mono text-[10px] text-gray-400">—</div>
                        )}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-black">{post.title}</span>
                          <span className="font-mono text-[10px] text-gray-400 mt-1">/{post.slug}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span
                          className={`inline-flex items-center gap-2 font-nekst text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 ${
                            post.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-yellow-400 text-black'
                          }`}
                        >
                          <span className={`w-1 h-1 rounded-full ${post.status === 'published' ? 'bg-white' : 'bg-black'}`} />
                          {post.status === 'published' ? 'Publié' : 'Brouillon'}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className="font-nekst text-xs text-gray-700">{post.category || '—'}</span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className="font-mono text-xs text-gray-500">{formatDate(post.publishedAt || post.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4 text-right align-middle">
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => setEditing(post)}
                            className="font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500 hover:text-black transition-colors"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(post)}
                            className="font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-400 hover:text-red-500 transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(creating || editing) && (
        <PostFormModal
          post={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

// =====================================================
// FORM MODAL — editorial publishing tool
// =====================================================

interface PostFormModalProps {
  post: Post | null;
  onClose: () => void;
  onSaved: (post: Post) => void;
}

const PostFormModal: React.FC<PostFormModalProps> = ({ post, onClose, onSaved }) => {
  const isEdit = !!post;
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [slugTouched, setSlugTouched] = useState(!!post?.slug);
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [category, setCategory] = useState(post?.category || '');
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<PostStatus>(post?.status || 'draft');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(post?.coverImage ? resolveImageUrl(post.coverImage) : null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(post?.images || []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from title until user manually edits it
  useEffect(() => {
    if (slugTouched) return;
    const generated = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generated);
  }, [title, slugTouched]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Generate previews for new gallery files
  useEffect(() => {
    const urls = imageFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [imageFiles]);

  const handleCoverChange = (file: File | null) => {
    setCoverFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
    } else if (post?.coverImage) {
      setCoverPreview(resolveImageUrl(post.coverImage));
    } else {
      setCoverPreview(null);
    }
  };

  const handleAddTag = () => {
    const t = tagInput.trim().replace(/^#+/, '');
    if (!t) return;
    if (tags.includes(t)) {
      setTagInput('');
      return;
    }
    setTags([...tags, t]);
    setTagInput('');
  };

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  const handleRemoveExistingImage = async (url: string) => {
    if (!post || !postIdOf(post)) return;
    if (!confirm('Supprimer cette image ?')) return;
    try {
      const updated = await postsApi.removeImage(postIdOf(post), url);
      setExistingImages(updated.images || []);
    } catch (err) {
      alert((err as Error).message || 'Suppression impossible');
    }
  };

  const removeNewImage = (i: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const wordCount = useMemo(() => {
    const text = content.replace(/<[^>]*>/g, ' ').trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      if (isEdit && post) {
        const payload: Partial<Post> = {
          title,
          slug: slug || undefined,
          excerpt,
          content,
          category: category || undefined,
          tags,
          status,
        };
        const saved = await postsApi.update(postIdOf(post), payload);
        onSaved(saved);
      } else {
        const fd = new FormData();
        fd.append('title', title);
        if (slug) fd.append('slug', slug);
        fd.append('content', content);
        if (excerpt) fd.append('excerpt', excerpt);
        if (category) fd.append('category', category);
        tags.forEach((t) => fd.append('tags[]', t));
        fd.append('status', status);
        if (coverFile) fd.append('cover', coverFile);
        imageFiles.forEach((f) => fd.append('images', f));

        const saved = await postsApi.create(fd);
        onSaved(saved);
      }
    } catch (err) {
      setError((err as Error).message || "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  const sidebarLabel = "block font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-2";
  const sidebarInput =
    'w-full bg-transparent border-0 border-b border-gray-300 focus:border-black px-0 py-2 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-colors';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-stretch overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-stone-50 w-full max-w-6xl mx-auto my-0 lg:my-6 flex flex-col shadow-2xl min-h-[100vh] lg:min-h-[calc(100vh-3rem)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-white border-b border-black/10">
          <div className="px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-4 min-w-0">
              <span className="font-mono text-[10px] tracking-[0.3em] text-gray-400 hidden sm:inline">
                {isEdit ? 'EDIT' : 'NEW'} / POST
              </span>
              <span className="hidden sm:block w-8 h-px bg-black/10" />
              <h2 className="font-azonix text-xl sm:text-2xl text-black leading-none truncate">
                {isEdit ? 'Modifier le post' : 'Nouveau Post'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`hidden sm:inline-flex items-center gap-2 font-nekst text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 ${
                  status === 'published' ? 'bg-emerald-500 text-white' : 'bg-yellow-400 text-black'
                }`}
              >
                <span className={`w-1 h-1 rounded-full ${status === 'published' ? 'bg-white' : 'bg-black'}`} />
                {status === 'published' ? 'Publié' : 'Brouillon'}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-black hover:bg-stone-100 transition-colors"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="h-[2px] bg-yellow-400" />
        </div>

        <form onSubmit={handleSubmit} className="flex-1">
          {error && (
            <div className="mx-6 lg:mx-8 mt-6 border-l-2 border-red-500 bg-red-500/5 px-4 py-3">
              <div className="font-nekst text-[10px] tracking-[0.3em] uppercase text-red-700 mb-1">Erreur</div>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] divide-y lg:divide-y-0 lg:divide-x divide-black/10">
            {/* MAIN — content */}
            <div className="px-6 lg:px-8 py-8 space-y-8">
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] text-gray-400 mb-3">A / TITRE</div>
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre du post"
                  className="w-full bg-transparent border-0 border-b border-black/10 focus:border-black px-0 pb-3 font-azonix text-3xl sm:text-4xl text-black placeholder:text-gray-300 focus:outline-none focus:ring-0 transition-colors leading-tight"
                />
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className="font-mono text-gray-400">/posts/</span>
                  <input
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setSlug(e.target.value);
                    }}
                    placeholder="slug-auto-genere"
                    className="flex-1 bg-transparent border-0 px-0 py-1 font-mono text-xs text-gray-700 focus:outline-none focus:ring-0"
                  />
                  {!slugTouched && title && (
                    <span className="font-nekst text-[9px] tracking-[0.3em] uppercase text-yellow-600 bg-yellow-50 px-2 py-0.5">
                      Auto
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] text-gray-400 mb-3">B / EXTRAIT</div>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  placeholder="Une phrase d'introduction qui résume l'article…"
                  className="w-full bg-white border border-black/10 focus:border-black px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-colors resize-y"
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <div className="font-mono text-[10px] tracking-[0.3em] text-gray-400">C / CONTENU</div>
                  <div className="font-mono text-[10px] tracking-[0.2em] text-gray-400">
                    {wordCount} {wordCount > 1 ? 'mots' : 'mot'}
                  </div>
                </div>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={16}
                  placeholder={'Écrivez votre article ici…\n\n<p>HTML autorisé pour la mise en forme.</p>'}
                  className="w-full bg-white border border-black/10 focus:border-black px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 transition-colors resize-y font-mono leading-relaxed"
                />
                <p className="mt-2 font-nekst text-[10px] tracking-[0.2em] uppercase text-gray-400">
                  HTML autorisé — utilisez &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, &lt;img&gt;, etc.
                </p>
              </div>
            </div>

            {/* SIDEBAR — publishing */}
            <aside className="bg-white px-6 lg:px-7 py-8 space-y-8">
              {/* Status */}
              <div>
                <label className={sidebarLabel}>Statut</label>
                <div className="grid grid-cols-2 border border-black/10">
                  {(['draft', 'published'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStatus(opt)}
                      className={`font-nekst text-[10px] tracking-[0.25em] uppercase py-2.5 transition-colors ${
                        status === opt
                          ? opt === 'published'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-black text-white'
                          : 'text-gray-500 hover:text-black'
                      }`}
                    >
                      {opt === 'draft' ? 'Brouillon' : 'Publié'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className={sidebarLabel}>Catégorie</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Actualité, Édito, …"
                  className={sidebarInput}
                />
              </div>

              {/* Tags */}
              <div>
                <label className={sidebarLabel}>Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 font-nekst text-[10px] tracking-[0.2em] uppercase bg-black text-white px-2 py-1"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        className="text-white/60 hover:text-white"
                        aria-label={`Retirer ${t}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKey}
                  onBlur={handleAddTag}
                  placeholder="way, 2026, news"
                  className={sidebarInput}
                />
                <p className="mt-1 font-nekst text-[9px] tracking-[0.3em] uppercase text-gray-400">
                  Entrée ou virgule pour ajouter
                </p>
              </div>

              {/* Cover image — create only */}
              {!isEdit && (
                <div>
                  <label className={sidebarLabel}>Image de couverture</label>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleCoverChange(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {coverPreview ? (
                    <div className="relative group">
                      <img src={coverPreview} alt="" className="w-full h-40 object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          className="font-nekst text-[10px] tracking-[0.3em] uppercase bg-white text-black px-3 py-1.5"
                        >
                          Remplacer
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCoverChange(null)}
                          className="font-nekst text-[10px] tracking-[0.3em] uppercase bg-red-500 text-white px-3 py-1.5"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-black/15 hover:border-black bg-stone-50 hover:bg-white px-4 py-8 transition-colors flex flex-col items-center gap-2"
                    >
                      <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-600">
                        Cliquer pour choisir
                      </span>
                      <span className="font-mono text-[9px] text-gray-400">JPG · PNG · WEBP · 5 Mo</span>
                    </button>
                  )}
                </div>
              )}

              {/* Gallery — create only */}
              {!isEdit && (
                <div>
                  <label className={sidebarLabel}>
                    Galerie <span className="text-gray-400 normal-case tracking-normal">({imageFiles.length})</span>
                  </label>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setImageFiles((prev) => [...prev, ...Array.from(e.target.files || [])])}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-full border border-dashed border-black/15 hover:border-black bg-stone-50 hover:bg-white px-3 py-3 transition-colors font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-600 mb-3"
                  >
                    + Ajouter des images
                  </button>
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-1">
                      {imagePreviews.map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt="" className="w-full h-16 object-cover" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(i)}
                            className="absolute top-1 right-1 w-5 h-5 bg-black text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Retirer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Existing images — edit only */}
              {isEdit && existingImages.length > 0 && (
                <div>
                  <label className={sidebarLabel}>
                    Images existantes <span className="text-gray-400 normal-case tracking-normal">({existingImages.length})</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {existingImages.map((url) => (
                      <div key={url} className="relative group">
                        <img src={resolveImageUrl(url)} alt="" className="w-full h-16 object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(url)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Supprimer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isEdit && (
                <p className="font-nekst text-[10px] tracking-[0.2em] uppercase text-gray-400 leading-relaxed">
                  Pour ajouter de nouvelles images, supprimez le post et recréez-le.
                </p>
              )}
            </aside>
          </div>
        </form>

        {/* FOOTER */}
        <div className="sticky bottom-0 z-10 bg-white border-t border-black/10 px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-400 hidden sm:block">
            {isEdit ? 'Modification' : 'Création'} · {wordCount} mots
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500 hover:text-black px-4 py-2.5 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => setStatus(status === 'draft' ? 'published' : 'draft')}
              className="hidden sm:inline-flex font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-700 hover:text-black border border-black/10 hover:border-black px-4 py-2.5 transition-colors"
            >
              {status === 'draft' ? 'Publier après' : 'Mettre en brouillon'}
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={submitting || !title.trim() || !content.trim()}
              className="group font-nekst text-[10px] tracking-[0.3em] uppercase bg-black text-white hover:bg-red-500 px-6 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {submitting ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enregistrement…</span>
                </>
              ) : (
                <>
                  <span>{isEdit ? 'Mettre à jour' : 'Publier'}</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="square" d="M4 12h16M14 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPosts;
