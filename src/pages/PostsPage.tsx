import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { postsApi, postIdOf, resolveImageUrl, type Post } from '../services/postsService';

const PAGE_SIZE = 9;

const formatDate = (iso?: string): string => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
};

const PostsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const tag = searchParams.get('tag') || '';

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    postsApi
      .list({ page, limit: PAGE_SIZE, status: 'published', search: search || undefined, category: category || undefined, tag: tag || undefined })
      .then((result) => {
        if (cancelled) return;
        setPosts(result.items);
        setTotal(result.total);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message || 'Erreur lors du chargement des articles');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, search, category, tag]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  const updateParams = (next: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === '') params.delete(k);
      else params.set(k, v);
    });
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim() || undefined, page: '1' });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Hero header */}
      <section className="bg-gradient-to-b from-black to-red-950 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-clash text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight">
            Posts <span className="text-red-500">&amp; Actualités</span>
          </h1>
          <p className="font-nekst mt-6 text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
            Restez informé des dernières actualités, annonces et coulisses de What About You.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 bg-white sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Rechercher un article..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 font-nekst text-sm"
            />
            <button
              type="submit"
              className="bg-red-600 text-white font-clash uppercase font-bold tracking-wider text-sm px-5 py-2.5 rounded-lg hover:bg-red-700 transition cursor-pointer"
            >
              Chercher
            </button>
          </form>
          {(search || category || tag) && (
            <div className="flex items-center gap-2 flex-wrap">
              {search && (
                <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">Recherche : “{search}”</span>
              )}
              {category && (
                <span className="text-xs bg-sky-100 text-sky-700 px-3 py-1 rounded-full">Catégorie : {category}</span>
              )}
              {tag && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">#{tag}</span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-600 underline hover:text-black cursor-pointer"
              >
                Réinitialiser
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Posts grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-80" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-16">
            <p className="font-clash text-2xl text-gray-700 uppercase">Aucun article trouvé</p>
            <p className="font-nekst text-gray-500 mt-2">Revenez bientôt pour découvrir nos prochaines publications.</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={postIdOf(post) || post.slug} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => updateParams({ page: String(Math.max(1, page - 1)) })}
                  disabled={page <= 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-nekst hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  ← Précédent
                </button>
                <span className="font-nekst text-sm text-gray-700 px-4">
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => updateParams({ page: String(Math.min(totalPages, page + 1)) })}
                  disabled={page >= totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-nekst hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const cover = resolveImageUrl(post.coverImage);
  return (
    <Link
      to={`/posts/${post.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all"
    >
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
            <span className="font-clash text-red-300 text-4xl">WAY</span>
          </div>
        )}
        {post.category && (
          <span className="absolute top-3 left-3 bg-red-600 text-white font-clash text-xs uppercase tracking-wider px-3 py-1 rounded-full">
            {post.category}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-clash text-xl font-bold text-black uppercase tracking-tight line-clamp-2 group-hover:text-red-600 transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="font-nekst text-sm text-gray-600 mt-3 line-clamp-3">{post.excerpt}</p>
        )}
        <div className="mt-4 flex items-center justify-between text-xs font-nekst text-gray-500">
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          {post.tags && post.tags.length > 0 && (
            <span className="text-red-600">#{post.tags[0]}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PostsPage;
