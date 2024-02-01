import Card from './card.js';
import List from './list.js';
import Modal from './modal.js';
import Drag from './drag.js';

// je peux aller chercher le CSS dans le module Bulma
// import 'bulma/css/bulma.min.css';
// ou
// installer les dépendances manquantes signalées par Vite
// → ici Bulma utilise par défaut du SASS
// qui doit être transformé en CSS par Vite
import 'bulma';
import '../css/style.css'; // j'importe (après) mon style

Modal.init();
List.init();
Card.init();
Drag.init();
