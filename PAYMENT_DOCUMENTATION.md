# Documentation du Système de Paiement - Miss & Master 2025

## Vue d'ensemble

Le système de vote Miss & Master 2025 utilise un système de paiement mobile intégré permettant aux utilisateurs de voter pour leurs candidates préférées via MTN Mobile Money et Orange Money Cameroun.

## Flux de Paiement

### 1. Sélection du Candidat
- L'utilisateur navigue dans la galerie des candidates
- Clique sur "VOTER POUR MOI" sur la carte du candidat choisi
- Accède à l'interface de vote dédiée

### 2. Interface de Vote

#### Informations Affichées
- **Photo du candidat** avec badge de classement
- **Nom complet** du candidat
- **Position actuelle** (#1-15)
- **Points actuels** accumulés

#### Formulaire de Paiement
```
┌─────────────────────────────────────┐
│ Méthode de paiement                 │
│ ├─ 🟡 MTN Mobile Money             │
│ └─ 🟠 Orange Money CM              │
├─────────────────────────────────────┤
│ Numéro de téléphone                 │
│ [674123456]                         │
├─────────────────────────────────────┤
│ Montant du vote (FCFA)              │
│ [Montant personnalisé]              │
│ Boutons rapides: 500|1000|2500|5000│
├─────────────────────────────────────┤
│ Adresse email                       │
│ [votre@email.com]                   │
├─────────────────────────────────────┤
│ Nom complet                         │
│ [Votre nom complet]                 │
└─────────────────────────────────────┘
```

## Système de Points

### Conversion
- **100 FCFA = 1 Point**
- **Montant minimum**: 100 FCFA (1 point)
- **Pas de montant maximum**

### Exemples de Conversion
| Montant (FCFA) | Points Gagnés |
|----------------|---------------|
| 100            | 1             |
| 500            | 5             |
| 1,000          | 10            |
| 2,500          | 25            |
| 5,000          | 50            |
| 10,000         | 100           |

## Méthodes de Paiement Supportées

### 1. MTN Mobile Money
- **Indicatif**: 🟡 MTN Mobile Money
- **Numéros supportés**: 67X XXX XXX, 65X XXX XXX
- **Processus**: Redirection vers passerelle MTN MoMo

### 2. Orange Money Cameroun
- **Indicatif**: 🟠 Orange Money CM
- **Numéros supportés**: 69X XXX XXX, 65X XXX XXX
- **Processus**: Redirection vers passerelle Orange Money

## Processus de Transaction

### Étape 1: Validation du Formulaire
```javascript
// Validation côté client
- Méthode de paiement sélectionnée
- Numéro de téléphone valide (9 chiffres)
- Montant >= 100 FCFA
- Email valide
- Nom complet renseigné
```

### Étape 2: Création de la Transaction
```javascript
// Appel API
POST /api/votes
{
  "candidateId": "candidate_id",
  "customer": {
    "phone": "674123456",
    "email": "user@email.com",
    "name": "Nom Complet"
  },
  "amount": 500,
  "paymentMethod": "MTN",
  "candidateName": "Nom du Candidat"
}
```

### Étape 3: Redirection vers Passerelle
- Génération d'un lien de paiement sécurisé
- Redirection automatique vers la passerelle
- Session de paiement avec timeout (15 minutes)

### Étape 4: Traitement du Paiement
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Utilisateur   │───▶│   Passerelle     │───▶│   Notre API     │
│                 │    │   de Paiement    │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        ▼
         │                        │              ┌─────────────────┐
         │                        │              │  Mise à jour    │
         │                        │              │  des points     │
         │                        │              └─────────────────┘
         │                        ▼
         │              ┌──────────────────┐
         │              │   Confirmation   │
         │◀─────────────│   de paiement    │
                        └──────────────────┘
```

## Gestion des États de Transaction

### États Possibles
1. **PENDING** - Transaction initiée, en attente de paiement
2. **PROCESSING** - Paiement en cours de traitement
3. **COMPLETED** - Paiement réussi, points attribués
4. **FAILED** - Paiement échoué
5. **CANCELLED** - Transaction annulée par l'utilisateur
6. **EXPIRED** - Session de paiement expirée

### Webhooks de Notification
```javascript
// Endpoint de callback
POST /api/payment/callback
{
  "transactionId": "txn_123456",
  "status": "COMPLETED",
  "amount": 500,
  "candidateId": "candidate_id",
  "timestamp": "2025-01-20T10:30:00Z"
}
```

## Sécurité

### Mesures de Protection
- **Chiffrement HTTPS** pour toutes les communications
- **Validation côté serveur** de tous les paramètres
- **Tokens CSRF** pour les formulaires
- **Rate limiting** pour éviter les abus
- **Logs d'audit** pour toutes les transactions

### Données Sensibles
- **Numéros de téléphone**: Hashés en base de données
- **Informations de paiement**: Jamais stockées localement
- **Emails**: Chiffrés avec clé de rotation

## Interface Utilisateur

### Feedback Visuel
```css
/* États du bouton de paiement */
.payment-button {
  /* Normal */
  background: linear-gradient(to right, #ec4899, #8b5cf6, #6366f1);
  
  /* Loading */
  opacity: 0.7;
  cursor: not-allowed;
  
  /* Success */
  background: linear-gradient(to right, #10b981, #059669);
}
```

### Messages d'État
- **Chargement**: "Traitement en cours..."
- **Succès**: "Redirection vers le paiement..."
- **Erreur**: Message d'erreur spécifique
- **Timeout**: "Session expirée, veuillez réessayer"

## Gestion des Erreurs

### Erreurs Communes
| Code | Message | Action |
|------|---------|--------|
| 400 | Données invalides | Vérifier le formulaire |
| 402 | Paiement requis | Réessayer le paiement |
| 404 | Candidat introuvable | Actualiser la page |
| 429 | Trop de tentatives | Attendre avant de réessayer |
| 500 | Erreur serveur | Contacter le support |

### Gestion Côté Client
```javascript
try {
  const result = await votingService.handleVoteSubmission(/*...*/);
  if (result.success) {
    // Redirection automatique
  } else {
    setError(result.error);
  }
} catch (error) {
  setError('Erreur de connexion. Vérifiez votre internet.');
}
```

## Monitoring et Analytics

### Métriques Suivies
- **Taux de conversion** par méthode de paiement
- **Montant moyen** des votes
- **Temps de traitement** des transactions
- **Taux d'échec** par opérateur
- **Répartition géographique** des votes

### Tableaux de Bord
```
┌─────────────────────────────────────┐
│ Statistiques de Paiement - Temps Réel │
├─────────────────────────────────────┤
│ Transactions aujourd'hui: 1,234     │
│ Montant total: 617,000 FCFA         │
│ Taux de succès: 94.2%               │
│ MTN MoMo: 67% | Orange: 33%         │
└─────────────────────────────────────┘
```

## Configuration Technique

### Variables d'Environnement
```env
# API Endpoints
PAYMENT_API_URL=https://api.payment-provider.com
WEBHOOK_SECRET=your_webhook_secret

# Timeouts
PAYMENT_TIMEOUT=900000  # 15 minutes
SESSION_TIMEOUT=1800000 # 30 minutes

# Limits
MIN_AMOUNT=100
MAX_AMOUNT=1000000
RATE_LIMIT_PER_MINUTE=10
```

### Intégration API
```javascript
// Service de paiement
class PaymentService {
  async createPayment(data) {
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(data)
    });
    
    return response.json();
  }
}
```

## Support et Maintenance

### Contact Support
- **Email**: support@missmaster2025.com
- **Téléphone**: +237 6XX XXX XXX
- **Heures**: 8h-20h (GMT+1)

### FAQ Paiement
1. **Q**: Pourquoi mon paiement a échoué ?
   **R**: Vérifiez votre solde et la validité de votre numéro.

2. **Q**: Combien de temps pour voir mes points ?
   **R**: Les points sont ajoutés instantanément après paiement réussi.

3. **Q**: Puis-je annuler un vote ?
   **R**: Non, tous les votes sont définitifs.

4. **Q**: Y a-t-il des frais supplémentaires ?
   **R**: Seuls les frais de l'opérateur mobile s'appliquent.

---

*Dernière mise à jour: 20 Janvier 2025*
*Version: 1.0*