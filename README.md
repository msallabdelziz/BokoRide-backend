# BokoRide - Backend API

Bienvenue dans le backend de **BokoRide**, une plateforme de covoiturage innovante pensée pour le Sénégal et l'Afrique de l'Ouest. Ce backend gère l’ensemble des fonctionnalités essentielles telles que la gestion des utilisateurs, des trajets, des rôles, du chat en temps réel et de l’authentification sécurisée via JWT.

---

## 🚀 Technologies utilisées

- **Node.js** - Environnement serveur
- **Express.js** - Framework web léger pour Node
- **MongoDB + Mongoose** - Base de données NoSQL et ORM
- **JWT** - Authentification sécurisée
- **Socket.IO** - Chat en temps réel
- **bcryptjs** - Hachage des mots de passe
- **express-validator** - Validation des entrées
- **dotenv** - Gestion des variables d'environnement

---

---

## 📌 Fonctionnalités principales

- 🔐 **Authentification sécurisée avec JWT**
- 👤 **Gestion des utilisateurs** (inscription, login, profil, suppression)
- 🚗 **Création, mise à jour et suppression de trajets**
- 💬 **Chat en temps réel entre chauffeurs et passagers**
- ⭐ **Système d’évaluation des chauffeurs**
- 🛡️ **Système de rôles** : `user`, `chauffeur`, `admin`, `superadmin`

---

## 🔧 Installation et lancement

### 1. Cloner le projet

```bash
git clone <repo_url>
cd BokoRide-backend


2. Installer les dépendances
bash
Copier
Modifier
npm install
3. Créer un fichier .env
env
Copier
Modifier
PORT=5000
MONGO_URI=mongodb://localhost:27017/bokoride
JWT_SECRET=ton_secret_jwt
4. Lancer le serveur
bash
Copier
Modifier
npm run dev
🛣️ API Endpoints principaux
🔐 Authentification
POST /api/users/register - Inscription

POST /api/users/login - Connexion

GET /api/users/profile - Affichage du profil

PUT /api/users/update - Mise à jour profil

🚗 Trajets
POST /api/rides/create - Créer un trajet (chauffeurs)

GET /api/rides - Voir les trajets disponibles

PUT /api/rides/update/:rideId - Modifier un trajet

DELETE /api/rides/delete/:rideId - Supprimer un trajet

💬 Chat
POST /api/chat/send - Envoyer un message

GET /api/chat/:userId - Récupérer les messages d'un utilisateur

⚙️ Middleware
authMiddleware : vérifie le token JWT

roleMiddleware : restreint l'accès aux routes selon le rôle (admin, chauffeur, etc.)

📦 Déploiement
Le backend peut être facilement déployé sur des plateformes comme :

Heroku

Render

Railway

AWS EC2 / Lightsail

DigitalOcean

👨‍💻 Auteur
Mamadou Abdel AZIZ SALL
📧 msall.abdelaziz@gmail.com

📄 Licence
Ce projet est sous licence MIT.


