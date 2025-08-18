# Stripe Integration Setup

## 1. Установка библиотек

Запустите в терминале:
```bash
npm install stripe @stripe/stripe-js
```

## 2. Создание Stripe аккаунта

1. Зарегистрируйтесь на [stripe.com](https://stripe.com)
2. Перейдите в Dashboard
3. Скопируйте API ключи из раздела "Developers" → "API keys"

## 3. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Database
DATABASE_URL="file:./prisma/dev.db"

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
```

## 4. Настройка Stripe Products

В Stripe Dashboard создайте следующие продукты:

### Starter Token Pack
- Name: Starter Token Pack
- Price: $9.99 USD
- Price ID: `price_starter_tokens`

### Popular Token Pack
- Name: Popular Token Pack  
- Price: $19.99 USD
- Price ID: `price_popular_tokens`

### Pro Token Pack
- Name: Pro Token Pack
- Price: $39.99 USD
- Price ID: `price_pro_tokens`

### Enterprise Token Pack
- Name: Enterprise Token Pack
- Price: $79.99 USD
- Price ID: `price_enterprise_tokens`

## 5. Настройка Webhook

1. В Stripe Dashboard перейдите в "Developers" → "Webhooks"
2. Нажмите "Add endpoint"
3. URL: `https://yourdomain.com/api/stripe/webhook`
4. Events: выберите `checkout.session.completed`
5. Скопируйте webhook secret в `.env.local`

## 6. Обновление Price ID в коде

Откройте `lib/stripe.ts` и замените placeholder price ID на реальные:

```typescript
export const STRIPE_PRODUCTS = {
  TOKEN_PACKAGES: {
    STARTER: {
      name: 'Starter Token Pack',
      price: 999,
      tokens: 1000,
      stripePriceId: 'price_1234567890', // Ваш реальный ID
    },
    // ... остальные пакеты
  },
};
```

## 7. Тестирование

1. Запустите приложение: `npm run dev`
2. Войдите в аккаунт
3. Перейдите в Dashboard
4. Нажмите "Buy Now" на любом пакете токенов
5. Должен открыться Stripe Checkout

## 8. Тестовые карты

Используйте тестовые карты Stripe:
- Успешная оплата: `4242 4242 4242 4242`
- Неуспешная оплата: `4000 0000 0000 0002`
- Expiry: любая будущая дата
- CVC: любые 3 цифры

## 9. Проверка работы

После успешной оплаты:
1. Токены должны добавиться к балансу
2. В истории транзакций появится запись "Top-up via Stripe"
3. Webhook должен обработать событие

## 10. Продакшн

Для продакшна:
1. Переключитесь на live режим в Stripe
2. Обновите API ключи в `.env.local`
3. Настройте webhook на продакшн домен
4. Обновите price ID на live версии

## Структура файлов

```
├── lib/stripe.ts                    # Конфигурация Stripe
├── app/api/stripe/
│   ├── create-checkout-session/     # Создание checkout сессии
│   └── webhook/                     # Обработка webhook'ов
├── components/token-purchase.tsx     # UI для покупки токенов
└── app/page.tsx                     # Интеграция в Dashboard
```

## Возможные проблемы

1. **"No signature"** - проверьте `STRIPE_WEBHOOK_SECRET`
2. **"Invalid signature"** - проверьте webhook URL и secret
3. **"Product not found"** - проверьте price ID в `lib/stripe.ts`
4. **Токены не добавляются** - проверьте webhook и логи сервера


