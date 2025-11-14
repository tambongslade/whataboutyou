import { useState, useEffect, useRef } from 'react';
import { validateTicket, type TicketValidationResponse } from '../../../services/ticketService';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface ValidationResult {
  response: TicketValidationResponse;
  timestamp: Date;
}

const QRValidationInterface = () => {
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [validatorName, setValidatorName] = useState('');
  const [validationLocation, setValidationLocation] = useState('Entrée Principale');
  const [loading, setLoading] = useState(false);
  const [validationHistory, setValidationHistory] = useState<ValidationResult[]>([]);
  const [lastResult, setLastResult] = useState<ValidationResult | null>(null);
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const qrScannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerElementRef = useRef<HTMLDivElement | null>(null);

  // Load validator name from localStorage
  useEffect(() => {
    const savedValidator = localStorage.getItem('adminValidatorName');
    if (savedValidator) {
      setValidatorName(savedValidator);
    }
  }, []);

  // Save validator name to localStorage
  useEffect(() => {
    if (validatorName) {
      localStorage.setItem('adminValidatorName', validatorName);
    }
  }, [validatorName]);

  // Clean up scanner when component unmounts
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  // Initialize camera scanner
  const initializeCameraScanner = () => {
    if (!scannerElementRef.current || qrScannerRef.current) return;

    try {
      setCameraError(null);

      const config = {
        fps: 10,
        qrbox: { width: 300, height: 300 },
        aspectRatio: 1.0,
        disableFlip: false,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      };

      qrScannerRef.current = new Html5QrcodeScanner(
        scannerElementRef.current.id,
        config,
        false
      );

      qrScannerRef.current.render(
        (decodedText) => {
          // Success callback - auto validate
          setQrCodeInput(decodedText);
          handleValidateQRFromCamera(decodedText);
        },
        (error) => {
          // Error callback (usually just scanning failures, not critical)
          console.log('QR scan error:', error);
        }
      );
    } catch (error) {
      console.error('Error initializing camera scanner:', error);
      setCameraError('Impossible d\'accéder à la caméra. Veuillez utiliser la saisie manuelle.');
      setScanMode('manual');
    }
  };

  // Stop camera scanner
  const stopCameraScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.clear().catch(console.error);
      qrScannerRef.current = null;
    }
  };

  // Handle QR validation from camera
  const handleValidateQRFromCamera = async (qrData: string) => {
    if (!validatorName.trim()) {
      alert('Veuillez saisir votre nom avant de scanner');
      return;
    }

    try {
      setLoading(true);
      const response = await validateTicket(qrData, validatorName, validationLocation);
      
      const result: ValidationResult = {
        response,
        timestamp: new Date()
      };
      
      setLastResult(result);
      setValidationHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
      setQrCodeInput(''); // Clear input for next scan
      
    } catch (err) {
      console.error('Error validating QR:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  // Handle mode change
  const handleScanModeChange = (mode: 'camera' | 'manual') => {
    setScanMode(mode);
    setCameraError(null);
    
    if (mode === 'camera') {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        initializeCameraScanner();
      }, 100);
    } else {
      stopCameraScanner();
    }
  };

  // Handle manual validation
  const handleValidateQR = async () => {
    if (!qrCodeInput.trim() || !validatorName.trim()) {
      alert('Veuillez saisir le QR code et votre nom');
      return;
    }
    
    try {
      setLoading(true);
      const response = await validateTicket(qrCodeInput, validatorName, validationLocation);
      
      const result: ValidationResult = {
        response,
        timestamp: new Date()
      };
      
      setLastResult(result);
      setValidationHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
      setQrCodeInput(''); // Clear input for next scan
      
      // Auto-focus back to QR input for continuous scanning
      setTimeout(() => {
        const input = document.getElementById('qr-input');
        if (input) input.focus();
      }, 100);
      
    } catch (err) {
      console.error('Error validating QR:', err);
      alert(err instanceof Error ? err.message : 'Erreur lors de la validation');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleValidateQR();
    }
  };

  const clearHistory = () => {
    setValidationHistory([]);
    setLastResult(null);
  };

  const getResultIcon = (isValid: boolean) => {
    return isValid ? '✅' : '❌';
  };

  const getResultColor = (isValid: boolean) => {
    return isValid ? 'text-green-600' : 'text-red-600';
  };

  const getResultBgColor = (isValid: boolean) => {
    return isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <span className="mr-3">📱</span>
            Validation QR Code - Entrée
          </h2>
          <p className="text-gray-600">
            Scannez les QR codes des tickets pour valider l'entrée
          </p>
        </div>
      </div>

      {/* Validator Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Informations Validateur
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du validateur *
            </label>
            <input
              type="text"
              value={validatorName}
              onChange={(e) => setValidatorName(e.target.value)}
              placeholder="Votre nom"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lieu de validation
            </label>
            <select
              value={validationLocation}
              onChange={(e) => setValidationLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Entrée Principale">Entrée Principale</option>
              <option value="Entrée VIP">Entrée VIP</option>
              <option value="Entrée Latérale">Entrée Latérale</option>
              <option value="Contrôle Sécurité">Contrôle Sécurité</option>
            </select>
          </div>
        </div>
      </div>

      {/* QR Scanner */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📷</span>
          Scanner QR Code
        </h3>
        
        {/* Mode Toggle */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleScanModeChange('camera')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              scanMode === 'camera'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📷 Caméra
          </button>
          <button
            onClick={() => handleScanModeChange('manual')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              scanMode === 'manual'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⌨️ Manuel
          </button>
        </div>

        {/* Camera Scanner */}
        {scanMode === 'camera' && (
          <div className="space-y-4">
            {cameraError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <p className="text-red-600 text-sm">{cameraError}</p>
                </div>
                <button
                  onClick={() => handleScanModeChange('manual')}
                  className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
                >
                  Utiliser la saisie manuelle
                </button>
              </div>
            ) : (
              <>
                <div className="text-center text-sm text-gray-600 mb-4">
                  <p className="font-medium">Pointez votre caméra vers le QR code</p>
                  <p className="text-xs text-gray-500 mt-1">
                    La validation se fera automatiquement
                  </p>
                </div>
                
                <div className="relative">
                  <div 
                    id="qr-scanner-entrance" 
                    ref={scannerElementRef}
                    className="w-full rounded-lg overflow-hidden"
                  />
                  {loading && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mr-3"></div>
                        <span className="text-gray-700">Validation en cours...</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Manual Input */}
        {scanMode === 'manual' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code QR ou données JSON
              </label>
              <textarea
                id="qr-input"
                value={qrCodeInput}
                onChange={(e) => setQrCodeInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Collez le contenu du QR code ici ou les données JSON...'
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none font-mono text-sm"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Astuce: Collez le contenu du QR et appuyez sur Entrée pour valider rapidement
              </p>
            </div>
            
            <button
              onClick={handleValidateQR}
              disabled={!qrCodeInput.trim() || !validatorName.trim() || loading}
              className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Validation en cours...
                </div>
              ) : (
                              <>
                <span className="mr-2">🎯</span>
                Valider le Ticket
              </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Last Result */}
      {lastResult && (
        <div className={`rounded-lg border-2 p-6 ${getResultBgColor(lastResult.response.data.isValid)}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="mr-2">{getResultIcon(lastResult.response.data.isValid)}</span>
              Dernier Résultat
            </h3>
            <span className="text-sm text-gray-600">
              {formatTime(lastResult.timestamp)}
            </span>
          </div>
          
          <div className={`text-lg font-medium mb-2 ${getResultColor(lastResult.response.data.isValid)}`}>
            {lastResult.response.data.message}
          </div>
          
          {lastResult.response.data.ticket && (
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Ticket:</span>
                <p className="font-mono text-gray-900">{lastResult.response.data.ticket.ticketNumber}</p>
              </div>
              {lastResult.response.data.ticket.customerName && (
                <div>
                  <span className="font-medium text-gray-700">Client:</span>
                  <p className="text-gray-900">{lastResult.response.data.ticket.customerName}</p>
                </div>
              )}
              {lastResult.response.data.ticket.situation && (
                <div>
                  <span className="font-medium text-gray-700">Section:</span>
                  <p className="text-gray-900 capitalize">{lastResult.response.data.ticket.situation}</p>
                </div>
              )}
              {lastResult.response.data.ticket.validDate && (
                <div>
                  <span className="font-medium text-gray-700">Date validité:</span>
                  <p className="text-gray-900">{lastResult.response.data.ticket.validDate}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Validation History */}
      {validationHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="mr-2">📋</span>
              Historique des Validations ({validationHistory.length})
            </h3>
            <button
              onClick={clearHistory}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Effacer l'historique
            </button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {validationHistory.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.response.data.isValid 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">
                      {getResultIcon(result.response.data.isValid)}
                    </span>
                    <span className={`font-medium ${getResultColor(result.response.data.isValid)}`}>
                      {result.response.data.ticket?.ticketNumber || 'Ticket non trouvé'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTime(result.timestamp)}
                  </span>
                </div>
                <p className={`text-sm mt-1 ${getResultColor(result.response.data.isValid)}`}>
                  {result.response.data.message}
                </p>
                {result.response.data.ticket?.customerName && (
                  <p className="text-xs text-gray-600 mt-1">
                    Client: {result.response.data.ticket.customerName}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {validationHistory.filter(r => r.response.data.isValid).length}
          </div>
          <div className="text-sm text-green-600">Validations réussies</div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {validationHistory.filter(r => !r.response.data.isValid).length}
          </div>
          <div className="text-sm text-red-600">Validations échouées</div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {validationHistory.length}
          </div>
          <div className="text-sm text-blue-600">Total tentatives</div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
          <span className="mr-2">💡</span>
          Aide & Instructions
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Scannez le QR code du ticket ou collez son contenu dans le champ de saisie</li>
          <li>• Appuyez sur Entrée ou cliquez sur "Valider le Ticket"</li>
          <li>• Les tickets ne peuvent être validés qu'une seule fois</li>
          <li>• Vérifiez que la date de validité correspond à aujourd'hui</li>
          <li>• En cas de problème, contactez l'équipe technique</li>
        </ul>
      </div>
    </div>
  );
};

export default QRValidationInterface; 