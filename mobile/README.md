# KavreNews Mobile App

A React Native mobile app for the KavreNews news portal, built with Expo.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo Go app on your phone (for testing)
- EAS CLI for building APK

## Installation

```bash
cd mobile
npm install
```

## Development

### Run on Android Emulator/Device
```bash
npm run android
```

### Run with Expo Go
```bash
npm start
# Then scan the QR code with Expo Go app
```

## Building APK

### First Time Setup
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account (create free account at expo.dev)
eas login

# Configure the project
eas build:configure
```

### Build APK
```bash
# Build APK for testing (preview profile)
eas build --platform android --profile preview

# This will generate a downloadable APK file
```

### Build Production App Bundle
```bash
# For Google Play Store submission
eas build --platform android --profile production
```

## Configuration

### API URL
Update the API URL in `constants/Config.ts`:

```typescript
export const API_CONFIG = {
  baseUrl: 'https://your-api-url.com/api',
  timeout: 10000,
};
```

For local development:
- Android Emulator: `http://10.0.2.2:5000/api`
- Physical Device: Use your computer's local IP (e.g., `http://192.168.1.100:5000/api`)

## Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigator screens
│   │   ├── index.tsx      # Home screen
│   │   ├── categories.tsx # Categories screen
│   │   └── search.tsx     # Search screen
│   ├── news/
│   │   └── [slug].tsx     # News detail screen
│   └── category/
│       └── [slug].tsx     # Category news list
├── components/            # Reusable components
├── constants/             # Colors, config
├── services/              # API services
└── types/                 # TypeScript types
```

## Features

- 📰 Breaking news ticker
- 🎠 Featured news carousel
- 📊 Trending news section
- 🏷️ Category-based browsing
- 🔍 News search
- 📖 Full article view with related news
- 🌙 Dark mode support
- 📱 Pull-to-refresh
- ♾️ Infinite scroll for listings
