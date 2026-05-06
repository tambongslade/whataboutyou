import QRValidationInterface from '../components/QRValidationInterface';
import SectionHeader from '../components/SectionHeader';

const QRValidationSection = () => {
  return (
    <div className="space-y-8">
      <SectionHeader
        index="03"
        eyebrow="Operations"
        title="Scanner QR"
        subtitle="Validation des tickets à l'entrée — interface de contrôle d'accès."
        meta={
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            ENTRÉE OUVERTE
          </span>
        }
      />
      <div className="bg-white border border-black/10 p-6 lg:p-8">
        <QRValidationInterface />
      </div>
    </div>
  );
};

export default QRValidationSection;
