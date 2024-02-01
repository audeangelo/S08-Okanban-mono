import Sortable from 'sortablejs';
import { updateCard, updateList } from './api';

const Drag = {
  init() {
    this.lists();
  },

  lists() {
    const container = document.getElementById('lists-container');
    Sortable.create(container, {
      animation: 150,
      chosenClass: 'is-success',

      /* je cible seulement quand la liste a changé de position */
      onUpdate: (event) => {
        // console.log(event);

        /*
          Notre stratégie :

          - quand l'utilisateur lâche le drag,
            on récupère la position de toutes les listes

          - pour chaque liste, on appelle l'API pour mettre
            à jour sa position → attention aux ressources (voir cours)
        */
        const listCollection = event.to.children; // → HTMLCollection ~ objet

        // POUR CHAQUE liste → `forEach` ne s'utilise que sur les tableaux
        // je transforme mon HTMLCollection en Array
        const listElements = Array.from(listCollection);
        // console.log(listElements);
        listElements.forEach(async (listElement, index) => {
          // calcul de la position : à partir de l'index de la liste dans le tableau
          // je me dis que les listes placées vont avoir une position > 0
          const position = index + 1;

          // je dois récupérer l'ID de la liste courante
          const [, listId] = listElement.id.split('-');
          
          // j'ai toutes les infos pour mettre à jour la carte
          await updateList(listId, { position });
        });
      },
    });
  },

  cards(container) {
    Sortable.create(container, {
      // rend possible le déposer dans les autres listes
      // qui partagent le même nom de groupe
      group: 'shared-lists',

      animation: 150,
      chosenClass: 'has-background-warning',

      /*
        Stratégie:

        - soit on déplace dans la même liste
          - récupérer toutes les cartes
          - calculer leur position
          - mettre à jour la BDD

          → `onUpdate`

        - soit on déplace dans une autre liste
          - récupérer les cartes de la nouvelle liste
          - calculer leur position
          - mettre à jour la BDD
          + modifier `list_id` de la carte déplacée

          → `onAdd`
      */
      onUpdate: (event) => {
        // uniquement quand changement dans la même liste
        const cardCollection = event.to.children; // → HTMLCollection ~ objet

        // POUR CHAQUE carte → `forEach` ne s'utilise que sur les tableaux
        // je transforme mon HTMLCollection en Array
        const cardElements = Array.from(cardCollection);
        
        cardElements.forEach(async (cardElement, index) => {
          // calcul de la position : à partir de l'index de la carte dans le tableau
          // je me dis que les listes placées vont avoir une position > 0
          const position = index + 1;

          // je dois récupérer l'ID de la carte courante
          const [, cardId] = cardElement.id.split('-');
          
          // j'ai toutes les infos pour mettre à jour la carte
          await updateCard(cardId, { position });
        });
      },
      onAdd: (event) => {
        // uniquement quand changement de liste
        // uniquement quand changement dans la même liste
        const cardCollection = event.to.children; // → HTMLCollection ~ objet

        // POUR CHAQUE carte → `forEach` ne s'utilise que sur les tableaux
        // je transforme mon HTMLCollection en Array
        const cardElements = Array.from(cardCollection);
        
        cardElements.forEach(async (cardElement, index) => {
          // calcul de la position : à partir de l'index de la carte dans le tableau
          // je me dis que les listes placées vont avoir une position > 0
          const position = index + 1;

          // je dois récupérer l'ID de la carte courante
          const [, cardId] = cardElement.id.split('-');

          // je transmets aussi le `list_id` pour répercuter le changement de liste
          // soit pour tous, soit je cible uniquement la carte concernée
          // l'ID de la liste conteneur est disponible de plusieurs manières :
          //   - `container`
          //   - `cardElement.closest('[slot="list-id"]')`
          //   - par rapport à l'évènement
          const [, listId] = event.to.parentNode.id.split('-');
          
          // j'ai toutes les infos pour mettre à jour la carte
          await updateCard(cardId, {
            position,
            list_id: Number(listId),
          });
        });
      },
    });
  },
};

export default Drag;
