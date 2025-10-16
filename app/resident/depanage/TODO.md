# TODO - Écran de Dépannage

## ✅ Terminé
- [x] Création du dossier `app/resident/depanage/`
- [x] Création du composant `depanage.tsx` avec tous les éléments demandés
- [x] Sélecteur de type de problème avec icônes (Plomberie, Électricité, Ascenseur, Autre)
- [x] Champ de description multi-lignes
- [x] Bouton d'ajout de photo (avec placeholder pour implémentation)
- [x] Affichage des informations du résident (email, appartement)
- [x] Bouton "Envoyer la demande" avec validation
- [x] Adaptation au design de l'application Bouclier
- [x] Documentation README.md

## 🔄 À implémenter

### 1. Sélection d'image
- [ ] Intégrer `expo-image-picker`
- [ ] Ajouter les permissions nécessaires dans `app.json`
- [ ] Implémenter la sélection depuis la caméra
- [ ] Implémenter la sélection depuis la galerie
- [ ] Gérer la compression et l'optimisation des images

### 2. Backend Integration
- [ ] Créer l'API endpoint `/api/maintenance-requests`
- [ ] Implémenter la sauvegarde dans la base de données
- [ ] Ajouter l'authentification/autorisation
- [ ] Gérer l'upload des images

### 3. Navigation
- [ ] Ajouter l'écran dans le système de navigation
- [ ] Mettre à jour la carte d'action "Dépannage" dans l'écran d'accueil
- [ ] Ajouter l'icône appropriée dans le menu

### 4. Améliorations UX
- [ ] Ajouter un indicateur de progression pour l'upload d'image
- [ ] Implémenter la validation en temps réel
- [ ] Ajouter des animations de transition
- [ ] Support du mode sombre

### 5. Fonctionnalités avancées
- [ ] Historique des demandes de dépannage
- [ ] Statut de suivi en temps réel
- [ ] Géolocalisation du problème
- [ ] Support des photos multiples
- [ ] Notifications push pour les mises à jour

## 🧪 Tests à effectuer

### Tests unitaires
- [ ] Validation des champs obligatoires
- [ ] Format des données envoyées
- [ ] Gestion des erreurs

### Tests d'intégration
- [ ] Navigation vers l'écran
- [ ] Chargement du profil utilisateur
- [ ] Soumission du formulaire
- [ ] Affichage des messages d'erreur

### Tests UI/UX
- [ ] Responsive design sur différentes tailles d'écran
- [ ] Accessibilité (VoiceOver, TalkBack)
- [ ] Performance de l'interface
- [ ] Consommation mémoire

## 📱 Déploiement

### Préparation
- [ ] Test sur émulateur iOS
- [ ] Test sur émulateur Android
- [ ] Test sur device physique
- [ ] Vérification des permissions

### Publication
- [ ] Build de production
- [ ] Test des builds
- [ ] Soumission aux stores (App Store / Google Play)

## 🔧 Maintenance

### Code quality
- [ ] Révision du code par un pair
- [ ] Optimisation des performances
- [ ] Réduction de la taille du bundle
- [ ] Documentation des fonctions

### Monitoring
- [ ] Logs des erreurs
- [ ] Analytics des usages
- [ ] Crash reporting
- [ ] Performance monitoring
