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
  const fullName = [author.prenom, author.nom].filter(Boolean).join(' ').trim();
  return fullName || author.name || author.email || 'Auteur';
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

        <LikeBar slug={slug!} post={post} setPost={setPost} commentCount={comments.length} />

        <CommentsSection
          slug={slug!}
          comments={comments}
          setComments={setComments}
        />
      </article>
    </main>
  );
};

interface LikeBarProps {
  slug: string;
  post: Post;
  setPost: React.Dispatch<React.SetStateAction<Post | null>>;
  commentCount: number;
}

const LikeBar: React.FC<LikeBarProps> = ({ slug, post, setPost, commentCount }) => {
  const [pending, setPending] = useState(false);
  const loggedIn = isLoggedIn();
  const liked = !!post.liked;
  const likeCount = typeof post.likeCount === 'number' ? post.likeCount : 0;

  const toggle = async () => {
    if (!loggedIn || pending) return;
    setPending(true);
    setPost((prev) =>
      prev
        ? { ...prev, liked: !liked, likeCount: Math.max(0, likeCount + (liked ? -1 : 1)) }
        : prev
    );
    try {
      const result = await postsApi.toggleLike(slug);
      setPost((prev) => (prev ? { ...prev, liked: result.liked, likeCount: result.likeCount } : prev));
    } catch (err) {
      setPost((prev) => (prev ? { ...prev, liked, likeCount } : prev));
      alert((err as Error).message || 'Erreur lors du like');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="my-12 flex items-center justify-between border-y border-gray-200 py-6">
      <button
        onClick={toggle}
        disabled={!loggedIn || pending}
        title={loggedIn ? (liked ? 'Retirer le like' : 'Aimer cet article') : 'Connectez-vous pour aimer'}
        className={`group flex items-center gap-3 transition-colors ${
          loggedIn ? 'cursor-pointer' : 'cursor-not-allowed'
        }`}
      >
        <span
          className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
            liked
              ? 'bg-red-600 border-red-600 text-white'
              : 'border-gray-300 text-gray-500 group-hover:border-red-600 group-hover:text-red-600 group-hover:scale-110'
          } ${pending ? 'animate-pulse' : ''}`}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
          </svg>
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="font-clash text-lg font-bold uppercase tracking-tight text-black">
            {likeCount}
          </span>
          <span className="font-nekst text-xs text-gray-500 uppercase tracking-wider">
            {likeCount <= 1 ? 'like' : 'likes'}
          </span>
        </span>
      </button>

      <div className="flex items-center gap-3 text-gray-500">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="font-nekst text-sm">
          <strong className="font-clash text-black">{commentCount}</strong>{' '}
          {commentCount <= 1 ? 'commentaire' : 'commentaires'}
        </span>
      </div>
    </div>
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
