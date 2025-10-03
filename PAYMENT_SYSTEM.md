# 💳 Payment System Integration Guide

## 🎯 Overview

AIFitWorld теперь использует гибкую абстрактную систему платежей, которая позволяет легко интегрировать любую платежную систему в будущем.

## 🏗️ Architecture

### Core Components

1. **`lib/payment.ts`** - Основные типы и конфигурация
2. **`lib/payment-providers.ts`** - Примеры интеграций
3. **`app/api/tokens/topup/route.ts`** - API для пополнения токенов
4. **`components/token-purchase.tsx`** - UI компонент

### Token Packages

```typescript
export const TOKEN_PACKAGES = {
  STARTER: { name: 'Starter Token Pack', price: 9.99, tokens: 1000 },
  POPULAR: { name: 'Popular Token Pack', price: 19.99, tokens: 2500 },
  PRO: { name: 'Pro Token Pack', price: 39.99, tokens: 6000 },
  ENTERPRISE: { name: 'Enterprise Token Pack', price: 79.99, tokens: 15000 },
};
```

## 🔧 Current Implementation

### Simplified Token Topup

Сейчас система работает в упрощенном режиме:
- Пользователь выбирает пакет токенов
- Токены добавляются мгновенно
- Подходит для тестирования и демо

### API Endpoints

#### `POST /api/tokens/topup`
```typescript
// Request
{
  "packageId": "STARTER" | "POPULAR" | "PRO" | "ENTERPRISE",
  "currency": "EUR" | "GBP" | "USD"
}

// Response
{
  "success": true,
  "transactionId": "cuid",
  "tokensAdded": 1000,
  "newBalance": 2500,
  "package": { ... }
}
```

#### `GET /api/tokens/topup`
```typescript
// Response
{
  "packages": [...],
  "currencies": ["EUR", "GBP", "USD"]
}
```

## 🚀 Adding Payment Provider

### Step 1: Implement PaymentProvider Interface

```typescript
export class YourPaymentProvider implements PaymentProvider {
  name = 'your-provider';

  async createPaymentSession(data: PaymentSessionData): Promise<PaymentSessionResult> {
    // Your payment integration logic
  }

  async verifyPayment(sessionId: string): Promise<PaymentVerificationResult> {
    // Your verification logic
  }
}
```

### Step 2: Add to Factory

```typescript
// In lib/payment-providers.ts
export class PaymentProviderFactory {
  static create(providerName: string): PaymentProvider | null {
    switch (providerName.toLowerCase()) {
      case 'your-provider':
        return new YourPaymentProvider();
      // ... other providers
    }
  }
}
```

### Step 3: Update API Route

```typescript
// In app/api/tokens/topup/route.ts
const paymentService = new PaymentService(process.env.PAYMENT_PROVIDER || 'your-provider');
const result = await paymentService.createPaymentSession(paymentData);
```

### Step 4: Environment Variables

```bash
# .env.local
PAYMENT_PROVIDER=your-provider
PAYMENT_SECRET_KEY=your_secret_key
PAYMENT_PUBLISHABLE_KEY=your_publishable_key
PAYMENT_WEBHOOK_SECRET=your_webhook_secret
```

## 📋 Supported Providers (Examples)

### PayPal
- ✅ Express Checkout
- ✅ PayPal SDK
- ✅ Webhook support
- ✅ Multiple currencies

### Razorpay
- ✅ Indian payment gateway
- ✅ Multiple payment methods
- ✅ Webhook support

### Custom Provider
- ✅ Any payment system
- ✅ Custom API integration
- ✅ Flexible implementation

## 🔄 Migration from Previous System

### What Was Removed
- ❌ Old payment system files
- ❌ Hardcoded payment dependencies
- ❌ Legacy payment environment variables

### What Was Added
- ✅ `lib/payment.ts` - Abstract payment system
- ✅ `lib/payment-providers.ts` - Provider examples
- ✅ Simplified token topup API
- ✅ Flexible provider architecture

## 🧪 Testing

### Manual Testing
1. Start the development server: `npm run dev`
2. Navigate to the pricing page
3. Select a token package
4. Verify tokens are added to balance
5. Check transaction history

### API Testing
```bash
# Test token topup
curl -X POST http://localhost:3000/api/tokens/topup \
  -H "Content-Type: application/json" \
  -d '{"packageId": "STARTER", "currency": "EUR"}'

# Test package listing
curl http://localhost:3000/api/tokens/topup
```

## 🎨 UI Components

### TokenPurchase Component
- Responsive design
- Multiple currency support
- Loading states
- Error handling
- Success notifications

### Features
- Package selection
- Currency switching
- Real-time balance updates
- Toast notifications

## 🔮 Future Enhancements

### Planned Features
- [ ] Multiple payment providers
- [ ] Subscription support
- [ ] Payment analytics
- [ ] Refund handling
- [ ] Payment history
- [ ] Invoice generation

### Integration Ideas
- [ ] Apple Pay / Google Pay
- [ ] Cryptocurrency payments
- [ ] Bank transfers
- [ ] Mobile payments
- [ ] Regional payment methods

## 📚 Documentation

### Related Files
- `lib/payment.ts` - Core types and configuration
- `lib/payment-providers.ts` - Provider implementations
- `app/api/tokens/topup/route.ts` - API implementation
- `components/token-purchase.tsx` - UI component

### External Resources
- [PayPal Developer](https://developer.paypal.com/)
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Payment Gateway Comparison](https://example.com/payment-comparison)

---

**💡 The payment system is now flexible and ready for any integration!**
