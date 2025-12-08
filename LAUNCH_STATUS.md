# Launch Preparation Checklist

## 1. App Identity

- [x] **App Name**: Update `name` and `slug` in `app.json`.
- [x] **App Logo**: Update `icon`, `adaptiveIcon`, and `splash` images.

## 2. Statistics UI Fixes

- [x] **Expenses by Vehicle**:
  - [x] Fix maintenance count sticking to vehicle name (Change layout to column).
  - [x] Align chevron icon horizontally with price.
- [x] **Expenses by Type**:
  - [x] Fix text color consistency (Ensure `textSecondary` is used).
  - [x] Fix text spacing (Increase `lineHeight` or padding).
- [x] **General**:
  - [x] Review and improve spacing across the statistics page.

## 3. Settings Cleanup

- [x] **Remove Sample Data**: Delete "Load Sample Data" button and logic from `settings.tsx`.

## 4. About Page

- [ ] **Corrections**: Apply text and layout fixes (Waiting for user details).

## 5. Maintenance & Records

- [x] **Refactor Fuel Types**: Consolidated Gasoline 95/98 and Diesel/Additive.
- [x] **Fix Recommended Date Interval**: Corrected default intervals for date-based maintenance.
- [x] **Fix Fuel Log Scroll**: Fixed scrolling issue on `add-fuel-log.tsx`.
- [x] **Review Maintenance Types**: Review and update the list of available maintenance types.
- [-] **Fix Miles on Units of Measurement**: Ensure miles are displayed correctly. (Skipped for now)

## 6. UI/UX Polish

- [x] **Reusable Alert Component**: Refactored to use custom alert component.
- [x] **Fix Type Error**: Fixed `Card` component style prop issue.
- [x] **Page Spacing**: Review and fix spacing at the bottom of all pages (Safe Area / Padding).
- [x] **Redesign Vehicle Cards**: Modernize main page vehicle cards for better image visibility and cleaner look.
- [x] **Fix Filter Menu Drag Bug**: Fix issue where dragging the filter menu upwards causes it to get cut off/bugged.
- [x] **Filter Menu Handle Color**: Change the drag handle color to blue to indicate interactivity.
- [x] **Ensure good white mode**: Ensure white mode is working correctly with good contrast and visibility.
- [x] **Make Fuel Logs clicabel**: Make fuel logs clickable to open the log details page.
- [x] **Change the Inspection Overdue border color to red**
- [x] **Ensure "Next maintenance" appears in "Add maintenance task" even when the recurring task is not activated**

## 7. New Features & Research

- [x] **License Plate API**: Research APIs to fetch vehicle details from license plate (Portugal/EU focus). See [Research Results](research/license_plate_apis.md) and [Free Options Analysis](research/free_license_plate_options.md).
- [ ] **Gemini AI Integration**: Implement Google Gemini API for AI-powered assistance within the app.

## 8. New Page

- [x] **Quick Reminders & Nagging**: Implement a "To-Do" list for small checks (Oil, Tires) with frequent local notifications (e.g., "Remind me every 2h") to ensure they get done.
- [x] **Review Visuals**: Review and refine the visual design of Quick Reminder cards.
- [x] **UI Component Library**: Implement `react-native-paper` to modernize vehicle cards and other components in the vehicle list.

## 9.

- [x] **Feed the app with data**: Update the data with a few vehicles and maintenance tasks to ensure the app works as expected.

## 11. IOS Critical Fixes (Deferred to v1.1)

- [ ] **Header Buttons Misalignment**: Fix "Confirm" and "Save" buttons alignment in headers.
- [ ] **Delete Button Visibility**: Fix "Trash" icon not appearing in headers.
- [ ] **Page Cut-off / Safe Area**: Fix "Edit Vehicle" and form pages being cut off at the top.
- [ ] **Form Layout**: Ensure forms use correct Safe Area constraints.

## 12. Version 2.0 (Planned)

- [ ] **Biometric Authentication**: Add FaceID/TouchID support.
