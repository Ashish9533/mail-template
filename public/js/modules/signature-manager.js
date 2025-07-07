export class SignatureManager {
    constructor() {
        this.builder = null;
        this.modal = null;
        this.canvas = null;
        this.ctx = null;
        this.drawing = false;
        this.activeTab = 'draw';
        this.selectedFont = 'Great Vibes, cursive';
        this.targetElement = null;
    }

    async init(builder) {
        this.builder = builder;
        this.modal = document.getElementById('signatureModal');
        this.canvas = document.getElementById('signatureCanvas');
        if (!this.modal || !this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.loadFontOptions();
    }

    setupEventListeners() {
        // Modal controls
        document.getElementById('closeSignatureModal').addEventListener('click', () => this.hideModal());
        document.getElementById('applySignatureBtn').addEventListener('click', () => this.applySignature());

        // Tabs
        this.modal.querySelectorAll('.signature-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });

        // Draw tab
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        document.getElementById('clearSignatureCanvas').addEventListener('click', () => this.clearCanvas());

        // Type tab
        document.getElementById('signatureTextInput').addEventListener('input', (e) => this.updateTypedSignaturePreview(e.target.value));

        // Upload tab
        const dropzone = document.getElementById('signatureUploadDropzone');
        const fileInput = document.getElementById('signatureUploadInput');
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => e.preventDefault());
        dropzone.addEventListener('drop', (e) => this.handleFileUpload(e));
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    }

    showModal(element) {
        this.targetElement = element;
        this.modal.classList.remove('hidden');
    }

    hideModal() {
        this.modal.classList.add('hidden');
        this.clearCanvas();
        // Reset other states if necessary
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        // Update tab UI
        this.modal.querySelectorAll('.signature-tab').forEach(tab => {
            tab.classList.toggle('active-tab', tab.dataset.tab === tabName);
        });
        // Update pane UI
        this.modal.querySelectorAll('.signature-tab-pane').forEach(pane => {
            pane.classList.toggle('hidden', pane.id !== `${tabName}Tab`);
        });
    }

    // --- Drawing Logic ---
    startDrawing(e) {
        this.drawing = true;
        this.ctx.beginPath();
        this.ctx.moveTo(e.offsetX, e.offsetY);
    }
    stopDrawing() {
        this.drawing = false;
        this.ctx.closePath();
    }
    draw(e) {
        if (!this.drawing) return;
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.stroke();
    }
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // --- Typing Logic ---
    loadFontOptions() {
        const fonts = [
            { name: 'Great Vibes', family: 'Great Vibes, cursive' },
            { name: 'Sacramento', family: 'Sacramento, cursive' },
            { name: 'Dancing Script', family: 'Dancing Script, cursive' },
            { name: 'Arial', family: 'Arial, sans-serif' },
        ];
        const container = document.getElementById('signatureFontOptions');
        container.innerHTML = fonts.map(font => `
            <div class="signature-font-preview" style="font-family: ${font.family};" data-font="${font.family}">
                ${font.name}
            </div>
        `).join('');

        container.querySelectorAll('.signature-font-preview').forEach(el => {
            el.addEventListener('click', () => {
                this.selectedFont = el.dataset.font;
                // Update UI selection
                container.querySelectorAll('.signature-font-preview').forEach(innerEl => innerEl.classList.remove('selected'));
                el.classList.add('selected');
                this.updateTypedSignaturePreview(document.getElementById('signatureTextInput').value);
            });
        });
        // Select first font by default
        container.querySelector('.signature-font-preview').classList.add('selected');
    }

    updateTypedSignaturePreview(text) {
        const input = document.getElementById('signatureTextInput');
        input.style.fontFamily = this.selectedFont;
        input.style.fontSize = '2rem';
    }

    // --- Upload Logic ---
    handleFileUpload(e) {
        e.preventDefault();
        const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('signatureImagePreview').src = e.target.result;
                document.getElementById('signaturePreviewContainer').classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    }

    // --- Apply Logic ---
    applySignature() {
        if (!this.targetElement) return;

        let signatureHtml = '';
        if (this.activeTab === 'draw') {
            const dataUrl = this.canvas.toDataURL();
            signatureHtml = `<img src="${dataUrl}" alt="Signature" style="max-width: 250px;">`;
        } else if (this.activeTab === 'type') {
            const text = document.getElementById('signatureTextInput').value;
            signatureHtml = `<div style="font-family: ${this.selectedFont}; font-size: 2rem;">${text}</div>`;
        } else if (this.activeTab === 'upload') {
            const imgSrc = document.getElementById('signatureImagePreview').src;
            if (imgSrc) {
                signatureHtml = `<img src="${imgSrc}" alt="Signature" style="max-width: 250px;">`;
            }
        }
        
        this.targetElement.innerHTML = signatureHtml;
        this.targetElement.classList.remove('signature-placeholder');
        this.targetElement.classList.add('signature-applied');
        this.builder.getManager('template')?.markAsModified();
        this.hideModal();
    }
} 