import { useState } from 'react';
import { submitSurvey, type SurveySubmissionData } from '../services/surveyService';

// Types for the survey
type Category = 'Exposant' | 'Participant étudiant' | 'Participant collégien' | 'Participant travailleur' | 'Participant partenaire';

interface PersonalInfo {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  category: Category | '';
  occupationDetails: string; // Category-based occupation (field of study, job sector, company, etc.)
}

interface SurveyData extends PersonalInfo {
  previousParticipation: 'Oui' | 'Non' | '';
  // Category-specific responses
  categoryResponses: Record<string, string>;
  // General suggestions (Partie 7)
  plusGrandeForce: string;
  pointAmeliorer: string;
  recommandation: 'Oui' | 'Peut-être' | 'Non' | '';
}

const SondagePage = () => {
  const [currentStep, setCurrentStep] = useState<'personal' | 'partie1' | 'category-specific' | 'partie7' | 'success'>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<SurveyData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    category: '',
    occupationDetails: '',
    previousParticipation: '',
    categoryResponses: {},
    plusGrandeForce: '',
    pointAmeliorer: '',
    recommandation: ''
  });

  // Get occupation label based on category
  const getOccupationLabel = (category: Category | ''): string => {
    switch (category) {
      case 'Exposant':
        return 'Nom de votre entreprise/organisation';
      case 'Participant étudiant':
        return 'Domaine d\'études';
      case 'Participant collégien':
        return 'Classe actuelle';
      case 'Participant travailleur':
        return 'Secteur d\'activité professionnelle';
      case 'Participant partenaire':
        return 'Organisation/Structure partenaire';
      default:
        return 'Occupation';
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof SurveyData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle category response changes
  const handleCategoryResponseChange = (questionKey: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      categoryResponses: { ...prev.categoryResponses, [questionKey]: value }
    }));
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStep === 'personal') {
      setCurrentStep('partie1');
    } else if (currentStep === 'partie1') {
      setCurrentStep('category-specific');
    } else if (currentStep === 'category-specific') {
      setCurrentStep('partie7');
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep === 'partie7') {
      setCurrentStep('category-specific');
    } else if (currentStep === 'category-specific') {
      setCurrentStep('partie1');
    } else if (currentStep === 'partie1') {
      setCurrentStep('personal');
    }
  };

  // Submit survey to backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare data for API submission
      const submissionData: SurveySubmissionData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        category: formData.category as Category,
        occupationDetails: formData.occupationDetails,
        previousParticipation: formData.previousParticipation as 'Oui' | 'Non',
        categoryResponses: {
          q1: formData.categoryResponses.q1 || '',
          q2: formData.categoryResponses.q2 || '',
          q3: formData.categoryResponses.q3 || '',
          q4: formData.categoryResponses.q4 || '',
        },
        plusGrandeForce: formData.plusGrandeForce,
        pointAmeliorer: formData.pointAmeliorer,
        recommandation: formData.recommandation as 'Oui' | 'Peut-être' | 'Non',
      };

      // Submit to backend API
      const response = await submitSurvey(submissionData);

      if (response.success) {
        setCurrentStep('success');
      } else {
        setError(response.message || 'Une erreur s\'est produite lors de l\'envoi du sondage.');
      }
    } catch (err: unknown) {
      console.error('Error submitting survey:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur s\'est produite lors de l\'envoi du sondage. Veuillez réessayer.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render personal information form
  const renderPersonalInfoForm = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Informations Personnelles</h2>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => handleInputChange('nom', e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => handleInputChange('prenom', e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Votre prénom"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="votre@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone *
          </label>
          <input
            type="tel"
            value={formData.telephone}
            onChange={(e) => handleInputChange('telephone', e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="695123456"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vous êtes : *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Sélectionnez une catégorie</option>
            <option value="Exposant">Exposant</option>
            <option value="Participant étudiant">Participant étudiant</option>
            <option value="Participant collégien">Participant collégien</option>
            <option value="Participant travailleur">Participant travailleur</option>
            <option value="Participant partenaire">Participant partenaire</option>
          </select>
        </div>

        {formData.category && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getOccupationLabel(formData.category)} *
            </label>
            <input
              type="text"
              value={formData.occupationDetails}
              onChange={(e) => handleInputChange('occupationDetails', e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={getOccupationLabel(formData.category)}
            />
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={goToNextStep}
            disabled={!formData.nom || !formData.prenom || !formData.email || !formData.telephone || !formData.category || !formData.occupationDetails}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );

  // Render Partie 1 - Informations générales
  const renderPartie1 = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Partie 1 : Informations générales</h2>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900">
            <strong>Catégorie sélectionnée :</strong> {formData.category}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Avez-vous déjà participé à une précédente édition de What About You ? *
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="previousParticipation"
                value="Oui"
                checked={formData.previousParticipation === 'Oui'}
                onChange={(e) => handleInputChange('previousParticipation', e.target.value as 'Oui' | 'Non')}
                className="w-4 h-4 text-orange-500"
              />
              <span>Oui</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="previousParticipation"
                value="Non"
                checked={formData.previousParticipation === 'Non'}
                onChange={(e) => handleInputChange('previousParticipation', e.target.value as 'Oui' | 'Non')}
                className="w-4 h-4 text-orange-500"
              />
              <span>Non</span>
            </label>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={goToPreviousStep}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            Précédent
          </button>
          <button
            onClick={goToNextStep}
            disabled={!formData.previousParticipation}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );

  // Render category-specific questions (Partie 2-6)
  const renderCategorySpecificQuestions = () => {
    const category = formData.category;

    // Exposants - Partie 2
    if (category === 'Exposant') {
      return (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Partie 2 : Exposants</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment évaluez-vous la qualité de l'organisation (accueil, logistique, emplacement des stands) ? *
              </label>
              <textarea
                value={formData.categoryResponses.q1 || ''}
                onChange={(e) => handleCategoryResponseChange('q1', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Votre évaluation..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Avez-vous eu une bonne visibilité auprès du public ? *
              </label>
              <div className="space-y-2">
                {['Oui', 'Partiellement', 'Non'].map(option => (
                  <label key={option} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="visibilite"
                      value={option}
                      checked={formData.categoryResponses.q2 === option}
                      onChange={(e) => handleCategoryResponseChange('q2', e.target.value)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quelles difficultés avez-vous rencontrées en tant qu'exposant ? *
              </label>
              <textarea
                value={formData.categoryResponses.q3 || ''}
                onChange={(e) => handleCategoryResponseChange('q3', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Décrivez les difficultés..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quelles améliorations aimeriez-vous voir pour la prochaine édition ? *
              </label>
              <textarea
                value={formData.categoryResponses.q4 || ''}
                onChange={(e) => handleCategoryResponseChange('q4', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Vos suggestions d'amélioration..."
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={goToPreviousStep}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Précédent
              </button>
              <button
                onClick={goToNextStep}
                disabled={!formData.categoryResponses.q1 || !formData.categoryResponses.q2 || !formData.categoryResponses.q3 || !formData.categoryResponses.q4}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Participants étudiants - Partie 3
    if (category === 'Participant étudiant') {
      return (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Partie 3 : Participants étudiants</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sur une échelle de 1 à 5, comment évaluez-vous l'organisation générale de l'événement ? *
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map(rating => (
                  <label key={rating} className="flex items-center justify-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-orange-50 hover:border-orange-500 transition-all">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={formData.categoryResponses.q1 === String(rating)}
                      onChange={(e) => handleCategoryResponseChange('q1', e.target.value)}
                      className="sr-only"
                    />
                    <span className={`text-2xl font-bold ${formData.categoryResponses.q1 === String(rating) ? 'text-orange-600' : 'text-gray-400'}`}>
                      {rating}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qu'avez-vous le plus apprécié (conférences, ateliers, networking, ambiance, etc.) ? *
              </label>
              <textarea
                value={formData.categoryResponses.q2 || ''}
                onChange={(e) => handleCategoryResponseChange('q2', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ce que vous avez le plus apprécié..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                L'événement a-t-il répondu à vos attentes en termes d'orientation ou d'inspiration pour votre avenir ? *
              </label>
              <div className="space-y-2">
                {['Oui totalement', 'Partiellement', 'Pas du tout'].map(option => (
                  <label key={option} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="expectations"
                      value={option}
                      checked={formData.categoryResponses.q3 === option}
                      onChange={(e) => handleCategoryResponseChange('q3', e.target.value)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qu'aimeriez-vous voir amélioré ou ajouté pour la prochaine édition ? *
              </label>
              <textarea
                value={formData.categoryResponses.q4 || ''}
                onChange={(e) => handleCategoryResponseChange('q4', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Vos suggestions..."
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={goToPreviousStep}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Précédent
              </button>
              <button
                onClick={goToNextStep}
                disabled={!formData.categoryResponses.q1 || !formData.categoryResponses.q2 || !formData.categoryResponses.q3 || !formData.categoryResponses.q4}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Participants collégiens - Partie 4
    if (category === 'Participant collégien') {
      return (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Partie 4 : Participants collégiens</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                L'événement était-il adapté à votre niveau (contenu, ateliers, ambiance) ? *
              </label>
              <textarea
                value={formData.categoryResponses.q1 || ''}
                onChange={(e) => handleCategoryResponseChange('q1', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Votre réponse..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qu'avez-vous le plus aimé (animations, ateliers, activités, etc.) ? *
              </label>
              <textarea
                value={formData.categoryResponses.q2 || ''}
                onChange={(e) => handleCategoryResponseChange('q2', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ce que vous avez le plus aimé..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Est-ce que What About You vous a aidé à découvrir de nouveaux métiers ou passions ? *
              </label>
              <textarea
                value={formData.categoryResponses.q3 || ''}
                onChange={(e) => handleCategoryResponseChange('q3', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Votre réponse..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Que voudriez-vous retrouver ou améliorer pour la prochaine édition ? *
              </label>
              <textarea
                value={formData.categoryResponses.q4 || ''}
                onChange={(e) => handleCategoryResponseChange('q4', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Vos suggestions..."
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={goToPreviousStep}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Précédent
              </button>
              <button
                onClick={goToNextStep}
                disabled={!formData.categoryResponses.q1 || !formData.categoryResponses.q2 || !formData.categoryResponses.q3 || !formData.categoryResponses.q4}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Participants travailleurs - Partie 5
    if (category === 'Participant travailleur') {
      return (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Partie 5 : Participants travailleurs</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Comment évaluez-vous la pertinence de l'événement pour votre développement professionnel ? *
              </label>
              <div className="space-y-2">
                {['Très pertinent', 'Pertinent', 'Peu pertinent', 'Pas pertinent'].map(option => (
                  <label key={option} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="relevance"
                      value={option}
                      checked={formData.categoryResponses.q1 === option}
                      onChange={(e) => handleCategoryResponseChange('q1', e.target.value)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Avez-vous eu des opportunités concrètes de networking ou de collaboration ? *
              </label>
              <div className="space-y-2">
                {['Oui', 'Non'].map(option => (
                  <label key={option} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="networking"
                      value={option}
                      checked={formData.categoryResponses.q2 === option}
                      onChange={(e) => handleCategoryResponseChange('q2', e.target.value)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quels aspects vous ont le plus marqué (thèmes abordés, intervenants, qualité des échanges…) ? *
              </label>
              <textarea
                value={formData.categoryResponses.q3 || ''}
                onChange={(e) => handleCategoryResponseChange('q3', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Les aspects marquants..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quelles améliorations ou ajouts proposeriez-vous pour mieux répondre aux besoins des jeunes travailleurs ? *
              </label>
              <textarea
                value={formData.categoryResponses.q4 || ''}
                onChange={(e) => handleCategoryResponseChange('q4', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Vos propositions..."
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={goToPreviousStep}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Précédent
              </button>
              <button
                onClick={goToNextStep}
                disabled={!formData.categoryResponses.q1 || !formData.categoryResponses.q2 || !formData.categoryResponses.q3 || !formData.categoryResponses.q4}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Participants partenaires - Partie 6
    if (category === 'Participant partenaire') {
      return (
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Partie 6 : Participants partenaires</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Comment jugez-vous la visibilité offerte à votre structure lors de l'événement ? *
              </label>
              <div className="space-y-2">
                {['Excellente', 'Bonne', 'Moyenne', 'Faible'].map(option => (
                  <label key={option} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="visibility"
                      value={option}
                      checked={formData.categoryResponses.q1 === option}
                      onChange={(e) => handleCategoryResponseChange('q1', e.target.value)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Avez-vous atteint vos objectifs (visibilité, partenariats, contacts, recrutement, etc.) ? *
              </label>
              <div className="space-y-2">
                {['Oui', 'Partiellement', 'Non'].map(option => (
                  <label key={option} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="objectives"
                      value={option}
                      checked={formData.categoryResponses.q2 === option}
                      onChange={(e) => handleCategoryResponseChange('q2', e.target.value)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quels dispositifs ou espaces ont le mieux fonctionné pour vous (stand, animations, interventions, affichage, etc.) ? *
              </label>
              <textarea
                value={formData.categoryResponses.q3 || ''}
                onChange={(e) => handleCategoryResponseChange('q3', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Ce qui a le mieux fonctionné..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quelles suggestions auriez-vous pour améliorer la prochaine édition du point de vue d'un partenaire ? *
              </label>
              <textarea
                value={formData.categoryResponses.q4 || ''}
                onChange={(e) => handleCategoryResponseChange('q4', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Vos suggestions..."
              />
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={goToPreviousStep}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Précédent
              </button>
              <button
                onClick={goToNextStep}
                disabled={!formData.categoryResponses.q1 || !formData.categoryResponses.q2 || !formData.categoryResponses.q3 || !formData.categoryResponses.q4}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Render Partie 7 - Suggestions générales
  const renderPartie7 = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Partie 7 : Suggestions générales</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quelle est, selon vous, la plus grande force de What About You ? *
          </label>
          <textarea
            value={formData.plusGrandeForce}
            onChange={(e) => handleInputChange('plusGrandeForce', e.target.value)}
            rows={4}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="La plus grande force..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quel est le point le plus urgent à améliorer ? *
          </label>
          <textarea
            value={formData.pointAmeliorer}
            onChange={(e) => handleInputChange('pointAmeliorer', e.target.value)}
            rows={4}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Le point à améliorer..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Auriez-vous envie de recommander What About You à vos proches/collègues ? *
          </label>
          <div className="space-y-2">
            {['Oui', 'Peut-être', 'Non'].map(option => (
              <label key={option} className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="recommandation"
                  value={option}
                  checked={formData.recommandation === option}
                  onChange={(e) => handleInputChange('recommandation', e.target.value as 'Oui' | 'Peut-être' | 'Non')}
                  required
                  className="w-4 h-4 text-orange-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={goToPreviousStep}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            Précédent
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.plusGrandeForce || !formData.pointAmeliorer || !formData.recommandation}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Envoi en cours...
              </div>
            ) : (
              'Soumettre le sondage'
            )}
          </button>
        </div>
      </form>
    </div>
  );

  // Render success message
  const renderSuccess = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto text-center">
      <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-green-600 mb-4">Merci pour votre participation !</h2>
      <p className="text-gray-700 text-lg mb-8">
        Votre sondage a été soumis avec succès. Vos retours sont précieux pour améliorer les prochaines éditions de What About You.
      </p>
      <a
        href="/#/"
        className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
      >
        Retour à l'accueil
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sondage <span className="text-orange-600">What About You</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Aidez-nous à améliorer votre expérience en répondant à ce questionnaire
          </p>
        </div>

        {/* Progress indicator */}
        {currentStep !== 'success' && (
          <div className="mb-8">
            <div className="flex justify-between items-center max-w-2xl mx-auto">
              {['Informations', 'Partie 1', 'Questions', 'Suggestions'].map((label, index) => {
                const steps = ['personal', 'partie1', 'category-specific', 'partie7'];
                const currentIndex = steps.indexOf(currentStep);
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;

                return (
                  <div key={label} className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <p className={`text-xs mt-2 text-center ${isCurrent ? 'text-orange-600 font-semibold' : 'text-gray-600'}`}>
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Render current step */}
        {currentStep === 'personal' && renderPersonalInfoForm()}
        {currentStep === 'partie1' && renderPartie1()}
        {currentStep === 'category-specific' && renderCategorySpecificQuestions()}
        {currentStep === 'partie7' && renderPartie7()}
        {currentStep === 'success' && renderSuccess()}
      </div>
    </div>
  );
};

export default SondagePage;
