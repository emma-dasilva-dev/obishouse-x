export const Config = {
  PAYMENT_KEY: process.env.NEXT_PUBLIC_KKIAPAY_KEY,
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  IS_SANDBOX: process.env.NEXT_PUBLIC_KKIAPAY_SANDBOX !== 'false',
}