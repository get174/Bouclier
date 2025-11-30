# TODO: Add Header and Back Button to My Visitors Screen

## Task: Add a header adapted to the application and a back button that takes back to home in the "my visitors" screen.

### Steps:
1. Import ResidentHeader component and router from expo-router in my_visitors.tsx
2. Add ResidentHeader at the top of the screen with appropriate props:
   - title: "Mes Visiteurs"
   - subtitle: "Bouclier"
   - showBackButton: true
   - onBackPress: navigate to home screen
3. Adjust ScrollView styling to account for the header (remove paddingTop: 25 since header will handle spacing)
4. Test the navigation and styling

### Files to modify:
- app/resident/visitors/my_visitors.tsx

### Dependencies:
- ResidentHeader component (already exists)
- expo-router for navigation
