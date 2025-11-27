# 🚀 Vehicle Maintenance App - Roadmap

## 🐛 Bugs & Fixes

### Known Issues
- [ ] **Vehicle Details - History Language Mismatch**
  - Issue: Maintenance history appears in Portuguese even when app is set to English
  - Location: `app/vehicle/[id].tsx` - History section
  - Fix: Ensure date formatting uses correct locale based on app language
  - Note: Date format is already fixed to DD/MM/YYYY, but may need to verify text translations

- [x] **Vehicle Details - Date Format** ✅ RESOLVED
  - Issue: Date format should always be DD/MM/YYYY regardless of locale
  - Location: `app/vehicle/[id].tsx` - `formatDate` function
  - Fix: Force DD/MM/YYYY format instead of using locale-specific formatting
  - Status: Already implemented - formatDate function uses fixed DD/MM/YYYY format

- [ ] **Settings - List Bottom Padding**
  - Issue: Last items in some settings sections show gray background indicating more content below, but there isn't any
  - Location: `app/(tabs)/settings.tsx` - Various sections
  - Fix: Ensure proper bottom padding/spacing like in "About" section to indicate end of list
  - Note: scrollContent has paddingBottom: 24, but may need section-specific adjustments

---

## ✅ Implemented Features (Phase 1)

### Core Functionality
- [x] Vehicle management (add, edit, delete, view)
- [x] Photo support for vehicles
- [x] Mileage tracking
- [x] Maintenance task scheduling (date & mileage based)
- [x] Recurring and one-time tasks
- [x] 11 predefined maintenance types
- [x] Complete maintenance history
- [x] Detailed record viewing

### Smart Notifications
- [x] Multi-interval date-based notifications (customizable: 7d, 3d, 1d, today, or custom)
- [x] Mileage-based notifications (customizable: 1000km, 500km, 200km, or custom)
- [x] Overdue maintenance alerts
- [x] Customizable notification times (not just 9 AM)
- [x] 100% local notifications
- [x] Automatic synchronization
- [x] Notification history/log
- [x] Snooze/remind later option

### User Experience
- [x] Full internationalization (English & Portuguese)
- [x] Theme support (Light/Dark/System)
- [x] Responsive design for all screen sizes
- [x] Smart keyboard handling
- [x] Modern UI with gradients and shadows

### Data Management
- [x] Export data (JSON backup)
- [x] Import data (restore from backup)
- [x] Clear all data
- [x] Units of measurement (km/mi)
- [x] Currency selection (EUR, USD, GBP, BRL)
- [x] 100% local storage (AsyncStorage)

### App Information
- [x] About section with app description
- [x] Feature list
- [x] Version display

---

## 📋 Phase 2 - Enhanced Features (Next Priority)

### 1. Default Maintenance Intervals ✅ COMPLETED
**Priority: HIGH**
- [x] Predefined recommended intervals by maintenance type
  - Oil Change: 10,000 km / 12 months
  - Full Service: 15,000 km / 12 months (Inspection)
  - Tires: 40,000 km / 48 months
  - Battery: 3 years (36 months)
  - etc.
- [x] Auto-populate when creating new tasks
- [x] "Use Recommended" button with visual hint
- [x] Smart interval suggestions based on maintenance type
- [x] Save time for users
- [ ] User can customize default intervals (future enhancement)

### 2. Statistics & Analytics ✅ COMPLETED
**Priority: MEDIUM**
- [x] Total spending on maintenance (by vehicle, by type, by year)
- [x] Number of maintenance tasks completed
- [x] Average cost per maintenance type
- [x] Monthly/yearly spending charts (last 12 months)
- [x] Most frequent maintenance types
- [x] Cost breakdown by vehicle
- [x] Insights section with key metrics
- [x] Visual bar chart for monthly trends
- [x] Empty state for new users


### 3. Enhanced Notifications ✅
**Priority: MEDIUM** - **COMPLETED**
- [x] Customizable notification times (not just 9 AM)
- [x] Custom notification intervals (not just 7d, 3d, 1d)
- [x] Different sounds per maintenance type (infrastructure ready)
- [x] Notification history/log
- [x] Snooze/remind later option

---

## 🎯 Phase 3 - Advanced Features

### 5. Multiple Vehicles Management ✅ COMPLETED
**Priority: MEDIUM**
- [x] Vehicle categories (personal, work, family, other)
- [x] Category selection in add/edit forms
- [x] **Category-based filtering** - Filter vehicles by category in main list
- [x] **Category badges** - Visual indicators on vehicle cards showing category
- [x] **Category statistics** - Spending breakdown by category in Statistics tab
- [x] **Category-based export** - Export only vehicles from specific category
- [x] **Archive functionality** - Archive/unarchive vehicles (hide from main list)
- [x] **Filter archived vehicles** - Toggle to show/hide archived vehicles
- [x] Vehicle comparison view (compare 2-4 vehicles side by side)
- [x] Bulk operations (archive/export/delete multiple vehicles)

### 7. Document Storage
**Priority: LOW**
- [ ] Attach receipts/invoices to records
- [ ] Store insurance documents
- [ ] Registration documents
- [ ] Warranty information
- [ ] OCR for automatic data extraction from receipts

### 8. Fuel Tracking ✅ COMPLETED
**Priority: LOW**
- [x] Log fuel fill-ups
- [x] Fuel cost tracking (per fill + per vehicle)
- [x] Fuel statistics (total volume, total cost, average cost per fill, average volume)
- [x] Fuel tracking by vehicle
- [x] Filter by date range (all time, last 30 days, last 90 days)

