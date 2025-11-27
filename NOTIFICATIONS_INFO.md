# 📱 Notification System - Vehicle Maintenance App

## Configuration

1. Open the app and go to **Settings**
2. Enable the toggle **"Enable Notifications"**
3. Allow notifications when the system prompts

## 🔔 Automatic Notifications - Date-Based Maintenance

The system sends notifications at **multiple moments** before the deadline:

### 📅 7 Days Before
- **Title**: "📅 Maintenance Reminder"
- **When**: 7 days before the scheduled date
- **Time**: 9 AM
- **Example**: "Oil Change for Toyota Corolla in 7 days"

### ⚠️ 3 Days Before
- **Title**: "⚠️ Upcoming Maintenance"
- **When**: 3 days before the scheduled date
- **Time**: 9 AM
- **Example**: "Oil Change for Toyota Corolla in 3 days"

### 🔔 1 Day Before (Tomorrow)
- **Title**: "🔔 Maintenance Tomorrow"
- **When**: 1 day before the scheduled date
- **Time**: 9 AM
- **Example**: "Don't forget: Oil Change for Toyota Corolla is tomorrow!"

### 🔔 On the Day
- **Title**: "🔔 Maintenance Today"
- **When**: On the maintenance day
- **Time**: 9 AM
- **Example**: "Oil Change for Toyota Corolla should be done today!"

### ⚠️ Overdue
- **Title**: "⚠️ Overdue Maintenance"
- **When**: After the date has passed
- **Time**: 9 AM (daily until completed)
- **Example**: "Oil Change for Toyota Corolla is 5 days overdue!"

## 🚗 Automatic Notifications - Mileage-Based Maintenance

The system sends notifications at **recommended intervals**:

### 📅 1000 km Before
- **Title**: "📅 Maintenance Reminder"
- **When**: 1000 km or less remaining
- **Time**: 9 AM (next day after reaching the threshold)
- **Example**: "Service for Honda Civic in 850 km"

### ⚠️ 500 km Before
- **Title**: "⚠️ Upcoming Maintenance"
- **When**: 500 km or less remaining
- **Time**: 9 AM
- **Example**: "Service for Honda Civic in 450 km"

### 🚨 200 km Before (Urgent)
- **Title**: "🚨 Urgent Maintenance"
- **When**: 200 km or less remaining
- **Time**: 9 AM
- **Example**: "Service for Honda Civic in just 180 km!"

### ⚠️ Exceeded
- **Title**: "⚠️ Overdue Maintenance"
- **When**: Already exceeded the mileage
- **Time**: 9 AM (daily until completed)
- **Example**: "Service for Honda Civic exceeded by 150 km!"

## ⏰ Convenient Schedule

All notifications are sent at **9 AM** to:
- ✅ Not disturb during the night
- ✅ Remind you when starting the day
- ✅ Give time to schedule maintenance

## 🎯 Smart Features

### Automatic Synchronization
Notifications are **automatically rescheduled** when you:
- Add a new maintenance task
- Update vehicle mileage
- Edit an existing task

### Automatic Cancellation
Notifications are **automatically cancelled** when you:
- Mark a task as completed
- Delete a task
- Disable notifications in Settings

### Multiple Notifications
- Each task can generate **multiple notifications** at recommended moments
- No need to choose - you'll receive reminders at all appropriate intervals
- Only future notifications are scheduled (no old notifications sent)

## 🛠️ Notification Management

### How to Stop Notifications
1. Go to **Settings** → **Notifications**
2. Disable the toggle **"Enable Notifications"**
3. All pending notifications will be cancelled

### How to Reactivate
1. Enable the toggle again
2. Notifications will be automatically rescheduled for all active tasks

## ⚙️ Compatibility

- ✅ **Android**: Full support (Android 8.0+)
- ✅ **iOS**: Full support (iOS 13+)
- ✅ **Background**: Works with app closed
- ✅ **Persistence**: Notifications persist after device restart

## 💡 Tips

1. **Keep notifications enabled** to never miss maintenance
2. **Update mileage regularly** for accurate km-based reminders
3. **Mark tasks as recurring** to receive continuous notifications
4. **Allow notifications in system** to ensure you receive them
5. **Adjust task intervals** to realistic and convenient periods

## 🔒 Privacy

- Notifications are **100% local** (don't leave your device)
- No information is sent to external servers
- No internet connection required to function
