/**
 * KATIANA Droguería Online · Prescription Upload Controller
 * Benchmark Farmatodo & Cruz Verde
 */

import { CONFIG } from '../core/config.js';
import { toast } from './toast.js';

export class PrescriptionController {
  constructor() {
    this.modal = document.querySelector('#prescription-modal');
    this.openBtns = document.querySelectorAll('[data-action="open-prescription"]');
    this.dropzone = document.querySelector('#prescription-dropzone');
    this.fileInput = document.querySelector('#prescription-file-input');
    this.filePreview = document.querySelector('#prescription-file-preview');
    this.fileNameDisplay = document.querySelector('#prescription-file-name');
    this.removeFileBtn = document.querySelector('#prescription-remove-file');
    this.form = document.querySelector('#prescription-form');
    this.currentFile = null;

    this.bindEvents();
  }

  bindEvents() {
    this.openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    if (this.dropzone && this.fileInput) {
      this.dropzone.addEventListener('click', () => this.fileInput.click());

      this.dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        this.dropzone.classList.add('dragover');
      });

      this.dropzone.addEventListener('dragleave', () => {
        this.dropzone.classList.remove('dragover');
      });

      this.dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        this.dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          this.handleFile(e.dataTransfer.files[0]);
        }
      });

      this.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          this.handleFile(e.target.files[0]);
        }
      });
    }

    if (this.removeFileBtn) {
      this.removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.clearFile();
      });
    }

    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitPrescription();
      });
    }
  }

  handleFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.info('Formato no válido', 'Por favor sube una imagen JPG, PNG o archivo PDF de la fórmula.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.info('Archivo muy pesado', 'El tamaño máximo permitido es 10MB.');
      return;
    }

    this.currentFile = file;
    if (this.dropzone) this.dropzone.style.display = 'none';
    if (this.filePreview && this.fileNameDisplay) {
      this.fileNameDisplay.textContent = `${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
      this.filePreview.style.display = 'flex';
    }
  }

  clearFile() {
    this.currentFile = null;
    if (this.fileInput) this.fileInput.value = '';
    if (this.filePreview) this.filePreview.style.display = 'none';
    if (this.dropzone) this.dropzone.style.display = 'block';
  }

  open() {
    if (this.modal) {
      this.modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('open');
      document.body.style.overflow = '';
      this.clearFile();
    }
  }

  submitPrescription() {
    if (!this.currentFile) {
      toast.info('Adjunta tu fórmula', 'Sube una foto o PDF de la prescripción médica para continuar.');
      return;
    }

    const patientName = document.querySelector('#rx-patient-name')?.value || 'Paciente';
    const patientDoc = document.querySelector('#rx-patient-doc')?.value || 'No indicado';
    const patientPhone = document.querySelector('#rx-patient-phone')?.value || '';
    const coverage = document.querySelector('input[name="rx-type"]:checked')?.value || 'Particular';

    this.close();
    toast.success('¡Fórmula Médica Recibida!', 'Un regente farmacéutico está validando tu receta y te contactará en breve.');

    // Enlace con WhatsApp para agilizar
    const msg = `📋 *SOLICITUD DE DISPENSACIÓN CON FÓRMULA MÉDICA - KATIANA*\n` +
      `*Paciente:* ${patientName}\n` +
      `*Documento:* ${patientDoc}\n` +
      `*Teléfono:* ${patientPhone}\n` +
      `*Modalidad:* ${coverage}\n` +
      `*Archivo adjunto:* ${this.currentFile.name}\n\n` +
      `_He enviado mi fórmula a través del portal web de Droguería Katiana._`;

    const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 800);
  }
}
