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
