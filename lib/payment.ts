// Абстрактная система платежей для будущих интеграций
export interface PaymentProvider {
  name: string;
  createPaymentSession(data: PaymentSessionData): Promise<PaymentSessionResult>;
  verifyPayment(sessionId: string): Promise<PaymentVerificationResult>;
}

export interface PaymentSessionData {
  userId: string;
  amount: number;
  currency: string;
  tokens: number;
  packageName: string;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentSessionResult {
  sessionId: string;
  paymentUrl?: string;
  success: boolean;
  error?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  paid: boolean;
  amount?: number;
  tokens?: number;
  error?: string;
}

// Конфигурация токен-пакетов (цены в GBP)
export const TOKEN_PACKAGES = {
  STARTER: {
    name: 'Starter Token Pack',
    priceGBP: 9.00,
    tokens: 1000,
    description: 'Perfect for trying out AI fitness programs',
  },
  POPULAR: {
    name: 'Popular Token Pack',
    priceGBP: 19.00,
    tokens: 2575, // 2500 + 3% bonus
    description: 'Most popular choice for regular users',
  },
  PRO: {
    name: 'Pro Token Pack',
    priceGBP: 49.00,
    tokens: 6600, // 6000 + 10% bonus
    description: 'Great value for fitness enthusiasts',
  },
  ENTERPRISE: {
    name: 'Enterprise Token Pack',
    priceGBP: 79.99,
    tokens: 15000,
    description: 'Maximum value for power users',
  },
} as const;

export type TokenPackageId = keyof typeof TOKEN_PACKAGES;

// Валюты
export const SUPPORTED_CURRENCIES = {
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  USD: { symbol: '$', name: 'US Dollar' },
} as const;

export type Currency = keyof typeof SUPPORTED_CURRENCIES;

// Курс конвертации
const CONVERSION_RATE = 1.15; // 1 GBP = 1.15 EUR

// Утилиты для работы с пакетами
export function getTokenPackage(id: TokenPackageId) {
  return TOKEN_PACKAGES[id];
}

export function getAllTokenPackages() {
  return Object.entries(TOKEN_PACKAGES).map(([id, packageData]) => ({
    id: id as TokenPackageId,
    ...packageData,
  }));
}

// Получить цену пакета в нужной валюте
export function getPackagePrice(id: TokenPackageId, currency: Currency = 'GBP'): number {
  const packageData = TOKEN_PACKAGES[id];
  if (currency === 'GBP') {
    return packageData.priceGBP;
  } else if (currency === 'EUR') {
    return Math.round(packageData.priceGBP * CONVERSION_RATE * 100) / 100;
  }
  return packageData.priceGBP; // fallback to GBP
}

export function formatPrice(price: number, currency: Currency = 'GBP'): string {
  const { symbol } = SUPPORTED_CURRENCIES[currency];
  return `${symbol}${price.toFixed(2)}`;
}
