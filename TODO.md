# TODO: Fix ESLint Warnings and Errors

## Frontend (React Native / TypeScript)
- [x] Fix missing dependency 'images.length' in useEffect in app/index.tsx
- [ ] Fix unused 'error' in app/newpass.tsx
- [x] Fix unused 'SecureStore' in app/register.tsx
- [x] Fix unused 'fullName' in app/resident/_layout.tsx
- [ ] Fix missing dependency 'router' in useEffect in app/resident/amenities/amenity_booking.tsx
- [ ] Fix unused 'loading' in app/resident/home.tsx
- [ ] Fix unused 'unreadCount' in app/resident/notifications.tsx
- [ ] Fix unused 'setThemeMode' in app/resident/settings.tsx
- [ ] Fix missing dependencies 'router' and 'showAlert' in useEffect in app/resident/visitors/[id].tsx
- [ ] Fix unused 'image' and 'setImage' in app/resident/visitors/add_visitors.tsx
- [ ] Fix missing dependencies 'router' and 'showAlert' in useEffect in app/resident/visitors/details/[id].tsx
- [ ] Fix unescaped entities in app/securite/AddVisitor.tsx (line 219)
- [ ] Fix unescaped entities in app/securite/ScanControl.tsx (lines 67, 176, 184)
- [ ] Fix unused 'getStatusBadge' in app/securite/Visitors.tsx
- [ ] Fix unused 'setSelectedBuilding' and 'handleRegister' in app/select_building.tsx
- [ ] Fix unused 'setSelectedBuilding' and 'handleRegister' in app/select_building_security.tsx
- [ ] Fix missing dependency 'slideAnim' in useEffect in components/ResidentDrawerMenu.tsx
- [ ] Fix no-unused-expressions in constants/Config.ts
- [ ] Fix unused 'refreshError' in services/apiService.ts
- [ ] Fix unused 'error' in services/authService.ts
- [ ] Fix unused 'BlockData' and 'ApartmentData' in services/locationService.ts

## Backend (Node.js / JavaScript)
- [ ] Fix unused 'mongoose' and 'error' in backend/api/apartments.js
- [ ] Fix unused 'refreshTokenExpirySeconds' in backend/routes/login.js
- [ ] Fix unused 'error' in backend/routes/notifications.js (lines 13, 24)
- [ ] Fix unused 'err' in backend/routes/verifyOtp.js
- [ ] Fix unused 'createdVisitors' in backend/routes/visitors.js

## Config Files
- [ ] Fix unused 'path' in metro.config.js
- [ ] Remove unused eslint-disable directive in .expo/types/router.d.ts
