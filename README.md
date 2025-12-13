# 🚗 Shift

<div align="center">

**Vehicle Maintenance Management App**

[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue.svg)]()
[![Built with Expo](https://img.shields.io/badge/Built%20with-Expo-4630EB.svg)](https://expo.dev)

[Website](https://shift-vehicle-maintenance.vercel.app/) • [Download APK](#-download) • [Report Bug](https://github.com/Azevedo05/Vehicle-Maintenance-App/issues)

</div>

---

## 📖 About the Project

**Shift** is a native mobile application for vehicle maintenance management and tracking, featuring an intelligent notification system and full support for Portuguese (Portugal) and English.

- **Platform**: Native iOS & Android app
- **Framework**: Expo Router + React Native
- **Privacy**: 100% offline - all data stays on your device

## 📥 Download

### Android

Download the latest APK from the [releases page](https://github.com/Azevedo05/Vehicle-Maintenance-App/releases) or visit the [website](https://shift-vehicle-maintenance.vercel.app/).

### iOS

Coming soon to the App Store.

---

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

### ⛽ Fuel Tracking

- Log fuel consumption
- Track fuel costs
- Monitor fuel efficiency over time

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
- **Convenient Schedule**: Default at 9 AM (customizable)
- **100% Local**: No internet required, total privacy

### 🌍 Internationalization

- Full support for **Portuguese (Portugal)** and **English**
- Instant language switching
- Fully translated interface

### 🎨 Themes

- **Light Mode**: Bright and modern interface
- **Dark Mode**: Perfect for nighttime use
- **System**: Automatically follows device preferences

### 📱 Responsive Interface

- 100% responsive design for all screen sizes
- Adaptive keyboard behavior
- Smooth animations and transitions
- Modern cards with shadows and gradients

---

## 🛠️ Tech Stack

### Core

- **React Native** - Native mobile development framework created by Meta
- **Expo** - Extended React Native platform
- **Expo Router** - File-based routing system
- **TypeScript** - Statically typed JavaScript

### UI & Design

- **Lucide React Native** - Modern and beautiful icons
- **expo-linear-gradient** - Smooth gradients for premium UI
- **react-native-safe-area-context** - Safe area management

### State & Data

- **React Context API** - Global state management
- **AsyncStorage** - Local data persistence

### Native Features

- **expo-notifications** - Smart local notification system
- **expo-image-picker** - Photo selection and capture
- **i18next** - Full internationalization (PT/EN)
- **date-fns** - Date manipulation

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Azevedo05/Vehicle-Maintenance-App.git

# 2. Navigate to project directory
cd Vehicle-Maintenance-App

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

---

## 📁 Project Structure

```
├── app/                           # App screens (Expo Router)
│   ├── (tabs)/                   # Tab navigation
│   │   ├── index.tsx            # Home - Vehicle list
│   │   ├── maintenance.tsx      # Scheduled maintenance
│   │   └── settings.tsx         # Settings
│   ├── vehicle/[id].tsx         # Vehicle details
│   ├── record/[id].tsx          # Record details
│   ├── add-vehicle.tsx          # Add vehicle
│   ├── add-task.tsx             # Add task
│   ├── add-record.tsx           # Add record
│   └── add-fuel-log.tsx         # Add fuel log
├── components/                   # Reusable UI components
├── contexts/                     # React contexts (state management)
├── hooks/                        # Custom hooks
├── types/                        # TypeScript types
├── locales/                      # Translations (EN/PT-PT)
├── constants/                    # Constants
├── assets/                       # Static assets
└── website/                      # Marketing website
```

---

## 💾 Data Management

All data is stored **locally** on the device using AsyncStorage:

- ✅ **Total Privacy**: No data leaves the device
- ✅ **Offline First**: Works without internet
- ✅ **Persistence**: Data persists after closing the app
- ✅ **Performance**: Fast data access

---

## 👨‍💻 Author

**Gonçalo Azevedo**

- Portfolio: [goncalo-portfolio.vercel.app](https://goncalo-portfolio.vercel.app/)
- GitHub: [@Azevedo05](https://github.com/Azevedo05)

---

## 📄 License

This project is proprietary software. See the [LICENSE](./LICENSE) file for details.

**All Rights Reserved** © 2024-2025 Gonçalo Azevedo

You may view the source code for educational purposes, but commercial use, redistribution, and derivative works require explicit written permission.

---

<div align="center">

Made with ❤️ in Portugal

</div>
