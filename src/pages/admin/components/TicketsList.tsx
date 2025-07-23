import { useState, useEffect, useRef } from 'react';
import { searchTicketByEmail, confirmTicketPayment, validateTicket, type Ticket } from '../../../services/ticketService';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface TicketsListProps {
  tickets?: Ticket[];
  isPreview?: boolean;
}

const TicketsList = ({ isPreview = false }: TicketsListProps) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSituation, setFilterSituation] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [scanMode, setScanMode] = useState<'manual' | 'camera'>('camera');
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const qrScannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerElementRef = useRef<HTMLDivElement | null>(null);

  // Load tickets (for now we'll use search functionality)
  useEffect(() => {
    setLoading(false); // Since we don't have a "get all tickets" endpoint, we'll start empty
  }, []);

  // Search ticket by email
  const handleSearchByEmail = async (email: string) => {
    if (!email.trim()) {
      setTickets([]);
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);
      const ticket = await searchTicketByEmail(email);
      if (ticket) {
        setTickets([ticket]);
      } else {
        setTickets([]);
        setError('Aucun ticket trouvé pour cette adresse email');
      }
    } catch (err) {
      console.error('Error searching ticket:', err);
      
      // Handle specific authentication errors
      if (err instanceof Error) {
        if (err.message.includes('Unauthorized') || err.message.includes('401')) {
          setError('Accès non autorisé. Veuillez vous reconnecter à l\'administration.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Erreur lors de la recherche');
      }
      setTickets([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Confirm payment manually
  const handleConfirmPayment = async (txRef: string) => {
    if (!txRef) return;
    
    try {
      setActionLoading(txRef);
      await confirmTicketPayment(txRef);
      alert('Paiement confirmé avec succès!');
      // Refresh the ticket data
      if (searchTerm) {
        await handleSearchByEmail(searchTerm);
      }
    } catch (err) {
      console.error('Error confirming payment:', err);
      
      // Handle authentication errors
      let errorMessage = 'Erreur lors de la confirmation du paiement';
      if (err instanceof Error) {
        if (err.message.includes('Unauthorized') || err.message.includes('401')) {
          errorMessage = 'Accès non autorisé. Veuillez vous reconnecter à l\'administration.';
        } else {
          errorMessage = err.message;
        }
      }
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  // Validate QR code
  const handleValidateQR = async () => {
    if (!qrCodeInput.trim()) return;
    
    try {
      setActionLoading('qr-validation');
      const result = await validateTicket(qrCodeInput, 'Admin', 'Admin Interface');
      
      if (result.success && result.data.isValid) {
        alert(`✅ ${result.data.message}`);
        setQrCodeInput('');
        setQrScannerOpen(false);
      } else {
        alert(`❌ ${result.data.message}`);
      }
    } catch (err) {
      console.error('Error validating QR:', err);
      
      // Handle authentication errors
      let errorMessage = 'Erreur lors de la validation';
      if (err instanceof Error) {
        if (err.message.includes('Unauthorized') || err.message.includes('401')) {
          errorMessage = 'Accès non autorisé. Veuillez vous reconnecter à l\'administration.';
        } else {
          errorMessage = err.message;
        }
      }
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  // Clean up scanner when modal closes
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
        qrbox: { width: 250, height: 250 },
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
          // Success callback
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
    try {
      setActionLoading('qr-validation');
      const result = await validateTicket(qrData, 'Admin', 'Admin Interface - Camera');
      
      if (result.success && result.data.isValid) {
        alert(`✅ ${result.data.message}`);
        setQrCodeInput('');
        setQrScannerOpen(false);
        stopCameraScanner();
      } else {
        alert(`❌ ${result.data.message}`);
      }
    } catch (err) {
      console.error('Error validating QR:', err);
      
      let errorMessage = 'Erreur lors de la validation';
      if (err instanceof Error) {
        if (err.message.includes('Unauthorized') || err.message.includes('401')) {
          errorMessage = 'Accès non autorisé. Veuillez vous reconnecter à l\'administration.';
        } else {
          errorMessage = err.message;
        }
      }
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle mode change
  const handleScanModeChange = (mode: 'manual' | 'camera') => {
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

  // Handle scanner modal close
  const handleCloseScannerModal = () => {
    stopCameraScanner();
    setQrScannerOpen(false);
    setQrCodeInput('');
    setCameraError(null);
    setScanMode('camera');
  };

  // Handle scanner modal open
  const handleOpenScannerModal = () => {
    setQrScannerOpen(true);
    // Initialize camera scanner by default
    if (scanMode === 'camera') {
      setTimeout(() => {
        initializeCameraScanner();
      }, 100);
    }
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customerPhone.includes(searchTerm) ||
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || ticket.paymentStatus === filterStatus;
    const matchesSituation = filterSituation === 'all' || ticket.situation === filterSituation;
    
    return matchesSearch && matchesStatus && matchesSituation;
  });

  const displayedTickets = isPreview ? filteredTickets.slice(0, 5) : filteredTickets;

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: '⏳', label: 'En attente' },
      confirmed: { color: 'bg-green-100 text-green-800', icon: '✅', label: 'Confirmé' },
      failed: { color: 'bg-red-100 text-red-800', icon: '❌', label: 'Échoué' }
    };
    
    const badge = badges[status as keyof typeof badges] || { color: 'bg-gray-100 text-gray-800', icon: '❓', label: 'Inconnu' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <span className="mr-1">{badge.icon}</span>
        {badge.label}
      </span>
    );
  };

  const getSituationBadge = (situation: string) => {
    const badges = {
      rouge: { color: 'bg-red-100 text-red-800', emoji: '🔴', label: 'ROUGE' },
      bleu: { color: 'bg-blue-100 text-blue-800', emoji: '🔵', label: 'BLEU' },
      jaune: { color: 'bg-yellow-100 text-yellow-800', emoji: '🟡', label: 'JAUNE' }
    };
    
    const badge = badges[situation as keyof typeof badges] || { color: 'bg-gray-100 text-gray-800', emoji: '⚪', label: 'AUTRE' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <span className="mr-1">{badge.emoji}</span>
        {badge.label}
      </span>
    );
  };

  const formatDate = (date: any) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Chargement des tickets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* QR Scanner Modal */}
      {qrScannerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <span className="mr-2">📱</span>
                  Scanner QR Code
                </h3>
                <button
                  onClick={handleCloseScannerModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
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
                        <p>Pointez votre caméra vers le QR code</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Le scan se fera automatiquement
                        </p>
                      </div>
                      
                      <div className="relative">
                        <div 
                          id="qr-scanner-container" 
                          ref={scannerElementRef}
                          className="w-full"
                        />
                        {actionLoading === 'qr-validation' && (
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
                      value={qrCodeInput}
                      onChange={(e) => setQrCodeInput(e.target.value)}
                      placeholder='{"ticket":"WAY2024-TICKET-001","date":"2024-01-25","situation":"rouge","email":"user@example.com","ts":1642857600000}'
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-32 resize-none font-mono text-sm"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleValidateQR}
                      disabled={!qrCodeInput.trim() || actionLoading === 'qr-validation'}
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === 'qr-validation' ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Validation...
                        </div>
                      ) : (
                        '✅ Valider'
                      )}
                    </button>
                    <button
                      onClick={handleCloseScannerModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header and Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="mr-2">🎫</span>
              Gestion des Tickets
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredTickets.length} ticket(s) trouvé(s)
            </p>
          </div>
          
          <button
            onClick={handleOpenScannerModal}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
          >
            <span className="mr-2">📱</span>
            Scanner QR Code
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher par email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="email@example.com"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchByEmail(searchTerm)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={() => handleSearchByEmail(searchTerm)}
                disabled={searchLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500 hover:text-orange-700"
              >
                {searchLoading ? '⏳' : '🔍'}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">⏳ En attente</option>
              <option value="confirmed">✅ Confirmé</option>
              <option value="failed">❌ Échoué</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section
            </label>
            <select
              value={filterSituation}
              onChange={(e) => setFilterSituation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Toutes sections</option>
              <option value="rouge">🔴 Rouge</option>
              <option value="bleu">🔵 Bleu</option>
              <option value="jaune">🟡 Jaune</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actions rapides
            </label>
            <button
              onClick={() => setTickets([])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Effacer résultats
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tickets Table */}
      {displayedTickets.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket / Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Section
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-xs font-mono text-gray-500 mb-1">
                          {ticket.ticketNumber}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {ticket.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ticket.customerEmail}
                        </div>
                        <div className="text-xs text-gray-400">
                          {ticket.customerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSituationBadge(ticket.situation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getStatusBadge(ticket.paymentStatus)}
                        <div className="text-xs text-gray-500">
                          {ticket.paymentMethod}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ticket.validDate}
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        {ticket.price.toLocaleString()} FCFA
                      </div>
                      {ticket.purchaseDate && (
                        <div className="text-xs text-gray-500">
                          Acheté: {formatDate(ticket.purchaseDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.isValidated ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✅ Validé
                          </span>
                          {ticket.validatedAt && (
                            <div className="text-xs text-gray-500">
                              {formatDate(ticket.validatedAt)}
                            </div>
                          )}
                          {ticket.validatedBy && (
                            <div className="text-xs text-gray-500">
                              Par: {ticket.validatedBy}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          ⏳ Non validé
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        👁️ Voir
                      </button>
                      {ticket.paymentStatus === 'pending' && ticket.txRef && (
                        <button
                          onClick={() => handleConfirmPayment(ticket.txRef)}
                          disabled={actionLoading === ticket.txRef}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          {actionLoading === ticket.txRef ? '⏳' : '✅'} Confirmer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {displayedTickets.length === 0 && !searchLoading && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">🎫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun ticket trouvé</h3>
          <p className="text-gray-500 mb-4">
            Recherchez un ticket en saisissant une adresse email
          </p>
          <div className="text-sm text-gray-400">
            💡 Astuce: Utilisez le scanner QR pour valider les tickets à l'entrée
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <span className="mr-2">🎫</span>
                  Détails du Ticket
                </h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700">Numéro de ticket</label>
                  <p className="text-lg font-mono text-orange-600">{selectedTicket.ticketNumber}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Client</label>
                    <p className="text-sm text-gray-900">{selectedTicket.customerName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedTicket.customerEmail}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                    <p className="text-sm text-gray-900">{selectedTicket.customerPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Section</label>
                    <div>{getSituationBadge(selectedTicket.situation)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date de validité</label>
                    <p className="text-sm text-gray-900">{selectedTicket.validDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix</label>
                    <p className="text-sm font-medium text-green-600">{selectedTicket.price.toLocaleString()} FCFA</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Statut paiement</label>
                    <div>{getStatusBadge(selectedTicket.paymentStatus)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Méthode paiement</label>
                    <p className="text-sm text-gray-900">{selectedTicket.paymentMethod}</p>
                  </div>
                </div>
                
                {selectedTicket.isValidated && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700">Validation</label>
                    <p className="text-sm text-green-800">
                      ✅ Validé le {selectedTicket.validatedAt && formatDate(selectedTicket.validatedAt)}
                    </p>
                    {selectedTicket.validatedBy && (
                      <p className="text-sm text-green-600">
                        Par: {selectedTicket.validatedBy}
                      </p>
                    )}
                  </div>
                )}

                {selectedTicket.qrCodeImage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">QR Code</label>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <img 
                        src={selectedTicket.qrCodeImage} 
                        alt="QR Code" 
                        className="mx-auto max-w-48 max-h-48"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsList; 