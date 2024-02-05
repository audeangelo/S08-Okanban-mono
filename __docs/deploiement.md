# Déploiement : projet `Node.js` avec une base de données `Postgres`

## Se connecter en SSH à une VM Kourou

Les adresses SSH et HTTP des VM Kourou se trouvent sur la page [Page d'administration de ta machine virtuelle](https://kourou.oclock.io/ressources/vm-cloud)


```bash
# Se connecter depuis son Téléporteur 
ssh student@<username>-server.eddi.cloud # confirmer : "yes"
```

Notes : 
- mot de passe `sudo` (root user) : `par dessus les nuages`
- les caractères entrés ne s'affichent généralement pas, pour des raisons de sécurité, mais sont bien pris en compte.

## Gérer un système Linux (Ubuntu)

```bash
# Info système
uname -a            # information système
uname -r            # version du kernel (coeur)
whoami              # nom de l'utilisateur courant
lsb_release -a      # version d'Ubuntu
hostname            # nom de l'hôte
df -h               # espace disque
free -h             # mémoire (RAM)

# Mettre à jour la liste des packages Linux
sudo apt update     # mot de passe : "par dessus les nuages"

# (❗️ Ne pas faire) Mettre à jour les packages déjà installés
sudo apt upgrade    # ❗️ ne pas faire
```

## Créer une clé SSH et la déclarer auprès d'un dépôt Github

Objectif : pouvoir cloner un dépôt Github depuis sa VM Kourou.

```bash
# Se déplacer dans le répertoire utilisateur
cd ~

# Créer une paire de clé SSH privé et publique
ssh-keygen -t ed25519 -C "votre_email_github" # valider 3 fois avec la toucher ENTRÉE (laisser les champs vide)

# Vérifier la présence des clés générées
ls ~/.ssh # les fichiers 'id_ed25519.pub' (publique) & 'id_ed25519' (privée) sont présentes

# Démarrer l'agent SSH
eval "$(ssh-agent -s)"

# Ajouter la clé privée à l'agent SSH
ssh-add ~/.ssh/id_ed25519

# Afficher la clé publique
cat ~/.ssh/id_ed25519.pub # la copier (la ligne entière !)
```

- Ouvrir le dépôt Github à cloner : 
  - `https://github.com/O-clock-Kimchi/S08-Okanban-mono`

- Se rendre dans les `Préférence du dépôt` > `Deploy Key`
  - `https://github.com/O-clock-Kimchi/S08-Okanban-mono/settings/keys`

- Ajouter une clé de déploiement (`Add deploy key`) : 
  - **Titre** : `VM Kourou` (par exemple !)
  - **Key** : Coller le contenu du fichier `id_ed25519.pub` généré à l'étape précédente
  - **Key** : Laisser décocher (on ne code pas depuis la prod)

- Cloner le dépôt depuis la VM Kourou : 
  - `cd ~`
  - `git clone git@github.com/O-clock-Kimchi/S08-Okanban-mono`
  - valider avec `yes` si besoin

  ## Installer Postgres et `psql` (via `apt`)

```bash
# Vérifier que Postgres n'est pas déjà installé et lancé
sudo systemctl status postgresql # confirmation : Unit postgresql.service could not be found.

# Installer Postgres
sudo apt install -y postgresql  # l'option '-y' permet de confirmer automatiquement

# ❗️ En cas de prompt à propos à propos d'un update Kernel (Version 5 -> Version 6)
# - "Newer kernel available" : valider avec la touche ENTRÉE
# - "Which services should be restarted?" : valider avec la touche ENTRÉE
sudo reboot # patienter 1 minute
ssh student@<username>-server.eddi.cloud # pour se reconnecter
uname -r # confirmation : version 6

# Vérifier que le serveur Postgres fonctionne
sudo systemctl status postgresql # confirmation : doit être 'active'
```

## Gestion de bases de données Postgres

```bash
# Se connecter au serveur en tant qu'utilisateur 'postgres'
sudo -i -u postgres psql

# Information serveur
\l    # lister les base de données existantes
\du   # lister les utilisateurs existants
\c    # vérifier la connexion courante

# Créer un utilisateur (ex: okanban)
CREATE ROLE okanban WITH LOGIN PASSWORD 'okanban';

# Créer une base de données (ex: okanban)
CREATE DATABASE okanban WITH OWNER okanban;

# Quitter psql
exit
```

## Installer `Node` (via `NVM`)

```bash
# Vérifier si Node n'est pas déjà installé
node -v  # Command 'node' not found
nvm -v   # Command 'nvm' not found

# Installer NVM (docs: https://github.com/nvm-sh/nvm)
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Exécuter les 3 commandes proposées (a priori celle-ci, mais à copier depuis le terminal)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Validation
nvm -v  # la version de NVM s'affiche

# Installer Node 20 et choisir comme version par défaut
nvm install 20
nvm use 20
nvm alias default 20

# Validation
node -v # la version 20 est bien installé
```

## Déployer un projet cloné

**Pré-requis** : 
- `Node.js` installé
- `Postgres` installé, lancé
- Dépôt cloné

**Conventions** : par simplicité pour la suite de l'exemple, on suppose que : 
- l'utilisateur Postgres `okanban` et la BDD `okanban` ont été créés
- le dépôt est cloné dans le répertoire utilisateur `~`
- le dépôt se nomme `S08-Okanban-mono`
- le dépôt contient un script `~/S08-Okanban-mono/data/create_tables.sql`
- le dépôt contient un fichier `.env.example` à dupliquer
- le dépôt contient un `package.json` avec les commandes suivantes : 
  - `npm run build` : construit le bundle client
  - `npm run start` : démarre le projet

### Exécuter un script SQL

```bash
# Exécution d'un script - création des tables
psql -h localhost -U okanban -d okanban -f ~/S08-Okanban-mono/data/create_tables.sql # mot de passe : okanban

# Exécution d'un script - seeding
psql -h localhost -U okanban -d okanban -f ~/S08-Okanban-mono/data/seed_tables.sql # mot de passe : okanban

# Note :
# - l'option '-h localhost' permet de bypass le mode de connexion par défaut (peer authentication)
# - autrement, on aurait l'erreur : `psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL:  Peer authentication failed for user "database_user"`

# Vérification
psql -U okanban -d okanban -h localhost
\dt # liste les tables présentes dans la BDD courante
```


### Déploiement

```bash
# Se déplacer dans le dépôt
cd ~/S08-Okanban-mono

# Installer les dépendances du projet
npm install

# Copier le fichier d'environnement d'exemple
cp .env.example .env

# Ajuster les variables d'environnemnts (avec nano)
nano .env

# Exemple de valeurs :
# PORT=3000
# PG_URL=postgres://okanban:okanban@localhost:5432/okanban
# DB_HOST=localhost
# DB_NAME=okanban
# DB_USER=okanban
# DB_PWD=okanban
# DB_DRIVER=postgres
# VITE_API_BASE_URL=http://<username>-server.eddi.cloud:3000/api  # Pas de / final

# Enregistrer et quitter nano
# ^O (ie, CTRL + O) puis ENTER : sauvegarder
# ^X (ie, CTRL + X) : quitter

# Build le client
npm run front:build

# Démarrer le serveur 
node index.js
```

Depuis la machine sur laquelle est ouvert la [Page d'administration de ta machine virtuelle](https://kourou.oclock.io/ressources/vm-cloud), ouvrir un navigateur et accéder à la ressource : 
- `http://<username>-server.eddi.cloud:3000/api/lists` : l'API tourne
- `http://<username>-server.eddi.cloud:3000/` : le front fonctionne

## Lancer le projet via `pm2`

Objectifs : 
- faire tourner notre projet `node` en tâche de fond
- relancer automatiquement le projet `node` en cas de redemarrage de la VM Kourou

```bash
# Installer pm2
npm install -g pm2

# Retourner dans le projet
cd ~/S08-Okanban-mono

# Redémarrer le projet via pm2
pm2 start index.js --name okanban

# Lister les processus pm2
pm2 list

# Générer et appliquer un script de démarrage automatique en cas de redemarrage système
pm2 startup 
# ❗️ exécuter le commande fournie, par exemple : sudo env PATH=$PATH:/home/student/.nvm/versions/node/v20.11.0/bin /home/student/.nvm/versions/node/v20.11.0/lib/node_modules/pm2/bin/pm2 startup systemd -u student --hp /home/student

# Validation
sudo reboot # patienter puis tester que l'application tourne toujours
```


## Mise en place d'un reverse proxy `Nginx`

Objectifs : 
- servir le projet `okanban` sur un sous domaine
- servir le projet `okanban` sur le port 80 rendu publique

### Rendre publique le port 80 de la VM Kourou

Sur la page d'administration des VM, cliquer sur `Rendre la VM publique`, ce qui permet d'ouvrir au reste du monde les ports : 
- `80` : port par défaut de HTTP
- `443` : port par défaut de HTTPS
- `8080` et `8443` : ports communément utilisés

### Installer Nginx

```bash
# Installer Nginx
sudo apt update
sudo apt install -y nginx

# Vérifier l'installation
sudo systemctl status nginx # devrait être 'active'

# Vérifier que le serveur Nginx peut-être atteint sur le port 80: 
curl http://<username>-server.eddi.cloud
```


### Configurer Nginx comme reverse proxy

```bash
# Se déplacer dans le dossier de configuration nginx
cd /etc/nginx

# Créer une configuration pour notre sous domaine Okanban
sudo nano /etc/nginx/sites-available/okanban.conf # ❗️ copier la configuration fournie plus bas, enregistrer puis quitter nano

# Créer un lien symbolique pour activer cette configuration
sudo ln -s /etc/nginx/sites-available/okanban.conf /etc/nginx/sites-enabled/okanban.conf

# Valider la syntaxe de la configuration
sudo nginx -t

# Relancer nginx
sudo systemctl reload nginx

# Tester
curl http://okanban.<username>-server.eddi.cloud/
```

```
# Configuration pour Okanban à coller dans un fichier /etc/nginx/sites-available/okanban.conf

server {
  listen 80;
  server_name okanban.<username>-server.eddi.cloud;
  location / {
    proxy_pass      http://localhost:3000;
  }
}
```