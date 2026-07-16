import { useEffect, useRef, useState } from 'react';
import { candidateService, handleApiError } from '../../../services/candidateService';

interface AddCandidateFormProps {
  onCreated: () => void | Promise<void>;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // backend upload limit

const AddCandidateForm = ({ onCreated }: AddCandidateFormProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState<'miss' | 'master'>('miss');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profession, setProfession] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Release the preview object URL when it changes or on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleFileChange = (file: File | null) => {
    setError(null);
    if (file && file.size > MAX_IMAGE_BYTES) {
      setError('Image trop lourde (max 5 Mo). Compressez-la puis réessayez.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const resetFields = () => {
    setName('');
    setAge('');
    setCity('');
    setProfession('');
    setDescription('');
    handleFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await candidateService.createCandidate({
        name: name.trim(),
        age: Number(age),
        city: city.trim(),
        category,
        ...(imageFile ? { imageFile } : {}),
        ...(profession.trim() ? { profession: profession.trim() } : {}),
        ...(description.trim() ? { description: description.trim() } : {}),
        sash: category === 'miss' ? 'MISS WAY 2026' : 'MASTER WAY 2026',
        season: '2026'
      });

      if (result.success) {
        setSuccess(`${name.trim()} ajouté(e) au concours.`);
        resetFields();
        await onCreated();
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

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Âge
                </label>
                <input
                  type="number"
                  min="16"
                  max="60"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="22"
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
                  onChange={(e) => setCategory(e.target.value as 'miss' | 'master')}
                  className="w-full px-4 py-3 border border-black/15 focus:border-black focus:outline-none text-sm bg-white"
                >
                  <option value="miss">Miss</option>
                  <option value="master">Master</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Ville / Région
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex : Yaoundé"
                className="w-full px-4 py-3 border border-black/15 focus:border-black focus:outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Photo <span className="normal-case font-normal text-gray-400">(jpg, png, webp — max 5 Mo)</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                className="w-full px-4 py-2.5 border border-black/15 focus:border-black focus:outline-none text-sm file:mr-4 file:py-1.5 file:px-4 file:border-0 file:bg-black file:text-white file:text-xs file:font-medium file:cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Profession <span className="normal-case font-normal text-gray-400">(optionnel)</span>
              </label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="Ex : Étudiante en Droit"
                className="w-full px-4 py-3 border border-black/15 focus:border-black focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Description <span className="normal-case font-normal text-gray-400">(optionnel)</span>
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Quelques mots sur la candidate"
                className="w-full px-4 py-3 border border-black/15 focus:border-black focus:outline-none text-sm"
              />
            </div>
          </div>

          {imagePreview && (
            <div className="flex items-center gap-4">
              <img
                src={imagePreview}
                alt="Aperçu"
                className="w-20 h-28 object-cover object-top border border-black/10"
              />
              <p className="text-xs text-gray-400">
                {imageFile?.name} — {Math.round((imageFile?.size || 0) / 1024)} Ko
              </p>
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
