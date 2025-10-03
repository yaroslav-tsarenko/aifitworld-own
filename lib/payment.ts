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

// Конфигурация токен-пакетов
export const TOKEN_PACKAGES = {
  STARTER: {
    name: 'Starter Token Pack',
    price: 9.99,
    tokens: 1000,
    description: 'Perfect for trying out AI fitness programs',
  },
  POPULAR: {
    name: 'Popular Token Pack',
    price: 19.99,
    tokens: 2500,
    description: 'Most popular choice for regular users',
  },
  PRO: {
    name: 'Pro Token Pack',
    price: 39.99,
    tokens: 6000,
    description: 'Great value for fitness enthusiasts',
  },
  ENTERPRISE: {
    name: 'Enterprise Token Pack',
    price: 79.99,
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

export function formatPrice(price: number, currency: Currency = 'EUR'): string {
  const { symbol } = SUPPORTED_CURRENCIES[currency];
  return `${symbol}${price.toFixed(2)}`;
}
