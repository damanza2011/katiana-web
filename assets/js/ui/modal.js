/**
 * KATIANA Droguería Online · Modal Controller
 */

export class ModalController {
  constructor(overlaySelector) {
    this.overlay = document.querySelector(overlaySelector);
    this.closeButtons = this.overlay ? this.overlay.querySelectorAll('[data-close-modal]') : [];
    this.bindEvents();
  }

  bindEvents() {
    if (!this.overlay) return;

    this.closeButtons.forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  open() {
    if (!this.overlay) return;
    this.overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  isOpen() {
    return this.overlay ? this.overlay.classList.contains('open') : false;
  }
}
