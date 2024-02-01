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
