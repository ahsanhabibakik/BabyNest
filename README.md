# BabyNest 🍼

A modern, production-ready React Native app for Baby & Mother Care (from birth to ~5 years) with AI-powered insights and comprehensive tracking features.

## Features

### 🍼 Baby Care Tracking
- **Feeding**: Track breast, bottle, and solid food feeding with detailed logs
- **Sleep**: Monitor sleep patterns, duration, and quality
- **Diapers**: Record diaper changes with type and consistency tracking  
- **Growth**: Log weight, height, and head circumference measurements
- **Milestones**: Celebrate and record important developmental achievements
- **Vaccinations**: Keep track of immunization schedule and history

### 👩‍🍼 Mother Care
- **Postpartum Recovery**: Monitor recovery progress and symptoms
- **Breastfeeding Sessions**: Log duration and notes
- **Mood Tracking**: Track mental health and daily mood
- **Weight Monitoring**: Track weight changes
- **Menstrual Cycle**: Monitor cycle patterns (Pro feature)

### 🤖 AI-Powered Insights
- **Feeding Schedules**: AI-generated feeding recommendations
- **Sleep Pattern Analysis**: Understand sleep cycles and improvements
- **Growth Analysis**: Track development against WHO standards
- **Milestone Predictions**: Anticipate upcoming developmental milestones
- **Symptom Checker**: Educational information (not medical advice)

### 📚 Knowledge Hub
- **Expert Articles**: Curated content on baby and mother care
- **Age-Specific Guides**: Content tailored to your baby's age
- **Premium Content**: In-depth guides and exclusive articles
- **Search & Filter**: Find relevant information quickly

### 💎 Premium Features
- **Unlimited Baby Profiles**: Track multiple children
- **Advanced AI Insights**: 100 AI credits monthly
- **Growth Charts**: WHO standard percentile charts
- **Data Export**: Download your tracking data
- **Premium Articles**: Access to expert content
- **Priority Support**: Get help when you need it

## Tech Stack

### Core Framework
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe development

### Navigation & UI
- **React Navigation**: Stack and tab navigation
- **NativeWind**: Tailwind CSS for React Native
- **React Native Reanimated**: Smooth animations
- **Moti**: Animation library for gestures

### State Management
- **Zustand**: Lightweight state management
- **React Query**: Server state management
- **MMKV**: Fast key-value storage
- **AsyncStorage**: Persistent storage

### Backend Services
- **Firebase Auth**: Authentication with Google Sign-In
- **RevenueCat**: Subscription management
- **Expo Notifications**: Push notifications

### AI Integration
- **Provider Abstraction**: Support for OpenAI, Claude, etc.
- **Credit System**: Usage-based AI feature access

## Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/BabyNest.git
   cd BabyNest
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start the development server**
   ```bash
   pnpm start
   # or
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   pnpm ios
   # Android  
   pnpm android
   ```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdefghijk

# RevenueCat
REVENUECAT_API_KEY=your_revenuecat_api_key

# AI Services
OPENAI_API_KEY=your_openai_api_key
CLAUDE_API_KEY=your_claude_api_key

# Analytics
MIXPANEL_TOKEN=your_mixpanel_token

# Expo
EAS_PROJECT_ID=your_eas_project_id
EXPO_USERNAME=your_expo_username
```

## Building for Production

### Prerequisites
- EAS CLI: `npm install -g @expo/eas-cli`
- Expo account
- Apple Developer account (iOS)
- Google Play Developer account (Android)

### Build Commands

```bash
# Build for both platforms
eas build --platform all

# Build for specific platform
eas build --platform ios
eas build --platform android

# Preview build (internal distribution)
eas build --profile preview

# Production build
eas build --profile production
```

### Submit to App Stores

```bash
# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components
│   └── forms/          # Form components
├── constants/          # App constants and configurations
├── hooks/              # Custom React hooks
├── navigation/         # Navigation configuration
├── screens/           # Screen components
│   ├── auth/          # Authentication screens
│   ├── baby/          # Baby management screens
│   ├── home/          # Home dashboard
│   ├── knowledge/     # Article and content screens
│   ├── mothercare/    # Mother care screens
│   ├── profile/       # User profile screens
│   ├── settings/      # App settings
│   └── tracking/      # Activity tracking screens
├── services/          # External service integrations
│   ├── auth/          # Authentication services
│   ├── notifications/ # Push notification services
│   └── purchases/     # In-app purchase services
├── store/             # State management
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run linting
pnpm lint

# Run type checking
pnpm type-check
```

## Deployment

The app uses GitHub Actions for CI/CD:

- **Pull Requests**: Run tests and linting
- **Main Branch**: Build preview versions
- **Tags**: Build and submit production versions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@babynest.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/BabyNest/issues)
- 📖 Documentation: [docs.babynest.com](https://docs.babynest.com)

## Roadmap

- [ ] Web app (PWA)
- [ ] Apple HealthKit integration
- [ ] Google Fit integration
- [ ] Family sharing features
- [ ] Pediatrician portal
- [ ] Offline-first architecture improvements
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode improvements

---

Built with ❤️ for parents everywhere 👶