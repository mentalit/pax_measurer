import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pax.measurer',
  appName: 'PaxMeasurer',
  webDir: 'www',

  server: {
    url: 'https://quiet-hamlet-62537.herokuapp.com',
    cleartext: true
  }
};

export default config;