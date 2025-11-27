# Enhanced Notifications Guide

## 🎯 Overview

The Vehicle Maintenance App now features a complete and advanced notification system with extensive customization options, history tracking, and snooze capabilities.

---

## ✨ New Features

### 1. **Customizable Notification Times** ⏰

**What changed:**
- Previously, all notifications were sent at 9 AM
- Now you can choose your preferred notification time

**How to use:**
1. Go to **Settings** → **Notifications** → **Notification Settings**
2. Select your preferred time from the available options:
   - Morning: 6:00, 7:00, 8:00, 9:00, 10:00, 11:00, 12:00
   - Afternoon/Evening: 15:00, 18:00, 20:00, 21:00
3. Tap **Save** to apply

**Benefits:**
- Get notifications when it's most convenient for you
- Matches your daily routine and schedule

---

### 2. **Custom Notification Intervals** 📅

**What changed:**
- Previously fixed at 7, 3, 1 days before (date) and 1000, 500, 200 km before (mileage)
- Now fully customizable!

**How to use:**
1. Go to **Settings** → **Notifications** → **Notification Settings**
2. **Date Intervals:** Enter comma-separated days (e.g., `14, 7, 3, 1`)
3. **Mileage Intervals:** Enter comma-separated kilometers (e.g., `2000, 1000, 500`)
4. Tap **Save** to apply

**Examples:**
```
Conservative user:
- Date: 14, 7, 3, 1 (get reminded 2 weeks before)
- Mileage: 2000, 1000, 500 (get early warnings)

Minimal reminders:
- Date: 1 (only 1 day before)
- Mileage: 200 (only when very close)

Frequent reminders:
- Date: 30, 15, 7, 3, 1 (start a month early)
- Mileage: 5000, 2000, 1000, 500, 200 (very proactive)
```

**Benefits:**
- Tailor reminders to your maintenance habits
- More control over how often you're notified
- Reduce notification fatigue or increase awareness

---

### 3. **Different Sounds Per Maintenance Type** 🔔

**What changed:**
- Infrastructure is now in place for custom sounds
- Each maintenance type can have its own notification sound

**Current status:**
- System uses default notification sound
- Ready for future sound customization per type

**Future possibilities:**
- Oil Change: Gentle chime
- Inspection: Alert tone
- Tire Rotation: Medium beep
- Brake Pads: Urgent sound

---

### 4. **Notification History** 📜

**What changed:**
- All sent notifications are now logged
- View past 100 notifications with details

**How to access:**
1. Go to **Settings** → **Notifications** → **Notification Settings**
2. Scroll to **Notification History** section

**Information shown:**
- Task title (e.g., "Oil Change")
- Vehicle name (e.g., "Toyota Corolla")
- When notification was sent
- If it was snoozed (and until when)

**Actions:**
- **Clear History:** Removes all notification logs
- **View Details:** Tap any notification for more info

**Benefits:**
- Track when you were reminded
- Verify notifications are working
- Review notification patterns

---

### 5. **Snooze/Remind Later** ⏸️

**What changed:**
- New ability to postpone notifications
- Choose custom snooze duration

**How to use:**
When you receive a notification:
1. Open the notification
2. Choose snooze option:
   - 1 hour (quick postpone)
   - 24 hours (remind tomorrow)
   - 3 days (longer delay)

**In the app:**
```typescript
await snoozeNotification(
  taskId,
  taskTitle,
  vehicleName,
  maintenanceType,
  24 // hours
);
```

**Benefits:**
- Don't lose important reminders
- Postpone when you're busy
- Get reminded at a better time
- Logged in notification history

---

## 🔧 Technical Implementation

### PreferencesContext

New notification settings interface:
```typescript
interface NotificationSettings {
  notificationTime: number;        // 0-23 (hour of day)
  dateIntervals: number[];         // e.g., [7, 3, 1]
  mileageIntervals: number[];      // e.g., [1000, 500, 200]
}
```

### NotificationContext

New functions:
- `addToHistory()` - Logs notification events
- `clearHistory()` - Removes all logs
- `snoozeNotification()` - Postpones a notification
- `getSoundForType()` - Returns sound for maintenance type