---

## 🌟 Phase 4 - Premium Features

### 12. Reminders for Other Tasks
**Priority: LOW**
- [ ] Insurance renewal reminders
- [ ] Registration renewal
- [ ] Inspection deadlines
- [ ] Tax reminders

### 13. Multi-Language Expansion
**Priority: LOW**
- [ ] Spanish
- [ ] French
- [ ] German
- [ ] Italian
- [ ] More languages

---

## 🔧 Technical Improvements

### Performance
- [x] Image compression for vehicle photos (basic - quality: 0.8 via ImagePicker)
  - Note: Basic compression implemented, but could be enhanced with automatic resizing and advanced compression
- [x] Lazy loading for large lists ✅ IMPLEMENTED
  - Note: Main lists now use FlatList for better performance:
    - Vehicle list (app/(tabs)/index.tsx) - uses FlatList with virtualization
    - Maintenance tasks list (app/(tabs)/maintenance.tsx) - uses FlatList with section headers
    - Maintenance records list (app/vehicle/[id].tsx) - uses FlatList within ScrollView
  - Performance optimizations: initialNumToRender, maxToRenderPerBatch, windowSize, removeClippedSubviews
- [ ] Database optimization
  - Note: Uses simple AsyncStorage (key-value store) - no indexes, no query optimization, no pagination
  - All data loaded at once on app start
- [x] Cache management (partial)
  - Note: expo-image provides automatic image caching
  - Missing: Data caching, query result caching, computed data caching

### Code Quality
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Code documentation

### Accessibility
- [ ] Screen reader support
- [ ] High contrast mode
- [ ] Font size adjustment
- [ ] Color blind friendly mode

---

## 🎨 UI/UX Improvements

### Design
- [x] App shortcuts
  - Long-press on vehicle cards to open quick menu:
    - "Add maintenance"
    - "Add fuel log"
    - "View statistics"
  - Quick navigation from Maintenance/Statistics tabs with internal deep-link (e.g., open a specific vehicle directly via `vehicleId`)

- [ ] Dark mode optimization
  - Review contrasts and colors in dark theme, ensuring good readability of secondary text
  - Adjust shadows and borders so they don't become too light or invisible
  - Fine-tune screens with many cards (statistics, vehicle details) to balance backgrounds in dark mode (avoid all black or all light gray)

### User Experience
- [X] Undo/redo functionality
- [ ] Drag and drop for reordering
  - **Visual Reordering Mode:**
    - When the user activates reordering mode — by clicking an edit button — list elements enter a special visual state that conveys the idea that they have left their fixed position on screen and are now "loose" and ready to be moved.
    
    - In this mode, items appear to slightly detach from their original position, as if separating from the static layout. They can gain a sense of lightness or floating, often with a subtle visual change like a shadow, minimal scale increase, or slight elevation, reinforcing the idea that they have become movable objects.
    
    - While in this mode, items display a continuous gentle shake animation, a "wiggle" or "jitter", that makes them slightly sway left and right or oscillate almost imperceptibly. This shake is not exaggerated — just enough to create the perception that they are alive, active, and manipulable. This vibration serves as clear visual feedback for the user, indicating that:
      - items can now be dragged,
      - their position can be changed,
      - and that the layout is not static.
    
    - As the user drags an item, it moves fluidly, sliding between other elements, which retreat or reorganize dynamically to make space. The entire behavior conveys the sensation that elements are physical objects, loose and malleable, making it clear that the interface is in "reorganization mode".
    
    - When the user finishes and exits this mode, the shake disappears immediately and items return to being fixed, stable, and immobile, clearly signaling the end of editing.
- [ ] Search and filter improvements
- [ ] **Advanced sorting options**
  - Sort vehicles by:
    - Mileage (highest to lowest / lowest to highest)
    - Most recent (newest first)
    - Oldest first
    - Name (A-Z / Z-A)
    - Year (newest to oldest / oldest to newest)
    - Last maintenance date
  - Sort maintenance records by:
    - Date (most recent / oldest)
    - Cost (highest / lowest)
    - Mileage (highest / lowest)
    - Type
  - Sort maintenance tasks by:
    - Due date (overdue first / upcoming first)
    - Type
    - Vehicle
- [ ] Quick filters (overdue, upcoming, completed)

---

## 💡 Community Requested Features

### To Be Evaluated
- [ ] Integration with car APIs (OBD-II scanners)
- [ ] Web version
- [ ] Apple Watch/Android Wear support
- [ ] Siri/Google Assistant shortcuts
- [ ] Share maintenance history when selling vehicle
- [ ] Print maintenance log as PDF

---

## 📊 Current Status

**Version:** 1.0.0  
**Completion:** ~85% of core features  
**Phase 1:** ✅ Completed  
**Phase 2:** ✅ Completed (Default Intervals, Statistics, Enhanced Notifications)  
**Phase 3:** ✅ Mostly Completed (Vehicle Categories ✅, Fuel Tracking ✅, Document Storage 🔮 Future)  
**Phase 4:** 🔮 Future  

---

## 🤝 Contributing

If you'd like to contribute or have suggestions for new features, please:
1. Create an issue on GitHub
2. Discuss the feature before implementing
3. Follow the existing code style
4. Write tests for new features
5. Update documentation

---

## 📝 Notes

- Features are prioritized based on user value and implementation complexity
- Some features may require Custom Development Build (native modules)
- Cloud features would require backend infrastructure
- Premium features could be monetized to support development

**Last Updated:** November 2025

