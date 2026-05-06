import { useEffect, useMemo, useState } from 'react';
import { userService, userIdOf, type AppUser } from '../../../services/userService';
import SectionHeader from '../components/SectionHeader';

const UsersSection = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await userService.list({ limit: 100 });
      setUsers(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const haystack = [u.email, u.prenom, u.nom, u.numeroTelephone, u.role]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [users, search]);

  const handleDelete = async (user: AppUser) => {
    const id = userIdOf(user);
    if (!id) return;
    if (!confirm(`Supprimer ${user.email} ?`)) return;
    setDeletingId(id);
    try {
      await userService.remove(id);
      setUsers((prev) => prev.filter((u) => userIdOf(u) !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (value?: string) => {
    if (!value) return '—';
    try {
      return new Date(value)
        .toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replace(/\//g, '.');
    } catch {
      return value;
    }
  };

  const formatRelative = (value?: string) => {
    if (!value) return '—';
    try {
      const then = new Date(value).getTime();
      const diff = Date.now() - then;
      if (diff < 0) return formatDate(value);
      const minutes = Math.floor(diff / 60_000);
      if (minutes < 1) return "à l'instant";
      if (minutes < 60) return `${minutes} min`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} h`;
      const days = Math.floor(hours / 24);
      if (days < 30) return `${days} j`;
      return formatDate(value);
    } catch {
      return formatDate(value);
    }
  };

  const fullName = (u: AppUser) => {
    const name = [u.prenom, u.nom].filter(Boolean).join(' ').trim();
    return name || '—';
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        index="06"
        eyebrow="Community"
        title="Utilisateurs"
        subtitle="Comptes utilisateurs de la plateforme — gestion des accès et rôles."
        meta={<span>{total.toString().padStart(3, '0')} TOTAL</span>}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher email, nom, téléphone, rôle..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/10 focus:border-black focus:outline-none focus:ring-0 text-sm text-black placeholder:text-gray-400 transition-colors"
            />
          </div>
          <button
            onClick={loadUsers}
            className="font-nekst text-[10px] tracking-[0.3em] uppercase bg-black text-white px-5 py-2.5 hover:bg-red-500 transition-colors"
          >
            Actualiser
          </button>
        </div>
      </SectionHeader>

      {error && (
        <div className="border-l-2 border-red-500 bg-red-500/5 p-5">
          <div className="font-nekst text-[10px] tracking-[0.3em] uppercase text-red-700 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Erreur de chargement
          </div>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white border border-black/10">
        {loading ? (
          <div className="flex items-center gap-3 px-6 py-12">
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <span className="font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">
              Chargement…
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="font-nekst text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-2">
              {users.length === 0 ? 'Aucun utilisateur' : 'Aucun résultat'}
            </div>
            <div className="font-azonix text-2xl text-black">
              {users.length === 0 ? '—' : '0 / ' + users.length}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-black/10">
                <tr>
                  <th className="px-6 py-4 text-left font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500 w-12">#</th>
                  <th className="px-6 py-4 text-left font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">Utilisateur</th>
                  <th className="px-6 py-4 text-left font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">Téléphone</th>
                  <th className="px-6 py-4 text-left font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">Rôle</th>
                  <th className="px-6 py-4 text-left font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">Statut</th>
                  <th className="px-6 py-4 text-left font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">Inscrit</th>
                  <th className="px-6 py-4 text-left font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">Dernière connexion</th>
                  <th className="px-6 py-4 text-right font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => {
                  const id = userIdOf(u);
                  const isAdmin = u.role === 'admin';
                  const isActive = u.isActive !== false;
                  return (
                    <tr key={id || i} className="border-b border-black/5 hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-[10px] text-gray-400 align-middle">
                        {String(i + 1).padStart(3, '0')}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="flex flex-col">
                          <span className="text-sm text-black">{u.email}</span>
                          <span className="font-nekst text-xs text-gray-500 mt-0.5">{fullName(u)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className="font-mono text-xs text-gray-700">
                          {u.numeroTelephone || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span
                          className={`inline-flex items-center gap-2 font-nekst text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 ${
                            isAdmin ? 'bg-red-500 text-white' : 'bg-black/5 text-gray-700'
                          }`}
                        >
                          {isAdmin && <span className="w-1 h-1 rounded-full bg-white" />}
                          {u.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className="inline-flex items-center gap-2 font-nekst text-[10px] tracking-[0.25em] uppercase">
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          <span className={isActive ? 'text-emerald-700' : 'text-gray-500'}>
                            {isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className="font-mono text-xs text-gray-500">{formatDate(u.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <span className="font-mono text-xs text-gray-500">{formatRelative(u.lastLoginAt)}</span>
                      </td>
                      <td className="px-6 py-4 text-right align-middle">
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={deletingId === id || isAdmin}
                          className="font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={isAdmin ? 'Impossible de supprimer un admin' : 'Supprimer'}
                        >
                          {deletingId === id ? 'Suppression…' : 'Supprimer'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-400">
        <span>
          {filtered.length.toString().padStart(3, '0')} affichés
          {search && users.length !== filtered.length && ` · sur ${users.length.toString().padStart(3, '0')}`}
          {' · '}
          {total.toString().padStart(3, '0')} total
        </span>
        <span className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-red-500" />
          /admin/users
        </span>
      </div>
    </div>
  );
};

export default UsersSection;
