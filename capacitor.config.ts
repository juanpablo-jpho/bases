import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'bases',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    iosScheme: "ionic",
  }
};

export default config;
