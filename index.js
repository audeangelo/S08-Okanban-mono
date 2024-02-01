import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';

import router from './src/router.js';
import bodySanitizer from './src/middlewares/body-sanitizer.js';

const SERVER_PORT = process.env.SERVER_PORT || 3000;

const app = express();

// politique des CORS
// app.use(cors()); // j'autorise tout le monde
app.use(
  cors({
    // whitelist des origines
    origin: [
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:5173'
    ],
  })
);

// sers-moi des fichiers statiques :
// mon front qui est build dans `dist.`
app.use(express.static('dist'));

// limit rate
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 1 minutes
  max: 100000, // limite chaque IP à 100k requêtes par `window` (« fenêtre » — ici, 15 minutes)
  standardHeaders: true, // retourne les infos dans le header `RateLimit-*`
  legacyHeaders: false, // désactive les `X-RateLimit-*` headers
});
app.use(limiter);

// _body parser_ pour format `application/x-www-urlencoded`
// → données envoyées par un <form> HTML
app.use(express.urlencoded({ extended: true }));
// _body parser_ pour format `application/json`
// → données envoyées en JSON
app.use(express.json());

// appel du MW pour nettoyer le code contre injections XSS
app.use(bodySanitizer);

// je préfixe mes routes avec `/api`
app.use('/api', router);

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on: http://localhost:${SERVER_PORT}`);
});
