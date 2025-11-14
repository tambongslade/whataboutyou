@# WAYBack Integrated Ticket System Documentation

## Overview

The WAYBack integrated ticket system combines conference registration with ticket purchasing functionality. Tickets use the same **situation-based color system** as conference registrations, providing a unified experience for attendees.

## Ticket System Architecture

### Core Concept
- **Unified System**: Tickets integrate with existing conference registration system
- **Situation Colors**: Same as conference (rouge/bleu/jaune) for consistent branding
- **QR Security**: Each ticket has unique QR code with cryptographic validation
- **Date-Specific**: Tickets only valid for the specific date purchased
- **One-Time Use**: Anti-fraud system prevents ticket reuse

### Integration with Conference System
- Uses **same Firebase collections** and services
- Leverages **existing SoleasPay integration**
- Follows **same validation patterns** as registrations
- Maintains **consistent API structure**

## Ticket System & Pricing

### Unified Ticket Pricing
- **All tickets**: **1,000 FCFA** (regardless of situation)
- **Same access level**: All ticket holders get identical conference access
- **Situation colors**: Used only for visual identification and seating organization

### Situation-Based Organization
```
Rouge (Red):    Red section seating and identification
Bleu (Blue):    Blue section seating and identification  
Jaune (Yellow): Yellow section seating and identification
```

**Note**: The situation (color) system is maintained for administrative organization and visual coordination with conference registrations, but all tickets provide the same access level at the same price.

## API Endpoints

### Base URL: `/api/tickets`

#### Purchase Ticket
```http
POST /api/tickets/purchase
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com", 
  "customerPhone": "674123456",
  "situation": "rouge",              // rouge | bleu | jaune
  "validDate": "2024-12-25",         // YYYY-MM-DD
  "paymentMethod": "MOMO"            // MOMO | OM | MTN | ORANGEMONEY
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentInstructions": "Composez *126# puis suivez les instructions pour envoyer 1000 FCFA",
    "soleasOrderId": "WAY_TICKET_1642857600000_WAY2024-TICKET-001",
    "txRef": "ticket_1642857600000_abc123def",
    "ticketNumber": "WAY2024-TICKET-001"
  }
}
```

#### Confirm Payment
```http
POST /api/tickets/confirm/:txRef
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Paiement du ticket confirmé avec succès",
    "ticket": {
      "ticketNumber": "WAY2024-TICKET-001",
      "customerName": "John Doe",
      "situation": "rouge",
      "validDate": "2024-12-25",
      "qrCodeImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    }
  }
}
```

#### Validate Ticket (Entrance Scanning)
```http
POST /api/tickets/validate
Content-Type: application/json

{
  "qrCode": "{\"ticket\":\"WAY2024-TICKET-001\",\"date\":\"2024-12-25\",\"situation\":\"rouge\",\"email\":\"john@example.com\",\"ts\":1642857600000}",
  "validatedBy": "Admin Name",
  "validationLocation": "Entrance Main"
}
```

**Response (Valid):**
```json
{
  "success": true,
  "data": {
    "message": "Ticket validé avec succès",
    "ticket": {
      "ticketNumber": "WAY2024-TICKET-001",
      "customerName": "John Doe",
      "situation": "rouge",
      "validDate": "2024-12-25"
    },
    "isValid": true
  }
}
```

**Response (Already Used):**
```json
{
  "success": true,
  "data": {
    "message": "Ticket déjà validé le 25/12/2024 10:30:00 par Admin",
    "ticket": {
      "ticketNumber": "WAY2024-TICKET-001",
      "validatedAt": "2024-12-25T10:30:00Z",
      "validatedBy": "Admin"
    },
    "isValid": false
  }
}
```

#### Get Statistics (Admin Only)
```http
GET /api/tickets/statistics
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 250,
    "confirmed": 240,
    "pending": 10,
    "validated": 185,
    "bySituation": {
      "rouge": 80,
      "bleu": 120, 
      "jaune": 50
    },
    "todayValid": 185,
    "todayValidated": 150,
    "totalRevenue": 240000
  }
}
```

## Data Models

