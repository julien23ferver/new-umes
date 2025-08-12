# 🏆 Hall of Fame en Ligne - Cyber Dico

## 📋 **Vue d'ensemble**

Le **Hall of Fame en ligne** permet aux joueurs d'enregistrer leurs scores et de les partager avec tous les autres utilisateurs. Le système utilise une **API REST simple** avec une **base de données JSON** pour stocker les scores.

## 🚀 **Fonctionnalités**

### ✅ **Fonctionnalités principales :**
- **Pseudo obligatoire** - Chaque joueur doit entrer son pseudo
- **Sauvegarde en ligne** - Scores partagés entre tous les utilisateurs
- **Classement global** - Top 100 des meilleurs scores
- **Statistiques** - Moyennes, nombre de joueurs, etc.
- **Mode hors ligne** - Fallback vers localStorage si le serveur est indisponible
- **Interface moderne** - Design rétro style arcade

### 🎮 **Types de scores :**
- **Cyber Dico** - Quiz de cybersécurité
- **Jeu du Héros** - Jeu d'aventure (futur)
- **Toutes difficultés** - Facile, Moyen, Difficile

## 🛠️ **Installation et démarrage**

### **1. Prérequis :**
- Python 3.x (inclus par défaut sur la plupart des systèmes)
- Aucune dépendance externe requise

### **2. Démarrage du serveur :**
```bash
# Dans le dossier du projet
python3 simple_server.py
```

### **3. Accès à l'application :**
- **Cyber Dico** : http://localhost:3000/
- **API Scores** : http://localhost:3000/api/scores
- **Statistiques** : http://localhost:3000/api/stats

## 📁 **Structure des fichiers**

```
cyber/
├── dico.html              # ✅ Application principale
├── questions.js           # ✅ Questions du quiz
├── simple_server.py       # 🆕 Serveur HTTP simple
├── scores.json            # 🆕 Base de données des scores
├── package.json           # ❌ (non utilisé - serveur Python)
├── server.js              # ❌ (non utilisé - serveur Python)
└── README_HALL_OF_FAME_EN_LIGNE.md
```

## 🔧 **API REST**

### **GET /api/scores**
Récupérer tous les scores (triés par score décroissant)
```json
{
  "scores": [
    {
      "id": "uuid",
      "pseudo": "CYBER_MASTER",
      "score": 95,
      "percentage": 95,
      "correct": 19,
      "total": 20,
      "difficulty": "facile",
      "time": 180,
      "gameType": "quiz",
      "date": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### **POST /api/scores**
Ajouter un nouveau score
```json
{
  "pseudo": "MON_PSEUDO",
  "score": 85,
  "percentage": 85,
  "correct": 17,
  "total": 20,
  "difficulty": "moyen",
  "time": 240,
  "gameType": "quiz"
}
```

### **GET /api/stats**
Obtenir les statistiques globales
```json
{
  "totalScores": 150,
  "averageScore": 78,
  "topScore": 100,
  "totalPlayers": 45,
  "difficulties": {
    "facile": {"count": 60, "average": 82},
    "moyen": {"count": 70, "average": 75},
    "difficile": {"count": 20, "average": 68}
  }
}
```

### **DELETE /api/scores**
Supprimer tous les scores (ADMIN)

## 🎯 **Utilisation**

### **1. Jouer au quiz :**
1. Ouvrir http://localhost:3000/
2. Choisir un mode de jeu
3. Répondre aux questions
4. À la fin, entrer son pseudo
5. Le score est automatiquement enregistré

### **2. Consulter le Hall of Fame :**
1. Cliquer sur l'onglet "🏆 Hall of Fame"
2. Voir les meilleurs scores
3. Filtrer par type de jeu
4. Consulter les statistiques

### **3. Mode hors ligne :**
- Si le serveur n'est pas disponible, le système utilise localStorage
- Les scores sont sauvegardés localement
- Synchronisation automatique quand le serveur revient

## 🔒 **Sécurité et validation**

### **Validation des données :**
- **Pseudo obligatoire** - Ne peut pas être vide
- **Score numérique** - Doit être un nombre positif
- **Limitation** - Maximum 100 scores conservés
- **Sanitisation** - Pseudo converti en majuscules

### **CORS activé :**
- Permet les requêtes depuis n'importe quelle origine
- Nécessaire pour le développement local

## 🎨 **Interface utilisateur**

### **Design rétro arcade :**
- **Couleurs** : Bleu cyber (#00cfff), Rouge accent (#ff004f)
- **Animations** : Transitions fluides, effets de survol
- **Responsive** : S'adapte à tous les écrans
- **Accessibilité** : Navigation clavier, contrastes élevés

### **Éléments visuels :**
- **Trophées** 🏆 pour les 3 premiers
- **Indicateur de chargement** ⏳
- **Messages d'erreur** ❌
- **Statistiques en temps réel** 📊

## 🚨 **Dépannage**

### **Serveur ne démarre pas :**
```bash
# Vérifier que Python 3 est installé
python3 --version

# Vérifier que le port 3000 est libre
netstat -tuln | grep 3000
```

### **Erreur de connexion :**
- Vérifier que le serveur est démarré
- Vérifier l'URL : http://localhost:3000/
- Vérifier les logs du serveur

### **Scores non sauvegardés :**
- Vérifier les permissions d'écriture sur `scores.json`
- Vérifier l'espace disque disponible
- Consulter les logs d'erreur

## 🔄 **Évolutions futures**

### **Fonctionnalités prévues :**
- **Authentification** - Comptes utilisateurs
- **Base de données** - PostgreSQL/MySQL
- **Notifications** - Nouveaux records
- **Export** - PDF, Excel
- **Médailles** - Badges de progression
- **Saisons** - Classements temporaires

### **Améliorations techniques :**
- **HTTPS** - Sécurisation des communications
- **Rate limiting** - Protection contre le spam
- **Cache** - Amélioration des performances
- **Monitoring** - Logs détaillés

## 📞 **Support**

Pour toute question ou problème :
1. Vérifier ce README
2. Consulter les logs du serveur
3. Tester l'API avec curl
4. Vérifier la console du navigateur

---

**🎮 Bon jeu et bonne chance pour atteindre le sommet du Hall of Fame ! 🏆**
