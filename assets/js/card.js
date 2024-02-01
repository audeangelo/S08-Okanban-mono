import Modal from './modal.js';

import { deleteCard, postCard, updateCard } from './api.js';
import { getDataFromForm, hexColor6 } from './utils.js';

const Card = {
  addModalElement: document.getElementById('add-card-modal'),
  editModalElement: document.getElementById('edit-card-modal'),
  deleteModalElement: document.getElementById('delete-card-modal'),

  init() {
    // gestion du formulaire d'ajout : soumission
    this.addModalElement.querySelector('form')
      .addEventListener('submit', this.save);

    // gestion du formulaire d'édition : soumission
    this.editModalElement.querySelector('form')
      .addEventListener('submit', this.update);

    // gestion du formulaire de suppression : soumission
    this.deleteModalElement.querySelector('form')
      .addEventListener('submit', this.delete);
  },

  /**
   * Crée une carte et l'insère dans le DOM
   * 
   * @param {Object} card
   * @param {number} card.id
   * @param {number} card.list_id
   * @param {string} card.content
   * @param {string} card.color
   */
  create({ id, list_id, content, color }) {
    const template = document.getElementById('card-template');
    const clone = template.content.cloneNode(true);
    
    clone.querySelector('[slot="card-id"]').id = `card-${id}`;
    clone.querySelector('[slot="card-id"]').style.border = `1px solid ${color}`;

    clone.querySelector('[slot="card-content"]').textContent = content;

    const editCardButton = clone.querySelector('[slot="edit-card-button"]');
    
    editCardButton.addEventListener('click', () => {
      // console.log(content, color);
      // je transmets l'ID actuel par les data-attributes
      Card.editModalElement.dataset.id = id;
      // je renseigne le contenu actuel
      Card.editModalElement.querySelector('input[name="content"]')
        .value = content;
      // je renseigne la couleur actuelle
      // note : par défaut dans ma BDD, j'ai des valeurs hexadécimales
      // avec 3 caractères (`#fab`), il en faut 6 (`#ffaabb`) pour l'input
      Card.editModalElement.querySelector('input[name="color"]')
        .value = hexColor6(color);
      // j'ouvre la modale d'édition
      Modal.open(Card.editModalElement);
    });

    const deleteCardButton = clone.querySelector('[slot="delete-card-button"]');

    deleteCardButton.addEventListener('click', () => {
      // Card.delete(id); // on passe par ine modale de confirmation
      
      // je transmets l'ID actuel par les data-attributes
      Card.deleteModalElement.dataset.id = id;
      // j'ouvre la modale
      Modal.open(Card.deleteModalElement);
    });
    
    // je sélectionne la liste et je l'ajoute au début (prepend)
    document.querySelector(`#list-${list_id} [slot="list-content"]`)
      .prepend(clone);
  },

  /**
   * Ajoute une carte en BDD
   * 
   * @param {SubmitEvent} event
   */
  async save(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = getDataFromForm(form);

    // je dois récupérer l'id de la liste
    // dans les data-attribute de la modale
    // console.log(this); // Attention, this est le formulaire soumis
    const listId = Card.addModalElement.dataset.listId;

    // je l'ajoute aux données de formulaire
    const savedCard = await postCard({
      ...data, // je déverse toutes les données de formulaire
      list_id: Number(listId), // j'ajoute l'ID de la liste
    });

    if (!savedCard) {
      return;
    }

    // console.log(this); // Attention, this est le formulaire soumis
    Card.create(savedCard);

    form.reset();
    Modal.close();
  },

  /**
   * Édite une carte en BDD
   * 
   * @param {SubmitEvent} event
   */
  async update(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = getDataFromForm(form);

    const cardId = Card.editModalElement.dataset.id;

    const updatedCard = await updateCard(cardId, data);
    console.log(updatedCard);

    if (!updatedCard) {
      return;
    }

    // mise à jour de l'interface
    const { color, content } = updatedCard;
    const thisCard = document.querySelector(`#card-${cardId}`);

    thisCard.style.border = `1px solid ${color}`;
    thisCard.querySelector('[slot="card-content"]').textContent = content;

    form.reset();
    Modal.close();
  },

  /**
   * Supprime une carte en BDD
   * 
   * @param {SubmitEvent} event
   */
  async delete(event) {
    event.preventDefault();
    
    const cardId = Card.deleteModalElement.dataset.id;

    const isDeleted = await deleteCard(cardId);

    if (!isDeleted) {
      return;
    }

    // mise à jour de l'interface
    document.querySelector(`#card-${cardId}`).remove();
    Modal.close();
  },

  /**
   * Affiche la modale d'ajout d'une carte
   */
  displayAddModal(listId) {
    // je transmets l'ID de la liste à la modale via ses data-attributes
    // → HTML : `<div class="modal" id="add-card-modal" data-list-id="1234">`
    this.addModalElement.dataset.listId = listId;
    Modal.open(this.addModalElement);
  },
};

export default Card;
