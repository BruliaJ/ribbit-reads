/**
 * The iPhone/iPad and Android apps wrap the same built game as the website (`dist/`).
 * PLACEHOLDER until the company exists: `appId` (store bundle ID, reverse domain of a domain the company owns;
 * it cannot change after the first store upload). Change it here, run `npx cap sync`, then update the iOS bundle
 * identifier and Android applicationId.
 */
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.placeholder.ribbitreads',
  appName: 'Ribbit Reads',
  webDir: 'dist',
  ios: { contentInset: 'never', limitsNavigationsToAppBoundDomains: true },
  android: { allowMixedContent: false },
  server: { androidScheme: 'https' },
};

export default config;
