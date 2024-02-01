import { toast } from 'bulma-toast';

import 'animate.css';

/**
 * Récupère les données d'un formulaire et les renvoie en objet
 * 
 * @param {HTMLFormElement} form 
 * @returns {object}
 */
export function getDataFromForm(form) {
  return Object.fromEntries(new FormData(form));
}

/**
 * Prends une couleur hexadécimale et la retourne sur 6 caractères
 * 
 * @param {string} color
 * @returns {string}
 * 
 * @example
 * hexColor('#b0b') → '#bb00bb'
 * hexColor('#ffaabb') → '#ffaabb'
 */
export function hexColor6(color) {
  if (color.length === 7) {
    return color;
  }

  const hex3 = color.substring(1);
  const hex6 = hex3.split('').map((hex) => hex + hex).join('');

  return `#${hex6}`;
}

export function displayError(message) {
  toast({
    message,
    type: 'is-danger',
    duration: 3000,
    position: 'top-center',
    dismissible: true,
    pauseOnHover: true,

    animate: { in: 'fadeIn', out: 'fadeOut' },
  });
}
