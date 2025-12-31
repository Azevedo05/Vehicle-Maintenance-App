<div align="center">

# Shift

**Developed by Gonçalo Azevedo**

_A user-friendly, local-first vehicle maintenance management app._

[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android-blue.svg)]()
[![Built with Expo](https://img.shields.io/badge/Built with-Expo-4630EB.svg)](https://expo.dev)

[Website][website-url] • [Download APK][download-anchor] • [Report Bug][issues-url]

</div>

---

## About the Project

**Shift** is a native mobile application for vehicle maintenance management and tracking, featuring an intelligent notification system and full support for Portuguese (Portugal) and English.

- **Platform**: Native Android app
- **Framework**: Expo Router + React Native
- **Privacy**: 100% offline - all data stays on your device

## Download

### Android

Download the latest APK from the [releases page][releases-url] or visit the [website][website-url].

### iOS

Coming soon to the App Store.

---

## Key Features

### Vehicle Management

- Add and edit vehicles with photo
- Track current mileage
- Detailed information (make, model, year, license plate)
- Modern visual interface with gradients and professional design

### Maintenance System

- **Maintenance Tasks**: Schedule future maintenance
  - By date (e.g., annual service)
  - By mileage (e.g., oil change every 10,000 km)
  - Recurring or one-time task options
- **Complete History**: Detailed record of all completed maintenance
- **Predefined Types**: Oil change, service, tires, brakes, filters, battery, and more
- **Full Details**: Cost, location, notes, and date/mileage

### Fuel Tracking

- Log fuel consumption
- Track fuel costs
- Monitor fuel efficiency over time

### Quick Reminders

- **Smart To-Do List**: Manage small checks like oil levels, tire pressure, or cleaning.
- **Nagging Notifications**: Option for frequent reminders (e.g., every 2 hours) to ensure critical tasks aren't forgotten.
- **Independent Tracking**: Separate from the main maintenance schedule for agility.

### Advanced Image Handling

- **Image Positioning**: Precise control over vehicle photo cropping.
- **Dual-View Optimization**: Set different positions for list cards and details banners.
- **Pinch-to-Zoom & Pan**: Intuitive gesture-based adjustment during vehicle setup.

### Smart Notifications

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

### Internationalization

- Full support for **Portuguese (Portugal)** and **English**
- Instant language switching
- Fully translated interface

### Themes

- **Light Mode**: Bright and modern interface
- **Dark Mode**: Perfect for nighttime use
- **System**: Automatically follows device preferences

### 📱 Responsive Interface

- 100% responsive design for all screen sizes
- Adaptive keyboard behavior
- Smooth animations and transitions
- Modern cards with shadows and gradients

---

## Tech Stack

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

## Project Structure

```
├── app/                           # App screens and routing
├── components/                   # Reusable UI components
├── contexts/                     # Global state management
├── services/                     # Persistence & Storage
├── hooks/                        # Custom business logic
├── types/                        # TypeScript definitions
├── locales/                      # Translations
├── assets/                       # Static media
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

**All Rights Reserved** © 2025-2026 Gonçalo Azevedo

You may view the source code for educational purposes, but commercial use, redistribution, and derivative works require explicit written permission.

---

<div align="center">

Made with ❤️ in Portugal

</div>
