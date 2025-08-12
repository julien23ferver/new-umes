# Modification du Cyber Quizz

Ce document détaille la procédure de modification du contenu du jeu `dico.html`.

## Contexte Technique

Le jeu est une application web statique contenue dans un unique fichier HTML (`dico.html`). L'ensemble de la logique, des styles et du contenu, y compris les questions, est encapsulé dans ce fichier. Les données des questions sont stockées dans une structure de données JavaScript.

## Procédure de Modification

### 1. Localisation des Données

Les questions sont définies dans une constante JavaScript nommée `questions`, située dans la balise `<script>` à la fin du document `dico.html`.

### 2. Structure de l'Objet `question`

L'objet `questions` est une map dont les clés sont les niveaux de difficulté (`facile`, `intermediaire`, `difficile`, `nexus`). Chaque niveau contient un tableau d'objets, où chaque objet représente une question et respecte la structure suivante :

```javascript
{
    id: "string",           // Identifiant unique (ex: "f_1")
    term: "string",         // Thème de la question
    question: "string",     // Intitulé de la question (FR)
    questionEn: "string",   // Intitulé de la question (EN)
    options: ["", "", "", ""], // Tableau de 4 réponses (FR)
    optionsEn: ["", "", "", ""], // Tableau de 4 réponses (EN)
    correct: number,        // Index (0-3) de la réponse correcte
    explanation: "string",  // Explication post-réponse (FR)
    explanationEn: "string" // Explication post-réponse (EN)
}
```

### 3. Opérations CRUD

Les modifications s'effectuent directement sur cet objet JavaScript.

-   **Modification :** Éditer les valeurs des clés de l'objet souhaité.
-   **Ajout :** Insérer un nouvel objet question dans le tableau du niveau de difficulté approprié, en respectant la structure et en assurant l'unicité de l'`id`.
-   **Suppression :** Retirer l'objet question du tableau.

### 4. Déploiement

Les modifications sont effectives dès la sauvegarde du fichier `dico.html`. Il suffit de rafraîchir la page dans un navigateur pour visualiser les changements. Il est recommandé de s'assurer que l'encodage du fichier reste en UTF-8.
