/* eslint-disable quotes */
// SoC : on ne fait que des appels API dans ce fichier
// (pas d'affichage)

import { displayError } from './utils.js';

const API_BASE_URL = 'http://localhost:3000/api';

export async function fetchLists() {
  // console.log('fetch lists');
  try {
    const response = await fetch(`${API_BASE_URL}/lists`); // GET
    // console.log(response);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Non trouvé');
      }
      
      // je déclenche une erreur manuelle, qui sera capturée par le `catch`
      throw new Error('Problème de connexion');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
  
    const msg = `
      Le serveur ne répond pas. Merci de ré-essayer ultérieurement.
      [Error message: ${error.message}]
    `;
    displayError(msg);
  }
}

export async function postList(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/lists`, {
      method: 'POST', // je veux la route `POST /lists`
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errors = (await response.json()).errors;
        console.log(errors);
        
        const errorMessage = `
          La requête n'est pas dans un format attendu. Merci de corriger les erreurs :
          - ${errors.join("\n- ")}
        `;

        throw new Error(errorMessage);
      }

      throw new Error(response.statusText);
    }
    
    return await response.json();
  } catch (error) {
    console.error(error);

    const msg = `
      Une erreur est survenue. Merci de ré-essayer ultérieurement.
      [Error message: ${error.message}]
    `;
    displayError(msg);
  }
}

export async function updateList(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/lists/${id}`, {
      method: 'PATCH', // je veux la route `PATCH /lists/:id`
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errors = (await response.json()).errors;
        console.log(errors);
        
        const errorMessage = `
          La requête n'est pas dans un format attendu. Merci de corriger les erreurs :
          - ${errors.join("\n- ")}
        `;

        throw new Error(errorMessage);
      }

      throw new Error(response.statusText);
    }
    
    return await response.json();
  } catch (error) {
    console.error(error);

    const msg = `
      Une erreur est survenue. Merci de ré-essayer ultérieurement.
      [Error message: ${error.message}]
    `;
    displayError(msg);
  }
}

export async function postCard(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/cards`, {
      method: 'POST', // je veux la route `POST /cards`
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errors = (await response.json()).errors;
        console.log(errors);
        
        const errorMessage = `
          La requête n'est pas dans un format attendu. Merci de corriger les erreurs :
          - ${errors.join("\n- ")}
        `;

        throw new Error(errorMessage);
      }

      throw new Error(response.statusText);
    }
    
    return await response.json();
  } catch (error) {
    console.error(error);

    const msg = `
      Une erreur est survenue. Merci de ré-essayer ultérieurement.
      [Error message: ${error.message}]
    `;
    displayError(msg);
  }
}

export async function updateCard(id, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
      method: 'PATCH', // je veux la route `PATCH /cards/:id`
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errors = (await response.json()).errors;
        console.log(errors);

        const errorMessage = `
          La requête n'est pas dans un format attendu. Merci de corriger les erreurs :
          - ${errors.join("\n- ")}
        `;

        throw new Error(errorMessage);
      }

      throw new Error(response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error(error);

    const msg = `
      Une erreur est survenue. Merci de ré-essayer ultérieurement.
      [Error message: ${error.message}]
    `;
    displayError(msg);
  }
}

export async function deleteCard(id) {
  try {

    const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
      method: 'DELETE',
    });

    // je veux retourner un booléen :
    // - true si pas d'erreur
    // - false sinon
    // → je peux directement retourner la réponse de l'API
    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}
