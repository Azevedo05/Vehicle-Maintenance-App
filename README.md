# 🚗 Shift

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
- **Customizable**: Settings detailed in `PreferencesContext`

### 📱 Responsive Interface

- 100% responsive design for all screen sizes
- Adaptive keyboard behavior
- Smooth animations and transitions
- Modern cards with shadows and gradients

## 🛠️ Tech Stack

This project uses the best native cross-platform technologies:

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
- **@nkzw/create-context-hook** - Optimized context hooks
- **AsyncStorage** - Local data persistence
- **React Query** - Server state management (available for future integrations)

### Native Features

- **expo-notifications** - Smart local notification system
- **expo-image-picker** - Photo selection and capture
- **i18next** - Full internationalization (PT/EN)
- **date-fns** - Date manipulation

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

## 📂 App Structure

### Contexts (State Management)

- **VehicleContext** - Vehicle, task, and record management
- **NotificationContext** - Smart notification system
- **ThemeContext** - Themes (light/dark/system)
- **LocalizationContext** - Internationalization (PT/EN)
- **AlertContext** - Custom app-wide alert system
- **PreferencesContext** - User preferences management

### Main Screens

- **Home** - Vehicle list with upcoming maintenance alerts
- **Maintenance** - View of all scheduled maintenance
- **Settings** - Theme, language, notification, and unit settings
- **Vehicle Details** - Complete vehicle details with tasks and history
- **Add/Edit Vehicle** - Vehicle management form
- **Add Task** - Schedule new maintenance
- **Add Record** - Log completed maintenance
- **Record Details** - View historical maintenance details
- **Add Fuel Log** - Track fuel consumption (New)

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
│   ├── vehicles/                # Vehicle specific components
│   ├── _layout.tsx             # Root layout
│   ├── add-vehicle.tsx         # Add vehicle
│   ├── edit-vehicle.tsx        # Edit vehicle
│   ├── add-task.tsx            # Add task
│   ├── add-record.tsx          # Add record
│   ├── add-fuel-log.tsx        # Add fuel log
│   ├── notification-settings.tsx # Notification settings
│   └── +not-found.tsx          # 404 page
├── contexts/                    # React contexts
│   ├── VehicleContext.tsx      # Vehicle and maintenance management
│   ├── NotificationContext.tsx # Notification system
│   ├── ThemeContext.tsx        # Theme management
│   ├── LocalizationContext.tsx # Internationalization
│   ├── AlertContext.tsx        # Custom alerts
│   └── PreferencesContext.tsx  # User preferences
├── hooks/                       # Custom hooks
│   ├── useFormValidation.ts    # Form validation logic
│   └── useMaintenanceNotifications.ts  # Notification sync
├── types/                       # TypeScript types
│   ├── vehicle.ts              # Vehicle interfaces and types
│   └── maintenance.ts          # Maintenance interfaces
├── components/                  # Reusable UI components
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
└── tsconfig.json                # TypeScript configuration
```

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