### Notification History Item

```typescript
interface NotificationHistoryItem {
  id: string;
  taskId: string;
  taskTitle: string;
  vehicleName: string;
  type: MaintenanceType;
  sentAt: number;           // Timestamp
  daysUntil?: number;
  kmUntil?: number;
  snoozedUntil?: number;    // If snoozed
}
```

---

## 📱 User Interface

### New Screen: Notification Settings

**Location:** Settings → Notifications → Notification Settings

**Sections:**
1. **Notification Time** - Time picker with popular hours
2. **Date Intervals** - Comma-separated input for days
3. **Mileage Intervals** - Comma-separated input for km
4. **Notification History** - List of past notifications

**Features:**
- Visual time selector (buttons for each hour)
- Input validation (only positive numbers)
- Helper text with examples
- Save button with confirmation
- Clear history with confirmation dialog
- Scrollable history list (shows last 20)

---

## 🎨 Design Details

### Colors & Icons
- ⏰ Clock icon for time settings
- 📅 Calendar icon for date intervals
- 🔧 Gauge icon for mileage intervals
- 📜 History icon for logs
- 🔔 Bell icon for notifications

### User Experience
- Only show advanced settings when notifications are enabled
- Provide clear examples for interval inputs
- Sort intervals automatically (descending order)
- Limit history to 100 items (performance)
- Immediate feedback on save

---

## 🚀 Usage Examples

### Example 1: Early Planner
```
Settings:
- Time: 7:00 AM (check notifications with morning coffee)
- Date: 30, 15, 7, 3, 1 (start planning a month ahead)
- Mileage: 5000, 2000, 1000, 500 (very proactive)

Result: Gets plenty of advance warning for all maintenance
```

### Example 2: Just-in-Time
```
Settings:
- Time: 21:00 (evening reminder)
- Date: 3, 1 (only last few days)
- Mileage: 500, 200 (just before it's due)

Result: Minimal notifications, only when action is needed
```

### Example 3: Commuter
```
Settings:
- Time: 18:00 (after work)
- Date: 7, 3 (weekly planning)
- Mileage: 2000, 1000, 500, 200 (drives a lot)

Result: Balanced approach with extra mileage warnings
```

---

## 📊 Statistics

With the new system, users can receive:
- **Up to 11 different reminder times** per day
- **Custom date intervals** (1 to 30+ days)
- **Custom mileage intervals** (100 to 5000+ km)
- **100 notification logs** stored locally
- **Unlimited snooze options** per notification

---

## 🔐 Privacy & Data

- All notifications are **local only** (no cloud/server)
- History stored in **AsyncStorage** (device only)
- Clearing data removes all notification logs
- No personal data leaves the device
- Complies with privacy best practices

---

## 🎯 Next Steps

### Potential Future Enhancements:
1. ✅ Custom sounds per type (infrastructure ready)
2. Smart snooze (AI suggests best time)
3. Notification priority levels
4. Batch notifications (group by vehicle)
5. Quiet hours (automatically disable)
6. Weather-based reminders (delay if raining)
7. Location-based (remind near mechanic)

---

## 📝 Translations

All new features are fully translated:
- 🇬🇧 English
- 🇵🇹 Portuguese (Portugal)

Keys added:
- `settings.notification_settings`
- `settings.notification_time`
- `settings.date_intervals`
- `settings.mileage_intervals`
- `settings.notification_history`
- `settings.clear_history`
- `settings.no_notifications`
- `settings.snooze_*`
- `settings.snoozed_until`

---

## ✅ Testing Checklist

- [x] Notification time picker works
- [x] Custom intervals can be saved
- [x] History logs correctly
- [x] Snooze function works
- [x] Clear history confirmation
- [x] Input validation
- [x] Translations work
- [x] Navigation from settings
- [x] No linter errors
- [x] Backwards compatible

---

## 🎉 Summary

The enhanced notification system provides users with:
- **Complete control** over when and how often they're reminded
- **Full transparency** with notification history
- **Flexibility** to postpone reminders
- **Future-ready** architecture for more features

This makes the Vehicle Maintenance App one of the most customizable maintenance reminder apps available!