### Ticket Entity
```typescript
interface Ticket {
  id?: string;
  ticketNumber: string;           // WAY2024-TICKET-001
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Conference Integration
  situation: 'rouge' | 'bleu' | 'jaune';  // Same as registration system
  price: number;                          // Fixed at 1000 FCFA
  
  // Validation & Security
  purchaseDate: FirebaseTimestamp;
  validDate: string;              // YYYY-MM-DD format
  qrCode: string;                 // JSON string with ticket data
  qrCodeImage: string;            // Base64 QR code image
  secretHash: string;             // Security hash for validation
  
  // Payment Integration
  paymentMethod: 'MOMO' | 'OM' | 'MTN' | 'ORANGEMONEY';
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  soleasPayReference?: string;
  soleasOrderId?: string;
  txRef: string;
  
  // Entrance Validation
  isValidated: boolean;
  validatedAt?: FirebaseTimestamp;
  validatedBy?: string;           // Admin who scanned ticket
  validationLocation?: string;    // Entrance location
  validationCount: number;        // Should be 1 for valid tickets
  
  // Tracking
  ipAddress?: string;
  userAgent?: string;
  createdAt?: FirebaseTimestamp;
  updatedAt?: FirebaseTimestamp;
}
```

### QR Code Structure
```json
{
  "ticket": "WAY2024-TICKET-001",
  "date": "2024-12-25",
  "situation": "rouge",
  "email": "customer@example.com", 
  "ts": 1642857600000
}
```

**Note**: The QR code contains the situation for organizational purposes, but all tickets provide the same access regardless of color.

## Security Features

### QR Code Security
- **Cryptographic Hash**: SHA256 hash prevents tampering
- **Timestamp Validation**: Prevents replay attacks
- **Date Verification**: Only valid for specific date
- **Situation Verification**: Ensures correct access level

### Anti-Fraud Measures
- **One-Time Use**: Tickets marked as validated after scanning
- **Validation Tracking**: Records who, when, where ticket was used
- **IP/UserAgent Logging**: Tracks purchase origin
- **Hash Verification**: Prevents QR code forgery

### Access Control
- **Admin Authentication**: Statistics and ticket lookup require JWT
- **Rate Limiting**: Purchase (3/min), Validation (30/min), Confirm (10/min)
- **Input Validation**: Strong DTO validation with French error messages

## Integration Points

### Conference Registration System
- **Shared Database**: Same Firebase Firestore instance
- **Consistent Numbering**: Sequential ticket numbers like registrations
- **Same Payment Flow**: Identical SoleasPay integration
- **Unified Statistics**: Combined reporting capabilities

### Email System Integration
- **Purchase Confirmation**: Send ticket via email after payment
- **QR Code Delivery**: Include QR image in email
- **Situation-Based Templates**: Use same color coding as registrations

### Mobile App Integration
- **QR Scanner**: Admin app for entrance validation
- **Offline Support**: Cache validated tickets for connectivity issues
- **Real-time Sync**: Instant validation status updates

## Operational Workflows

### Daily Operations

#### Morning Setup
1. **Admin Login**: Access statistics dashboard
2. **Check Sales**: Review overnight ticket purchases
3. **Prepare Scanners**: Distribute devices to entrance staff
4. **Verify Connectivity**: Ensure Firebase/SoleasPay connectivity

#### During Event
1. **Entrance Scanning**: Validate tickets via QR code
2. **Handle Issues**: Deal with invalid/used tickets
3. **Monitor Capacity**: Track validated vs. total tickets
4. **Real-time Updates**: Statistics refresh every 2 minutes

#### End of Day
1. **Final Count**: Total validated tickets
2. **Revenue Report**: Confirmed payments summary
3. **Issue Log**: Document any validation problems
4. **Data Backup**: Export ticket data for records

### Customer Support Workflows

#### Lost Ticket
1. Customer provides email + phone
2. Admin looks up ticket by email: `GET /api/tickets/search?email=customer@example.com`
3. Verify identity and resend QR code
4. Mark original as replaced if needed

#### Payment Issues
1. Customer provides txRef from purchase
2. Admin checks payment status: `GET /api/tickets/confirm/:txRef`
3. If payment confirmed but ticket not activated, manual activation
4. If payment failed, initiate refund process

#### Wrong Date Purchase
1. Customer purchased for wrong date
2. Admin can transfer ticket to correct date (if available)
3. Update validDate and regenerate QR code
4. Send new ticket to customer

## Environment Configuration

### Required Variables
```bash
# Core Application
SOLEASPAY_API_KEY=your_soleaspay_api_key
FRONTEND_URL=https://your-frontend-domain.com

# Firebase Configuration  
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# Email Configuration (for ticket delivery)
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-app-password
# OR
SENDGRID_API_KEY=your-sendgrid-key
```

### Firebase Collections
```
tickets/                    # Main ticket collection
├── WAY2024-TICKET-001     # Document per ticket
├── WAY2024-TICKET-002
└── ...

ticketStats/               # Cached statistics (optional)
├── daily-2024-12-25      # Daily stats cache
└── monthly-2024-12       # Monthly aggregates
```

## Error Handling

### Common Error Scenarios

