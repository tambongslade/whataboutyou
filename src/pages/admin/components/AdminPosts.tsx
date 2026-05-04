import React, { useEffect, useState } from 'react';
import { postsApi, postIdOf, resolveImageUrl, type Post, type PostStatus } from '../../../services/postsService';

const formatDate = (iso?: string): string => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '';
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <span className="mr-3">📰</span>
          Gestion des Posts
        </h1>
        <button
          onClick={() => setCreating(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg transition cursor-pointer"
        >
          + Nouveau post
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Statut :</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PostStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tous</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
          </select>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            refresh();
          }}
          className="flex-1 flex items-center gap-2"
        >
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
          >
            Chercher
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Chargement...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Aucun post trouvé.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Cover</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Titre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Slug</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Catégorie</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => {
                const cover = resolveImageUrl(post.coverImage);
                return (
                  <tr key={postIdOf(post) || post.slug}>
                    <td className="px-4 py-3">
                      {cover ? (
                        <img src={cover} alt="" className="w-14 h-14 object-cover rounded" />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">—</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{post.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{post.slug}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${
                          post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {post.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{post.category || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(post.publishedAt || post.createdAt)}</td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => setEditing(post)}
                        className="text-sm text-orange-600 hover:text-orange-800 cursor-pointer"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(post)}
                        className="text-sm text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
// FORM MODAL
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
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [category, setCategory] = useState(post?.category || '');
  const [tags, setTags] = useState((post?.tags || []).join(', '));
  const [status, setStatus] = useState<PostStatus>(post?.status || 'draft');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(post?.images || []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      if (isEdit && post) {
        // Edit: PATCH JSON. Image uploads on edit aren't supported via PATCH JSON;
        // admin can re-upload by deleting and creating, or backend may extend later.
        const payload: Partial<Post> = {
          title,
          slug: slug || undefined,
          excerpt,
          content,
          category: category || undefined,
          tags: tagList,
          status,
        };
        const saved = await postsApi.update(postIdOf(post), payload);
        onSaved(saved);
      } else {
        // Create: multipart with cover + images
        const fd = new FormData();
        fd.append('title', title);
        if (slug) fd.append('slug', slug);
        fd.append('content', content);
        if (excerpt) fd.append('excerpt', excerpt);
        if (category) fd.append('category', category);
        tagList.forEach((t) => fd.append('tags[]', t));
        fd.append('status', status);
        if (coverFile) fd.append('cover', coverFile);
        imageFiles.forEach((f) => fd.append('images', f));

        const saved = await postsApi.create(fd);
        onSaved(saved);
      }
    } catch (err) {
      setError((err as Error).message || 'Erreur lors de l’enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">{isEdit ? 'Modifier le post' : 'Nouveau post'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl leading-none cursor-pointer">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-gray-400 font-normal">(auto-généré depuis le titre si vide)</span>
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ex: mon-article-sur-way"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Extrait</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu * <span className="text-gray-400 font-normal">(HTML autorisé)</span></label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags <span className="text-gray-400 font-normal">(séparés par des virgules)</span>
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="way, 2026, news"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PostStatus)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>

          {!isEdit && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image de couverture</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
                <p className="text-xs text-gray-500 mt-1">JPG, PNG ou WebP. 5 Mo max.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images supplémentaires</label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                  className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
                {imageFiles.length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">{imageFiles.length} fichier(s) sélectionné(s)</p>
                )}
              </div>
            </>
          )}

          {isEdit && existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images existantes</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {existingImages.map((url) => (
                  <div key={url} className="relative group">
                    <img src={resolveImageUrl(url)} alt="" className="w-full h-24 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(url)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isEdit && (
            <p className="text-xs text-gray-500 italic">
              Note : pour ajouter de nouvelles images sur un post existant, supprimez-le et recréez-le, ou utilisez les images supplémentaires lors de la création.
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPosts;
