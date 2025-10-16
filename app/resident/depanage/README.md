# Écran de Dépannage - Bouclier

## Description
L'écran "Signaler un problème" permet aux résidents de signaler différents types de problèmes techniques dans leur appartement ou bâtiment.

## Fonctionnalités

### ✅ Sélecteur de type de problème
- **Plomberie** (icône Wrench)
- **Électricité** (icône Zap)
- **Ascenseur** (icône Settings)
- **Autre** (icône MoreHorizontal)

### ✅ Champ de description
- Zone de texte multi-lignes
- Placeholder explicatif
- Validation obligatoire

### ✅ Sélecteur de photo
- Bouton pour ajouter une photo
- Support prévu pour la caméra et la galerie
- Affichage de confirmation quand une photo est sélectionnée

### ✅ Informations du résident
- Email (non modifiable)
- Numéro d'appartement (non modifiable)
- Chargées automatiquement depuis le profil utilisateur

### ✅ Bouton d'envoi
- Validation des champs obligatoires
- Indicateur de chargement pendant l'envoi
- Message de confirmation
- Réinitialisation du formulaire après envoi

## Structure des données envoyées

```typescript
interface ProblemData {
  type: string;        // Type de problème sélectionné
  description: string; // Description détaillée
  image?: string;      // URL ou base64 de l'image (optionnel)
  userEmail: string;   // Email du résident
  apartmentId: string; // Numéro d'appartement
}
```

## Intégration dans l'application

### Navigation
L'écran peut être accessible depuis le menu principal ou depuis la carte d'action "Dépannage" dans l'écran d'accueil.

### Route
```
app/resident/depanage/depanage.tsx
```

### Dépendances
- `lucide-react-native` (icônes)
- `expo-router` (navigation)
- `AuthService` (profil utilisateur)

## TODO - Améliorations futures

1. **Sélection d'image**
   - Intégrer `expo-image-picker`
   - Support de la caméra et de la galerie
   - Compression et optimisation des images

2. **Backend**
   - Créer l'API endpoint pour recevoir les demandes
   - Intégration avec la base de données
   - Système de notifications

3. **Fonctionnalités avancées**
   - Géolocalisation du problème
   - Photos multiples
   - Historique des demandes
   - Statut de suivi en temps réel

## Design
L'écran suit les principes de design de l'application Bouclier :
- Palette de couleurs cohérente
- Espacement et typographie uniformes
- Interface responsive
- Accessibilité respectée
