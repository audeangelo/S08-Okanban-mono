import Modal from './modal.js';
import Card from './card.js';
import Drag from './drag.js';

import { fetchLists, postList, updateList } from './api.js';
import { getDataFromForm } from './utils.js';

const List = {
  parent: document.getElementById('lists-container'),
  
  addModalElement: document.getElementById('add-list-modal'),
  editModalElement: document.getElementById('edit-list-modal'),
  
  init() {
    this.display();
    this.displayAddModal();
    
    // gestion du formulaire d'ajout : soumission
    this.addModalElement.querySelector('form')
      .addEventListener('submit', this.save);
    
    // gestion du formulaire d'édition : soumission
    this.editModalElement.querySelector('form')
      .addEventListener('submit', this.update);
  },
  
  /**
  * Récupère les listes et les ajoute au DOM
  */
  async display() {
    const lists = await fetchLists();
    
    // lists.forEach((list) => {
    //   this.create(list);
    // });
    // Attention le callback n'pas de contexte
    // → this = undefined
    // Je peux lui en donner un avec un 2 argument à forEach
    // > https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#thisarg
    // lists.forEach(this.create, this);
    
    lists.forEach((list) => {
      this.create(list);
      
      // j'affiche les cartes par liste
      // list.cards.forEach((card) => {
      //   Card.create(card);
      // });

      // la méthode `Card.create()` « prepend » les cartes
      // i.e., la dernière créée se retrouve en haut de la liste…
      // on veut les classer par position, je retourne mon tableau
      list.cards.reverse().forEach(Card.create);
    });
  },
  
  /**
  * Crée une liste et l'insère dans le DOM
  * 
  * @param {object} list
  * @param {number} list.id
  * @param {string} list.name
  */
  create({ id, name }) {
    const template = document.getElementById('list-template');
    const clone = template.content.cloneNode(true);
    
    clone.querySelector('[slot="list-name"]').textContent = name;
    
    const editListButton = clone.querySelector('[slot="edit-list-button"]');
    
    editListButton.addEventListener('click', () => {
      // je transmets l'ID actuel par les data-attributes
      this.editModalElement.dataset.id = id;
      // je renseigne le nom actuel de la liste
      // this.editModalElement.querySelector('input[name="old_name"]').value = name; // BUG
      // je vais chercher « en direct » le nom de la liste (utile quand mise à jour)
      const currentName = document.querySelector(`#list-${id} [slot="list-name"]`).textContent;
      this.editModalElement.querySelector('input[name="old_name"]').value = currentName;
      // j'ouvre ma modale
      Modal.open(this.editModalElement);
    });
    
    const addCardButton = clone.querySelector('[slot="add-card-button"]');
    
    addCardButton.addEventListener('click', () => {
      // const currentListId = event.currentTarget.closest('[slot="list-id"]').id;
      
      // document.querySelector('input[type="hidden"][name="list_id"]')
      //   .value = currentListId.split('-')[1];
      
      // au moment d'appeler la modale pour ajouter une carte,
      // j'ai à disposition l'ID de la liste (`create({ id, name })`) ;
      // je peux le passer à ma modale au moment de son affichage
      // (comme argument de la méthode `displayAddModal`)
      Card.displayAddModal(id);
    });

    // j'ajoute le code pour le drag'n'drop
    Drag.cards(clone.querySelector('[slot="list-content"]'));
    
    clone.querySelector('[slot="list-id"]')
      .id = `list-${id}`;
    
    // console.log(this);
    this.parent.append(clone);
  },
  
  /**
  * Ajoute une liste en BDD
  * 
  * @param {SubmitEvent} event
  */
  async save(event) {
    event.preventDefault();
    
    const form = event.currentTarget;
    const data = getDataFromForm(form);
    
    const savedList = await postList(data);
    
    if (!savedList) {
      // il y a eu une erreur, je m'arrête là
      return;
    }
    
    // console.log(this); // Attention, this est le formulaire soumis
    List.create(savedList);
    
    form.reset();
    Modal.close();
  },
  
  /**
  * Édite une liste en BDD
  * 
  * @param {SubmitEvent} event
  */
  async update(event) {
    event.preventDefault();
    
    const form = event.currentTarget;
    const data = getDataFromForm(form);
    
    // je dois récupérer l'ID de la liste depuis les data-attributes
    const listId = List.editModalElement.dataset.id;
    
    const updatedList = await updateList(listId, data);
    console.log(updatedList);
    
    if (!updatedList) {
      return;
    }
    
    // je mets à jour la liste…
    // je cible le bon élément et je change son texte
    // → dans ma liste #id, l'élément qui la classe `.list-name` ou le slot
    // document.querySelector(`#list-${listId} .list-name`)
    document.querySelector(`#list-${listId} [slot="list-name"]`)
      .textContent = updatedList.name;
    
    form.reset();
    Modal.close();
  },
  
  /**
  * Affiche la modale d'ajout d'une liste
  */
  displayAddModal() {
    document.getElementById('add-list-button')
      .addEventListener('click', () => {
        Modal.open(this.addModalElement);
      });
  },
};

export default List;
