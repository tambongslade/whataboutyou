# 🔄 Automatic Payment Verification Job

This document outlines the automatic payment verification job that ensures all payments for votes and tickets are properly confirmed, even when webhooks fail or are delayed.

## 📋 Overview

The **PaymentVerificationService** is a scheduled job that automatically:
- Verifies pending payments with SoleasPay every 5 minutes
- Confirms successful payments and updates records
- Marks failed payments appropriately
- Provides backup verification when webhooks fail

## ⏰ Job Schedule

```typescript
@Cron(CronExpression.EVERY_5_MINUTES)
async verifyPendingPayments()
```

**Frequency**: Every 5 minutes
**Next Run**: Check logs for `🔄 Starting automatic payment verification job...`

## 🎯 What the Job Does

### **1. Vote Payment Verification**
- Finds pending votes older than 2 minutes
- Verifies each payment with SoleasPay API
- Updates vote status to `confirmed` or `failed`
- Automatically adds points to candidates
- Updates candidate rankings

### **2. Ticket Payment Verification**
- Finds pending tickets older than 2 minutes
- Verifies each payment with SoleasPay API
- Updates ticket status to `confirmed` or `failed`
- Automatically sends QR codes via email

### **3. Rate Limiting Protection**
- Processes maximum 20 votes + 20 tickets per run
- 1-second delay between SoleasPay API calls
- Prevents overwhelming the payment gateway

## 📊 API Endpoints

### Manual Trigger (Admin Only)
```http
POST /api/payment-verification/manual-run
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Verification completed: 15 processed, 12 confirmed",
    "votes": { "processed": 8, "confirmed": 6, "failed": 2 },
    "tickets": { "processed": 7, "confirmed": 6, "failed": 1 }
  }
}
```

### Verification Statistics
```http
GET /api/payment-verification/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pendingVotes": 5,
    "pendingTickets": 3,
    "oldestPendingVote": "2025-01-19T10:30:00Z",
    "oldestPendingTicket": "2025-01-19T11:15:00Z"
  }
}
```

## 🔍 Job Logic Flow

### **Processing Criteria**
```typescript
// Only processes payments that are:
{
  paymentStatus: 'pending',
  createdAt: { $lt: cutoffTime }, // Older than 2 minutes
  soleasOrderId: { $exists: true },
  soleasPayReference: { $exists: true },
}
```

### **Verification Flow**
1. **Find Pending Payments** → Query database for eligible records
2. **SoleasPay Verification** → Call verification API for each payment
3. **Update Records** → Mark as confirmed/failed based on response
4. **Trigger Actions** → Add points, send emails, update rankings
5. **Log Results** → Comprehensive logging for monitoring

## 📈 Monitoring & Logging

### **Successful Processing**
```
✅ Vote payment auto-confirmed: vote_1642857600000_abc123def - 10 points added
✅ Ticket payment auto-confirmed: ticket_1642857600000_def456ghi
📧 QR code auto-sent to customer@example.com
📊 Updated candidate candidate123 points: +10 (total: 150)
🏆 Updated rankings for miss category
```

### **Error Handling**
```
❌ Vote payment failed: vote_1642857600000_xyz789abc
❌ Error verifying vote vote_1642857600000_xyz789abc: Connection timeout
❌ Failed to send QR code email for WAY2024-TICKET-001: SMTP error
```

### **Job Summary**
```
✅ Payment verification completed: 15 processed, 12 confirmed, 3 failed
```

## ⚙️ Configuration

### **Database Queries**
- **Batch Size**: 20 votes + 20 tickets per run
- **Age Threshold**: 2 minutes minimum age
- **Required Fields**: `soleasOrderId` and `soleasPayReference`

### **Rate Limiting**
- **API Delay**: 1 second between SoleasPay calls
- **Manual Runs**: 2 per minute (admin only)
- **Stats Checks**: 10 per minute

### **Error Handling**
- **Retry Logic**: No automatic retries (relies on next scheduled run)
- **Failed Payments**: Marked as `failed` status
- **Missing Data**: Skipped and logged as errors

## 🛡️ Security Features

### **Admin Protection**
- Manual trigger requires JWT authentication
- Only authorized admins can force verification runs

### **Rate Protection**
- Built-in throttling prevents API abuse
- Batch processing limits prevent overwhelming SoleasPay

### **Data Integrity**
- Atomic updates ensure consistent state
- Duplicate processing prevention with status checks

## 🚨 Monitoring Alerts

### **Set Up Alerts For:**
1. **High Failure Rate** → More than 50% payment verification failures
2. **Old Pending Payments** → Payments pending for over 1 hour
3. **Job Errors** → Repeated job execution failures
4. **API Rate Limits** → SoleasPay API errors

### **Health Check Queries**
```sql
-- Count pending payments older than 30 minutes
db.votes.countDocuments({
  paymentStatus: 'pending',
  createdAt: { $lt: new Date(Date.now() - 30 * 60 * 1000) }
})

-- Check recent job activity
grep "Payment verification completed" /var/log/app.log | tail -5
```

## 📋 Troubleshooting

### **Common Issues**

1. **Payments Stuck as Pending**
   - Check SoleasPay API connectivity
   - Verify payment references are correct
   - Run manual verification for specific payments

2. **Job Not Running**
   - Verify ScheduleModule is imported in AppModule
   - Check server timezone configuration
   - Look for cron job error logs

3. **High Failure Rate**
   - Check SoleasPay service status
   - Verify API credentials and endpoints
   - Review network connectivity

### **Manual Recovery**
```bash
# Trigger manual verification
curl -X POST https://whataboutyou.net/api/payment-verification/manual-run \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Check current stats
curl https://whataboutyou.net/api/payment-verification/stats
```

## ✅ Benefits

- **🔒 Reliability**: Ensures no payments are lost due to webhook failures
- **⚡ Automatic**: No manual intervention required for normal operation
- **📊 Transparency**: Complete logging and statistics available
- **🛡️ Safe**: Rate-limited and error-resistant design
- **🔧 Manageable**: Manual triggers available for emergencies

This job provides a robust safety net ensuring payment confirmation reliability across your entire voting and ticketing system! 