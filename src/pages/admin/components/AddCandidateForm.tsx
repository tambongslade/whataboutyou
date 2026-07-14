import { useState } from 'react';
import { candidateService, getImageUrl, handleApiError, type Candidate } from '../../../services/candidateService';

interface AddCandidateFormProps {
  onCreated: (candidate: Candidate) => void;
}

const AddCandidateForm = ({ onCreated }: AddCandidateFormProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'miss' | 'master'>('miss');
  const [image, setImage] = useState('');
  const [sash, setSash] = useState('MISS WAY 2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCategoryChange = (value: 'miss' | 'master') => {
    setCategory(value);
    // Keep the sash in sync unless the admin already customised it
    if (sash === 'MISS WAY 2026' || sash === 'MASTER WAY 2026') {
      setSash(value === 'miss' ? 'MISS WAY 2026' : 'MASTER WAY 2026');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await candidateService.createCandidate({
        name: name.trim(),
        category,
        image: image.trim(),
        sash: sash.trim(),
        isActive: true
      });

      if (result.success && result.data) {
        onCreated(result.data);
        setSuccess(`${result.data.name} ajouté(e) au concours.`);
        setName('');
        setImage('');
      } else {
        setError(result.error || "Erreur lors de la création du candidat");
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-black/10 p-6 lg:p-8">
      <div className="flex items-baseline gap-4 mb-6">
        <span className="font-mono text-[10px] tracking-[0.3em] text-gray-400">F</span>
        <div className="h-px flex-1 bg-black/10" />
        <span className="font-nekst text-[10px] tracking-[0.4em] uppercase text-black">
          Ajouter un candidat
        </span>
      </div>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full border border-dashed border-black/20 hover:border-black/50 text-gray-500 hover:text-black py-4 text-sm font-medium transition-colors"
        >
          + Nouveau candidat
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Solange Noah Biteya"
                className="w-full px-4 py-3 border border-black/15 focus:border-black focus:outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as 'miss' | 'master')}
                className="w-full px-4 py-3 border border-black/15 focus:border-black focus:outline-none text-sm bg-white"
              >
                <option value="miss">Miss</option>
                <option value="master">Master</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Image (chemin ou URL)
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/miss2026/nom-candidate.webp"
                className="w-full px-4 py-3 border border-black/15 focus:border-black focus:outline-none text-sm font-mono"
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                Chemin servi par le site (ex : /miss2026/…) ou URL complète
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Écharpe
              </label>
              <input
                type="text"
                value={sash}
                onChange={(e) => setSash(e.target.value)}
                className="w-full px-4 py-3 border border-black/15 focus:border-black focus:outline-none text-sm"
                required
              />
            </div>
          </div>

          {image.trim() && (
            <div className="flex items-center gap-4">
              <img
                src={getImageUrl(image.trim())}
                alt="Aperçu"
                className="w-20 h-28 object-cover object-top border border-black/10"
                onError={(e) => {
                  e.currentTarget.style.opacity = '0.2';
                }}
                onLoad={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              />
              <p className="text-xs text-gray-400">Aperçu de l'image</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
              {success}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-black hover:bg-gray-800 text-white text-sm font-medium px-8 py-3 transition-colors disabled:opacity-50"
            >
              {loading ? 'Création…' : 'Créer le candidat'}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError(null);
                setSuccess(null);
              }}
              className="border border-black/15 hover:border-black text-sm font-medium px-6 py-3 transition-colors"
            >
              Fermer
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddCandidateForm;
