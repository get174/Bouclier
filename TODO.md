# TODO: Side Menu Modifications

## 1. Make Profile Circle Editable for Photo Upload
- [ ] Add profileImage field to User model (backend/models/User.js)
- [ ] Modify updateProfile route to handle image upload with multer (backend/routes/updateProfile.js)
- [ ] In ResidentDrawerMenu.tsx:
  - [ ] Add state for profileImageUri
  - [ ] Add ImagePicker functionality to select and upload photo
  - [ ] Change profileImage View to TouchableOpacity
  - [ ] Display Image if profileImageUri exists, else show initial
  - [ ] Fetch profileImage from backend in fetchUserData

## 2. Separate Building Name from Block and Apartment Display
- [ ] Modify profileApartment text in ResidentDrawerMenu.tsx to display on separate lines or with better spacing

## 3. Style Logout Button
- [ ] Move logout button to bottom with marginTop
- [ ] Style logout button in red color
- [ ] Ensure it's visually separated from other buttons
