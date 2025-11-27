# 🚗 Vehicle Maintenance App

## About the Project

Native mobile application for vehicle maintenance management and tracking, with intelligent notification system and full support for Portuguese (Portugal) and English.

**Platform**: Native iOS & Android app, exportable to web
**Framework**: Expo Router + React Native

## ✨ Key Features

### 🚘 Vehicle Management
- Add and edit vehicles with photo
- Track current mileage
- Detailed information (make, model, year, license plate)
- Modern visual interface with gradients and professional design

### 🔧 Maintenance System
- **Maintenance Tasks**: Schedule future maintenance
  - By date (e.g., annual service)
  - By mileage (e.g., oil change every 10,000 km)
  - Recurring or one-time task options
- **Complete History**: Detailed record of all completed maintenance
- **Predefined Types**: Oil change, service, tires, brakes, filters, battery, and more
- **Full Details**: Cost, location, notes, and date/mileage

### 🔔 Smart Notifications
- **Multiple Date-Based Reminders**:
  - 7 days before (initial reminder)
  - 3 days before (proximity warning)
  - 1 day before (urgent alert)
  - On maintenance day
  - Daily reminders if overdue
- **Mileage-Based Intervals**:
  - 1000 km before (early reminder)
  - 500 km before (important warning)
  - 200 km before (urgent)
  - Alerts if exceeded
- **Convenient Schedule**: All notifications at 9 AM
- **100% Local**: No internet required, total privacy

### 🌍 Internationalization
- Full support for **Portuguese (Portugal)** and **English**
- Instant language switching
- Fully translated interface

### 🎨 Themes
- **Light Mode**: Bright and modern interface
- **Dark Mode**: Perfect for nighttime use
- **System**: Automatically follows device preferences
- Optimized colors for both modes

### 📱 Responsive Interface
- 100% responsive design for all screen sizes
- Adaptive keyboard behavior
- Smooth animations and transitions
- Modern cards with shadows and gradients

## How can I edit this code?

There are several ways of editing your native mobile application.

### **Use Rork**

