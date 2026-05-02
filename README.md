# Jangaat (Debug Thinking)

Jangaat est une plateforme SaaS conçue pour les développeurs juniors et les étudiants en informatique. Son but est d'accompagner les développeurs juniors dans leur raisonnement face à un bug (méthode de debug) en utilisant un mentor IA (JOOB Sensei) qui les guide sans jamais leur donner la solution finale ni le code corrigé.

## 🎯 Proposition de valeur
"Transforme ta manière de penser quand tu codes, pas juste ton code."
Le but est d'être guidé dans la réflexion, de comprendre les blocages et d'apprendre une méthode de résolution reproductible via une approche socratique interactive.

## 🏗️ Architecture Technique

Le projet suit une architecture Client-Serveur séparée :

- **Frontend** : Next.js (React), App Router, TailwindCSS.
- **Backend** : Node.js avec Express (API REST).
- **Base de données** : PostgreSQL via Prisma ORM.
- **IA** : API OpenAI (gpt-4o-mini ou gpt-3.5-turbo) pour le moteur d'analyse et le chat interactif.

## 🚀 Prérequis

- **Node.js** (v18+ recommandé)
- **PostgreSQL** (installé et en cours d'exécution)
- **Clé API OpenAI** valide

## ⚙️ Installation et Lancement

### 1. Backend

1. Naviguez dans le dossier backend :
   ```bash
   cd Main/backend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez les variables d'environnement :
   Copiez `.env.example` vers `.env` et remplissez les valeurs (`DATABASE_URL`, `OPENAI_API_KEY`).
4. Initialisez la base de données :
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Lancez le serveur de développement :
   ```bash
   npm run dev
   # ou node index.js
   ```

### 2. Frontend

1. Naviguez dans le dossier frontend :
   ```bash
   cd Main/frontend
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

*(Vous pouvez également utiliser le fichier `start.bat` fourni à la racine pour lancer les deux environnements simultanément sous Windows).*


## 💬 Discussions

L'onglet **Discussions** est activé sur ce dépôt. N'hésitez pas à l'utiliser pour poser des questions, proposer des idées ou échanger sur les méthodes de débogage.

---
*Ce projet est maintenu par JOOB.*
