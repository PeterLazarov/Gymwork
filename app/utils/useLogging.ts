import * as Sentry from '@sentry/react-native'

export const useLogging = () => {
  Sentry.init({
    dsn: 'https://47527b4456a64f3092182f3bed5cb2f9@app.glitchtip.com/8105',
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    _experiments: {
      // profilesSampleRate is relative to tracesSampleRate.
      // Here, we'll capture profiles for 100% of transactions.
      profilesSampleRate: 1.0,
    },
  })
}