Simply visit [rork.com](https://rork.com) and prompt to build your app with AI.

Changes made via Rork will be committed automatically to this GitHub repo.

Whenever you make a change in your local code editor and push it to GitHub, it will be also reflected in Rork.

### **Use your preferred code editor**

If you want to work locally using your own code editor, you can clone this repo and push changes. Pushed changes will also be reflected in Rork.

If you are new to coding and unsure which editor to use, we recommend Cursor. If you're familiar with terminals, try Claude Code.

The only requirement is having Node.js & Bun installed - [install Node.js with nvm](https://github.com/nvm-sh/nvm) and [install Bun](https://bun.sh/docs/installation)

Follow these steps:

```bash
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
bun i

# Step 4: Start the instant web preview of your Rork app in your browser, with auto-reloading of your changes
bun run start-web

# Step 5: Start iOS preview
# Option A (recommended):
bun run start  # then press "i" in the terminal to open iOS Simulator
# Option B (if supported by your environment):
bun run start -- --ios
```

### **Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza as melhores tecnologias nativas cross-platform:

### Core
- **React Native** - Framework de desenvolvimento móvel nativo criado pela Meta
- **Expo** - Plataforma estendida do React Native
- **Expo Router** - Sistema de rotas baseado em ficheiros
- **TypeScript** - JavaScript com tipagem estática

### UI & Design
- **Lucide React Native** - Ícones modernos e bonitos
- **expo-linear-gradient** - Gradientes suaves para UI premium
- **react-native-safe-area-context** - Gestão de áreas seguras do ecrã

### Estado & Dados
- **React Context API** - Gestão de estado global
- **@nkzw/create-context-hook** - Hooks de contexto otimizados
- **AsyncStorage** - Persistência local de dados
- **React Query** - Gestão de estado do servidor

### Funcionalidades Nativas
- **expo-notifications** - Sistema de notificações locais inteligentes
- **expo-image-picker** - Seleção e captura de fotos
- **i18next** - Internacionalização completa (PT/EN)
- **date-fns** - Manipulação de datas

### Navegação
- **Expo Router** - Navegação baseada em ficheiros
- **react-native-gesture-handler** - Gestos nativos otimizados

## How can I test my app?

### **On your phone (Recommended)**

1. **iOS**: Download the [Rork app from the App Store](https://apps.apple.com/app/rork) or [Expo Go](https://apps.apple.com/app/expo-go/id982107779)
2. **Android**: Download the [Expo Go app from Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
3. Run `bun run start` and scan the QR code from your development server

### **In your browser**

Run `bun start-web` to test in a web browser. Note: The browser preview is great for quick testing, but some native features may not be available.

### **iOS Simulator / Android Emulator**

You can test Rork apps in Expo Go or Rork iOS app. You don't need XCode or Android Studio for most features.

**When do you need Custom Development Builds?**

- Native authentication (Face ID, Touch ID, Apple Sign In)
- In-app purchases and subscriptions
- Push notifications
- Custom native modules

Learn more: [Expo Custom Development Builds Guide](https://docs.expo.dev/develop/development-builds/introduction/)

If you have XCode (iOS) or Android Studio installed:

```bash
# iOS Simulator
bun run start -- --ios

# Android Emulator
bun run start -- --android
```

## How can I deploy this project?

### **Publish to App Store (iOS)**

1. **Install EAS CLI**:

   ```bash
   bun i -g @expo/eas-cli
   ```

2. **Configure your project**:

   ```bash
   eas build:configure
   ```

3. **Build for iOS**:

   ```bash
   eas build --platform ios
   ```

4. **Submit to App Store**:
   ```bash
   eas submit --platform ios
   ```

For detailed instructions, visit [Expo's App Store deployment guide](https://docs.expo.dev/submit/ios/).

### **Publish to Google Play (Android)**

1. **Build for Android**:

   ```bash
   eas build --platform android
   ```

2. **Submit to Google Play**:
   ```bash
   eas submit --platform android
   ```

For detailed instructions, visit [Expo's Google Play deployment guide](https://docs.expo.dev/submit/android/).

### **Publish as a Website**

Your React Native app can also run on the web:

1. **Build for web**:

   ```bash
   eas build --platform web
   ```

2. **Deploy with EAS Hosting**:
   ```bash
   eas hosting:configure
   eas hosting:deploy
   ```

Alternative web deployment options:

- **Vercel**: Deploy directly from your GitHub repository
- **Netlify**: Connect your GitHub repo to Netlify for automatic deployments

## 📂 App Structure

### Contexts (State Management)
- **VehicleContext** - Vehicle, task, and record management
- **NotificationContext** - Smart notification system
- **ThemeContext** - Themes (light/dark/system)
- **LocalizationContext** - Internationalization (PT/EN)

### Main Screens
- **Home** - Vehicle list with upcoming maintenance alerts
- **Maintenance** - View of all scheduled maintenance
- **Settings** - Theme, language, and notification settings
- **Vehicle Details** - Complete vehicle details with tasks and history
- **Add/Edit Vehicle** - Vehicle management form
- **Add Task** - Schedule new maintenance
- **Add Record** - Log completed maintenance
- **Record Details** - View historical maintenance details

### Technical Features
- **Cross-platform** - iOS, Android, and Web
- **File-based routing** - Automatic navigation via file structure
- **Tab navigation** - Customizable tab navigation
- **Modal screens** - Modal screens for forms
- **TypeScript** - Complete typing for better DX
- **Local persistence** - All data stored locally
- **Smart notifications** - Notifications at multiple intervals
- **Responsive design** - Adaptive interface for all screens

## 📁 Project Structure

```
├── app/                           # App screens (Expo Router)
│   ├── (tabs)/                   # Tab navigation
│   │   ├── _layout.tsx          # Tab configuration
│   │   ├── index.tsx            # Home - Vehicle list
│   │   ├── maintenance.tsx      # Scheduled maintenance
│   │   └── settings.tsx         # Settings
│   ├── vehicle/                 # Vehicle details
│   │   └── [id].tsx            # Dynamic vehicle page
│   ├── record/                  # Record details
│   │   └── [id].tsx            # Dynamic record page
│   ├── _layout.tsx             # Root layout
│   ├── add-vehicle.tsx         # Add vehicle
│   ├── edit-vehicle.tsx        # Edit vehicle
│   ├── add-task.tsx            # Add task
│   ├── add-record.tsx          # Add record
│   └── +not-found.tsx          # 404 page
├── contexts/                    # React contexts
│   ├── VehicleContext.tsx      # Vehicle and maintenance management
│   ├── NotificationContext.tsx # Notification system
│   ├── ThemeContext.tsx        # Theme management
│   └── LocalizationContext.tsx # Internationalization
├── hooks/                       # Custom hooks
│   └── useMaintenanceNotifications.ts  # Notification sync
├── types/                       # TypeScript types
│   └── vehicle.ts              # Vehicle interfaces and types
├── locales/                     # Translations
│   ├── en.json                 # English
│   └── pt-PT.json              # Portuguese (Portugal)
├── constants/                   # Constants
│   └── colors.ts               # Color palette
├── assets/                      # Static assets
│   ├── images/                 # Icons and images
│   └── sounds/                 # Notification sounds
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
└── NOTIFICATIONS_INFO.md        # Notifications documentation
```

## 🚀 Getting Started

### Installation

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Navigate to project directory
cd vehicle-maintenance-app

# 3. Install dependencies
npm install --legacy-peer-deps
# or
bun install

# 4. Start the development server
npm start
# or
bun start
```

### Test on Mobile Device

1. **iOS**: Download [Expo Go](https://apps.apple.com/app/expo-go/id982107779) from App Store
2. **Android**: Download [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Google Play
3. Run `npm start` and scan the QR code

### Test in Browser

```bash
npm run start-web
# or
bun run start-web
```

**Note**: Some native features (notifications, photo picker) may have limitations in the browser.

## 📋 Implemented Features

### ✅ Vehicle System
- [x] Add vehicles with photo
- [x] Edit vehicle information
- [x] View complete details
- [x] Update mileage
- [x] Delete vehicles

### ✅ Maintenance System
- [x] Create tasks by date
- [x] Create tasks by mileage
- [x] Recurring vs one-time tasks
- [x] 11 predefined maintenance types
- [x] Log completed maintenance
- [x] Complete history with details
- [x] Automatic calculation of next maintenance (recurring)

### ✅ Smart Notifications
- [x] Date-based notifications (7d, 3d, 1d, today)
- [x] Mileage-based notifications (1000km, 500km, 200km)
- [x] Convenient schedule (9 AM)
- [x] Overdue maintenance alerts
- [x] Automatic synchronization
- [x] Enable/disable in settings

### ✅ Internationalization
- [x] Portuguese (Portugal)
- [x] English
- [x] Instant language switching
- [x] All strings translated

### ✅ Themes
- [x] Light mode
- [x] Dark mode
- [x] System mode (automatic)
- [x] Preference persistence

### ✅ UI/UX
- [x] Responsive design
- [x] Modern gradients and shadows
- [x] Smooth animations
- [x] Smart keyboard handling
- [x] Professional cards
- [x] Consistent icons

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#007AFF / #0A84FF)
- **Success**: Green (#34C759 / #32D74B)
- **Warning**: Orange (#FF9500 / #FF9F0A)
- **Error**: Red (#FF3B30 / #FF453A)

### Components
- Cards with shadows and rounded corners
- Floating action buttons
- Modal forms
- Custom tabs
- Linear gradients

## Custom Development Builds

This app **already includes features that require Custom Development Build**:

### **Implemented Native Features**

- ✅ **Local Push Notifications** - Complete notification system
- ✅ **Image Picker** - Photo selection from gallery and camera
- ✅ **Local Storage** - Full data persistence

### **When to create a Custom Build?**

To properly test **notifications** and **photo selection**, it's recommended to create a Custom Development Build:

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure project
eas build:configure

# Create development build
eas build --profile development --platform ios
eas build --profile development --platform android

# Start with development client
npm start --dev-client
```

## 📚 Additional Documentation

- **[NOTIFICATIONS_INFO.md](./NOTIFICATIONS_INFO.md)** - Complete guide to the notification system
- **[Expo Documentation](https://docs.expo.dev/)** - Official Expo documentation
- **[React Native Docs](https://reactnative.dev/)** - React Native documentation

## 🔧 Available Scripts

```bash
# Start development server
npm start

# Start on iOS Simulator
npm run ios

# Start on Android Emulator
npm run android

# Start web preview
npm run web

# Clear cache
npx expo start --clear

# Build for production
npm run build
```

## 💾 Data Management

All data is stored **locally** on the device using `@react-native-async-storage/async-storage`:

- ✅ **Total Privacy**: No data leaves the device
- ✅ **Offline First**: Works without internet
- ✅ **Persistence**: Data persists after closing the app
- ✅ **Performance**: Fast data access

### Stored Data
- Vehicle information (with photos in base64)
- Scheduled maintenance tasks
- Complete maintenance history
- Preferences (theme, language, notifications)

## Advanced Features

### **Add a Database**

Integrate with backend services:

- **Supabase** - PostgreSQL database with real-time features
- **Firebase** - Google's mobile development platform
- **Custom API** - Connect to your own backend

### **Add Authentication**

Implement user authentication:

**Basic Authentication (works in Expo Go):**

- **Expo AuthSession** - OAuth providers (Google, Facebook, Apple) - [Guide](https://docs.expo.dev/guides/authentication/)
- **Supabase Auth** - Email/password and social login - [Integration Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- **Firebase Auth** - Comprehensive authentication solution - [Setup Guide](https://docs.expo.dev/guides/using-firebase/)

**Native Authentication (requires Custom Development Build):**

- **Apple Sign In** - Native Apple authentication - [Implementation Guide](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- **Google Sign In** - Native Google authentication - [Setup Guide](https://docs.expo.dev/guides/google-authentication/)

### **Add Push Notifications**

Send notifications to your users:

- **Expo Notifications** - Cross-platform push notifications
- **Firebase Cloud Messaging** - Advanced notification features

### **Add Payments**

Monetize your app:

**Web & Credit Card Payments (works in Expo Go):**

- **Stripe** - Credit card payments and subscriptions - [Expo + Stripe Guide](https://docs.expo.dev/guides/using-stripe/)
- **PayPal** - PayPal payments integration - [Setup Guide](https://developer.paypal.com/docs/checkout/mobile/react-native/)

**Native In-App Purchases (requires Custom Development Build):**

- **RevenueCat** - Cross-platform in-app purchases and subscriptions - [Expo Integration Guide](https://www.revenuecat.com/docs/expo)
- **Expo In-App Purchases** - Direct App Store/Google Play integration - [Implementation Guide](https://docs.expo.dev/versions/latest/sdk/in-app-purchases/)

**Paywall Optimization:**

- **Superwall** - Paywall A/B testing and optimization - [React Native SDK](https://docs.superwall.com/docs/react-native)
- **Adapty** - Mobile subscription analytics and paywalls - [Expo Integration](https://docs.adapty.io/docs/expo)

## I want to use a custom domain - is that possible?

For web deployments, you can use custom domains with:

- **EAS Hosting** - Custom domains available on paid plans
- **Netlify** - Free custom domain support
- **Vercel** - Custom domains with automatic SSL

For mobile apps, you'll configure your app's deep linking scheme in `app.json`.

## Troubleshooting

### **App not loading on device?**

1. Make sure your phone and computer are on the same WiFi network
2. Try using tunnel mode: `bun start -- --tunnel`
3. Check if your firewall is blocking the connection

### **Build failing?**

1. Clear your cache: `bunx expo start --clear`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && bun install`
3. Check [Expo's troubleshooting guide](https://docs.expo.dev/troubleshooting/build-errors/)

### **Need help with native features?**

- Check [Expo's documentation](https://docs.expo.dev/) for native APIs
- Browse [React Native's documentation](https://reactnative.dev/docs/getting-started) for core components
- Visit [Rork's FAQ](https://rork.com/faq) for platform-specific questions

## About Rork

Rork builds fully native mobile apps using React Native and Expo - the same technology stack used by Discord, Shopify, Coinbase, Instagram, and nearly 30% of the top 100 apps on the App Store.

Your Rork app is production-ready and can be published to both the App Store and Google Play Store. You can also export your app to run on the web, making it truly cross-platform.
