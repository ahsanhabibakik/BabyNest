export default ({ config }) => {
  return {
    ...config,
    name: 'BabyNest',
    slug: 'babynest',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.babynest.app',
      buildNumber: '1',
      infoPlist: {
        UIBackgroundModes: ['background-processing', 'background-fetch'],
        NSCameraUsageDescription: 'BabyNest needs camera access to take photos of your baby\'s milestones and growth tracking.',
        NSPhotoLibraryUsageDescription: 'BabyNest needs photo library access to save and select baby photos.',
        NSMicrophoneUsageDescription: 'BabyNest needs microphone access to record baby sounds and notes.',
        NSHealthShareUsageDescription: 'BabyNest would like to access HealthKit to read health and fitness data.',
        NSHealthUpdateUsageDescription: 'BabyNest would like to access HealthKit to write health and fitness data.'
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.babynest.app',
      versionCode: 1,
      permissions: [
        'android.permission.CAMERA',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.RECORD_AUDIO',
        'android.permission.RECEIVE_BOOT_COMPLETED',
        'android.permission.VIBRATE',
        'android.permission.USE_BIOMETRIC',
        'android.permission.USE_FINGERPRINT'
      ]
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro'
    },
    plugins: [
      'expo-router',
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#ffffff',
          defaultChannel: 'default'
        }
      ],
      [
        'expo-camera',
        {
          cameraPermission: 'Allow BabyNest to access your camera to capture baby milestones.'
        }
      ],
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos to let you share baby memories.'
        }
      ],
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/Inter-Regular.ttf',
            './assets/fonts/Inter-Medium.ttf',
            './assets/fonts/Inter-SemiBold.ttf',
            './assets/fonts/Inter-Bold.ttf',
            './assets/fonts/Poppins-Regular.ttf',
            './assets/fonts/Poppins-Medium.ttf',
            './assets/fonts/Poppins-SemiBold.ttf',
            './assets/fonts/Poppins-Bold.ttf'
          ]
        }
      ]
    ],
    extra: {
      eas: {
        projectId: process.env.EAS_PROJECT_ID || 'your-project-id-here'
      },
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
      },
      revenueCat: {
        apiKey: process.env.REVENUECAT_API_KEY
      }
    },
    owner: process.env.EXPO_USERNAME || 'your-expo-username'
  };
};