#### Invalid QR Code
```json
{
  "success": false,
  "error": "Ticket non trouvé"
}
```

#### Already Validated
```json
{
  "success": true,
  "data": {
    "message": "Ticket déjà validé le 25/12/2024 10:30:00 par Admin",
    "isValid": false
  }
}
```

#### Wrong Date
```json
{
  "success": true,
  "data": {
    "message": "Ticket non valide pour aujourd'hui. Valide pour le 2024-12-26",
    "isValid": false
  }
}
```

#### Payment Not Confirmed
```json
{
  "success": true,
  "data": {
    "message": "Ticket non payé ou en attente de confirmation",
    "isValid": false
  }
}
```

## Performance Optimization

### Caching Strategy
- **Statistics**: 2-minute cache for dashboard data
- **QR Validation**: No caching (real-time verification required)
- **Ticket Lookup**: 10-minute cache for admin searches

### Database Optimization
- **Indexed Fields**: ticketNumber, customerEmail, validDate, qrCode
- **Compound Indexes**: (validDate, isValidated), (situation, ticketType)
- **TTL Cleanup**: Remove old pending tickets after 24 hours

### Rate Limiting
```typescript
// Purchase tickets: 3 per minute per IP
@Throttle({ default: { limit: 3, ttl: 60000 } })

// Validate tickets: 30 per minute (for entrance scanners)
@Throttle({ default: { limit: 30, ttl: 60000 } })

// Confirm payments: 10 per minute per IP  
@Throttle({ default: { limit: 10, ttl: 60000 } })
```

## Testing & Quality Assurance

### Test Scenarios

#### Happy Path
1. Purchase ticket → Payment → Confirmation → QR Generation → Entrance Validation ✅
2. Admin statistics → Real-time updates → Revenue tracking ✅

#### Edge Cases
1. **Duplicate Purchase**: Same customer, same date
2. **Invalid Payment**: SoleasPay failure handling
3. **QR Tampering**: Modified QR code detection
4. **Multiple Validation**: Prevent double-entry
5. **Date Edge Cases**: Midnight transitions, timezone handling

#### Load Testing
- **Peak Purchase**: 100 concurrent ticket purchases
- **Entrance Rush**: 50 simultaneous QR validations
- **Database Load**: 1000+ tickets per event day

### Monitoring & Alerts

#### Key Metrics
- **Purchase Success Rate**: Target >95%
- **Payment Confirmation Rate**: Target >98%
- **QR Validation Speed**: Target <2 seconds
- **System Uptime**: Target 99.9%

#### Alert Conditions
- Purchase failures >5% in 10 minutes
- Payment confirmation delays >5 minutes
- QR validation errors >10% in 5 minutes
- Database connection failures

## Future Enhancements

### Phase 2 Features
- **Bulk Purchases**: Corporate/group ticket buying
- **Ticket Transfers**: Customer-to-customer transfers
- **Waitlist System**: Oversold event management
- **Mobile Wallet**: Apple Pay, Google Pay integration

### Phase 3 Features
- **NFC Support**: Near-field communication validation
- **Biometric Validation**: Facial recognition backup
- **Analytics Dashboard**: Advanced reporting for organizers
- **Multi-Event Support**: Single system for multiple conferences

## Support & Maintenance

### Daily Monitoring
- Check purchase success rates
- Monitor payment confirmations
- Review validation logs
- Verify system health

### Weekly Tasks
- Analyze sales trends
- Update pricing if needed
- Review customer feedback
- Optimize database queries

### Monthly Reports
- Revenue analysis by situation/type
- Customer satisfaction metrics
- System performance review
- Security audit results

---

## Quick Start Guide

### For Developers
1. **Install Dependencies**: `npm install qrcode crypto-js`
2. **Set Environment Variables**: Copy API keys to `.env`
3. **Import Module**: Add `TicketsModule` to `AppModule`
4. **Test API**: Use provided Postman collection
5. **Deploy**: Standard NestJS deployment process

### For Administrators
1. **Access Dashboard**: Login with admin credentials
2. **Monitor Sales**: Check `/api/tickets/statistics`
3. **Handle Issues**: Use customer support workflows
4. **Generate Reports**: Export daily/monthly data
5. **Manage Access**: Update admin permissions as needed

### For Event Staff
1. **Download Scanner App**: Mobile QR scanning application
2. **Login**: Use provided entrance staff credentials  
3. **Scan Tickets**: Point camera at QR codes
4. **Handle Responses**: Follow validation result prompts
5. **Report Issues**: Escalate to admin for problem tickets

This integrated system provides a seamless experience from purchase to entrance, maintaining the same high-quality standards as the existing conference registration system.