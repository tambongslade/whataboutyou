import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { postsApi, resolveImageUrl, isLoggedIn, commentIdOf, type Post, type Comment, type PostAuthor } from '../services/postsService';

const formatDate = (iso?: string): string => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
};

const authorName = (author?: PostAuthor | string): string => {
  if (!author) return 'Anonyme';
  if (typeof author === 'string') return author;
  return author.name || author.email || 'Auteur';
};

const PostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([postsApi.get(slug), postsApi.listComments(slug).catch(() => [] as Comment[])])
      .then(([p, c]) => {
        if (cancelled) return;
        setPost(p);
        setComments(c);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || 'Article introuvable');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-3xl mx-auto px-6 py-12 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-2/3 mb-4" />
          <div className="h-4 bg-gray-100 rounded w-1/3 mb-8" />
          <div className="h-72 bg-gray-100 rounded-xl mb-8" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 rounded" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-4 bg-gray-100 rounded w-4/6" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h1 className="font-clash text-3xl uppercase text-black mb-4">Article introuvable</h1>
          <p className="font-nekst text-gray-600 mb-6">{error}</p>
          <Link to="/posts" className="inline-block bg-red-600 text-white font-clash uppercase tracking-wider text-sm px-6 py-3 rounded-lg hover:bg-red-700 transition">
            ← Retour aux articles
          </Link>
        </div>
      </main>
    );
  }

  const cover = resolveImageUrl(post.coverImage);
  const gallery = (post.images || []).map(resolveImageUrl).filter(Boolean);

  return (
    <main className="min-h-screen bg-white pt-20">
      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/posts" className="text-sm font-nekst text-gray-600 hover:text-red-600 inline-flex items-center gap-1 mb-6">
          ← Tous les articles
        </Link>

        {post.category && (
          <span className="inline-block bg-red-600 text-white font-clash text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
        )}

        <h1 className="font-clash text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight text-black leading-[1.05]">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-nekst text-sm text-gray-600">
          <span>Par <strong className="text-black">{authorName(post.author)}</strong></span>
          <span>•</span>
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
        </div>

        {cover && (
          <img
            src={cover}
            alt={post.title}
            className="w-full h-auto rounded-xl shadow-lg mt-8"
            loading="eager"
          />
        )}

        {post.excerpt && (
          <p className="font-nekst text-lg text-gray-700 italic mt-8 border-l-4 border-red-600 pl-4">
            {post.excerpt}
          </p>
        )}

        <div
          className="prose prose-lg max-w-none mt-8 font-nekst text-gray-800 leading-relaxed whitespace-pre-wrap"
          // Posts content is admin-authored; rendering as HTML allows formatting.
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {gallery.length > 0 && (
          <div className="mt-10">
            <h3 className="font-clash text-xl uppercase tracking-tight text-black mb-4">Galerie</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.map((url, i) => (
                <a key={url + i} href={url} target="_blank" rel="noreferrer">
                  <img src={url} alt={`Image ${i + 1}`} className="w-full h-40 object-cover rounded-lg hover:opacity-90 transition" loading="lazy" />
                </a>
              ))}
            </div>
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="text-xs font-nekst bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                #{t}
              </span>
            ))}
          </div>
        )}

        <hr className="my-12 border-gray-200" />

        <CommentsSection
          slug={slug!}
          comments={comments}
          setComments={setComments}
        />
      </article>
    </main>
  );
};

interface CommentsSectionProps {
  slug: string;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ slug, comments, setComments }) => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loggedIn = isLoggedIn();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await postsApi.addComment(slug, content.trim());
      setComments((prev) => [created, ...prev]);
      setContent('');
    } catch (err) {
      setError((err as Error).message || 'Erreur lors de l’envoi du commentaire');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (commentId: string) => {
    if (!commentId) return;
    if (!confirm('Supprimer ce commentaire ?')) return;
    try {
      await postsApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => commentIdOf(c) !== commentId));
    } catch (err) {
      alert((err as Error).message || 'Suppression impossible');
    }
  };

  return (
    <section>
      <h2 className="font-clash text-2xl sm:text-3xl uppercase tracking-tight text-black mb-6">
        Commentaires <span className="text-gray-400">({comments.length})</span>
      </h2>

      {loggedIn ? (
        <form onSubmit={submit} className="mb-8 bg-gray-50 rounded-xl p-5 border border-gray-200">
          <label className="block font-nekst text-sm font-medium text-gray-700 mb-2">
            Votre commentaire
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Partagez votre avis..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-nekst text-sm resize-y"
            required
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="bg-red-600 text-white font-clash uppercase tracking-wider text-sm px-6 py-2.5 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? 'Envoi...' : 'Publier'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 text-sm font-nekst text-yellow-800">
          Connectez-vous pour publier un commentaire.
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-gray-500 font-nekst text-center py-6">Aucun commentaire pour l’instant. Soyez le premier !</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li key={commentIdOf(c)} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-clash text-sm font-bold uppercase text-black">{authorName(c.author)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(c.createdAt)}</p>
                  <p className="font-nekst text-sm text-gray-800 mt-2 whitespace-pre-wrap">{c.content}</p>
                </div>
                {loggedIn && (
                  <button
                    onClick={() => remove(commentIdOf(c))}
                    className="text-xs text-red-600 hover:text-red-800 cursor-pointer"
                    title="Supprimer"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PostDetailPage;
