const Modal = {
  closingElements: document.querySelectorAll('.close, #modal-bg'),

  init() {
    this.closingElements.forEach((element) => {
      element.addEventListener('click', this.close);
    });
  },

  open(modal) {
    modal.classList.add('is-active');
  },

  close() {
    document.querySelector('.modal.is-active')
      .classList.remove('is-active');
  }
};

export default Modal;
