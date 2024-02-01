# Mise en place du monorepo

## Objectif

Faire en sorte que notre serveur Express retourne
les fichiers statiques

«
  Comment fait-on pour dire à Express :
  donne-moi des fichiers statiques ?
»  
→ `app.use(express.static('folder'));`

## Idée

Sur les routes `/api`, Express utilisent l'API ;
sur les autres routes, il retourne nos fichiers statiques…

Pas n'importe lesquels : ceux de notre front  
→ le dossier `dist` qu'on _build_ avec Vite !

## On importe nos codes

### Back

C'est un serveur… on commence par rapatrier notre serveur API :

- copier/coller **
- git
- …

> si nécessaire, on installe les dépendances et
> on n'oublie pas le `.env`

→ on teste en lançant le serveur : l'API doit tourner

### Front

On va **copier/coller** les fichiers/dossiers utiles :

- `index.html`
- `assets/`

On va aussi devoir **fusionner** certains fichiers :

- `.eslintrc` → node + browser / type module / ignorePatterns
- `.gitignore`
- `package.json` → modification du nom + dépendances + scripts

> les dépendances _front_ peuvent toutes être mises en
> dépendances de développement puisqu'on va _build_
>
> les packages qu'on déclare en _deps_ sont utilisées
> en production (ex: pg)  
> les packages qu'on déclare en _devDeps_ sont utilisées :
>
> - soit pour améliorer le confort de développement
>   (nodemon, eslint)
> - soit pour construire le code de production
>   (vite, bulma-toast)

→ on teste le _build_

## On fait tout fonctionner

On peut maintenant demander à Express de servir le dossier
statique `build`.

Désormais, on a plus qu'une seule adresse :
celle du serveur Express.

→ on teste <http://localhost:3000>

On note que si on modifie le code du front,
on a pas le _hot reloading_ et pire encore :
même le reload ne fonctionne pas !

Et oui, Express sert du **statiquement le dossier `build`**,
pour mettre à jour le front, il faut build à chaque fois.

> **ASTUCE** on peut ajouter un script dans le `package.json`
>
> ```json
> "build:watch": "vite build --watch"
> ```

## Une dernière chose…

On est d'accord, qu'on ne connait pas l'URL du futur site :

- okanban.io
- okanban.fr

Côté front, dans `api.js`, on appelle cette URL, comment fait-on ?  
→ les variables d'environnement !

SAUF qu'on est côté client… On a pas accès à `process.env`…  
Heureusement que Vite sait les gérer !!!  
→ <https://vitejs.dev/guide/env-and-mode>

```text
# file .env
VITE_API_BASE_URL=http://localhost:3000
```

> on doit préfixer par `VITE_` pour l'exposer au front

```js
// @file api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```
