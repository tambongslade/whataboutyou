import SurveyResponses from '../components/SurveyResponses';
import SectionHeader from '../components/SectionHeader';

const SurveysSection = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        index="05"
        eyebrow="Community"
        title="Sondages"
        subtitle="Réponses et feedback des participants."
      />
      <div className="bg-white border border-black/10 p-6 lg:p-8">
        <SurveyResponses />
      </div>
    </div>
  );
};

export default SurveysSection;
