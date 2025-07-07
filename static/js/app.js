// Receipt Splitter App
class ReceiptSplitter {
    constructor() {
        this.receiptData = null;
        this.people = [];
        this.assignments = {};
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Upload functionality
        const uploadArea = document.getElementById('upload-area');
        const receiptInput = document.getElementById('receipt-input');

        uploadArea.addEventListener('click', () => receiptInput.click());
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        receiptInput.addEventListener('change', this.handleFileSelect.bind(this));

        // People management
        document.getElementById('add-person-btn').addEventListener('click', this.addPerson.bind(this));
        document.getElementById('person-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addPerson();
        });

        // Calculate button
        document.getElementById('calculate-btn').addEventListener('click', this.calculateSplit.bind(this));

        // Start over button
        document.getElementById('start-over-btn').addEventListener('click', this.startOver.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('upload-area').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('upload-area').classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('upload-area').classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    async processFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('Please select an image file.');
            return;
        }

        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('Image file is too large. Please choose a file smaller than 10MB.');
            return;
        }

        // Show loading state
        this.showUploadStatus(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/process-receipt', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to process receipt');
            }

            this.receiptData = await response.json();
            this.displayReceiptData();
            this.showStep('items-section');
            this.showStep('people-section');

        } catch (error) {
            console.error('Error processing receipt:', error);
            
            // Provide helpful error messages
            let userMessage = error.message;
            if (error.message.includes('Unsupported image format')) {
                userMessage = 'This image format is not supported. Please use JPEG, PNG, or HEIC images.';
            } else if (error.message.includes('Could not process image')) {
                userMessage = 'Could not process this image. Please try taking a clearer photo or using a different image.';
            } else if (error.message.includes('Failed to process receipt')) {
                userMessage = 'Unable to read this receipt. Please ensure the image is clear and contains a receipt.';
            }
            
            this.showError(userMessage);
        } finally {
            this.showUploadStatus(false);
        }
    }

    showUploadStatus(show) {
        const statusEl = document.getElementById('upload-status');
        statusEl.style.display = show ? 'block' : 'none';
    }

    displayReceiptData() {
        if (!this.receiptData) return;

        // Display receipt info
        const receiptInfo = document.getElementById('receipt-info');
        receiptInfo.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="info-item">
                        <span><strong>Restaurant:</strong></span>
                        <span>${this.receiptData.establishment || 'Unknown'}</span>
                    </div>
                    <div class="info-item">
                        <span><strong>Date:</strong></span>
                        <span>${this.receiptData.date || 'Unknown'}</span>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="info-item">
                        <span>Subtotal:</span>
                        <span>$${this.formatPrice(this.receiptData.subtotal)}</span>
                    </div>
                    <div class="info-item">
                        <span>Tax:</span>
                        <span>$${this.formatPrice(this.receiptData.tax)}</span>
                    </div>
                    <div class="info-item">
                        <span>Tip:</span>
                        <span>$${this.formatPrice(this.receiptData.tip)}</span>
                    </div>
                    <div class="info-item">
                        <span><strong>Total:</strong></span>
                        <span><strong>$${this.formatPrice(this.receiptData.total)}</strong></span>
                    </div>
                </div>
            </div>
        `;

        // Display items
        const itemsTable = document.getElementById('items-table');
        itemsTable.innerHTML = this.receiptData.items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>$${this.formatPrice(item.price)}</td>
            </tr>
        `).join('');
    }

    addPerson() {
        const input = document.getElementById('person-input');
        const name = input.value.trim();

        if (!name) {
            this.showError('Please enter a person\'s name.');
            return;
        }

        if (this.people.includes(name)) {
            this.showError('This person is already added.');
            return;
        }

        this.people.push(name);
        input.value = '';
        this.updatePeopleDisplay();
        this.updateAssignmentSection();
    }

    removePerson(name) {
        this.people = this.people.filter(person => person !== name);
        // Remove from assignments
        Object.keys(this.assignments).forEach(itemIndex => {
            this.assignments[itemIndex] = this.assignments[itemIndex].filter(person => person !== name);
        });
        this.updatePeopleDisplay();
        this.updateAssignmentSection();
    }

    updatePeopleDisplay() {
        const peopleList = document.getElementById('people-list');
        
        if (this.people.length === 0) {
            peopleList.innerHTML = '<p class="text-muted">No people added yet.</p>';
            return;
        }

        peopleList.innerHTML = this.people.map(person => `
            <span class="person-tag">
                ${person}
                <span class="remove-person" onclick="app.removePerson('${person}')">
                    <i class="fas fa-times"></i>
                </span>
            </span>
        `).join('');

        // Show assignment section if we have people and items
        if (this.people.length > 0 && this.receiptData) {
            this.showStep('assign-section');
        }
    }

    updateAssignmentSection() {
        if (!this.receiptData || this.people.length === 0) return;

        const assignmentList = document.getElementById('assignment-list');
        assignmentList.innerHTML = this.receiptData.items.map((item, index) => `
            <div class="assignment-item">
                <h6>${item.name} - $${this.formatPrice(item.price)}</h6>
                ${this.people.map(person => `
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" 
                               id="item${index}_${person}" 
                               onchange="app.updateAssignment(${index}, '${person}', this.checked)">
                        <label class="form-check-label" for="item${index}_${person}">
                            ${person}
                        </label>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    updateAssignment(itemIndex, person, isChecked) {
        if (!this.assignments[itemIndex]) {
            this.assignments[itemIndex] = [];
        }

        if (isChecked) {
            if (!this.assignments[itemIndex].includes(person)) {
                this.assignments[itemIndex].push(person);
            }
        } else {
            this.assignments[itemIndex] = this.assignments[itemIndex].filter(p => p !== person);
        }
    }

    async calculateSplit() {
        if (!this.receiptData || this.people.length === 0) {
            this.showError('Please add people and assign items before calculating.');
            return;
        }

        // Check if any items are assigned
        const hasAssignments = Object.values(this.assignments).some(assignment => assignment.length > 0);
        if (!hasAssignments) {
            this.showError('Please assign at least one item to someone.');
            return;
        }

        try {
            const response = await fetch('/api/calculate-split', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    people: this.people,
                    items: this.receiptData.items,
                    assignments: this.assignments,
                    subtotal: this.receiptData.subtotal,
                    tax: this.receiptData.tax,
                    tip: this.receiptData.tip
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to calculate split');
            }

            const splitData = await response.json();
            this.displayResults(splitData);
            this.showStep('results-section');

        } catch (error) {
            console.error('Error calculating split:', error);
            this.showError(`Failed to calculate split: ${error.message}`);
        }
    }

    displayResults(splitData) {
        const resultsTable = document.getElementById('results-table');
        resultsTable.innerHTML = splitData.splits.map(split => `
            <tr>
                <td>${split.name}</td>
                <td class="fw-bold">$${this.formatPrice(split.total)}</td>
            </tr>
        `).join('');

        // Add total row
        resultsTable.innerHTML += `
            <tr class="table-success">
                <td><strong>Total Split</strong></td>
                <td><strong>$${this.formatPrice(splitData.total_split)}</strong></td>
            </tr>
        `;
    }

    showStep(sectionId) {
        document.getElementById(sectionId).style.display = 'block';
    }

    hideStep(sectionId) {
        document.getElementById(sectionId).style.display = 'none';
    }

    startOver() {
        this.receiptData = null;
        this.people = [];
        this.assignments = {};

        // Hide all sections except upload
        ['items-section', 'people-section', 'assign-section', 'results-section'].forEach(id => {
            this.hideStep(id);
        });

        // Reset form
        document.getElementById('receipt-input').value = '';
        document.getElementById('person-input').value = '';
        
        // Clear displays
        document.getElementById('items-table').innerHTML = '';
        document.getElementById('people-list').innerHTML = '<p class="text-muted">No people added yet.</p>';
        document.getElementById('assignment-list').innerHTML = '';
        document.getElementById('results-table').innerHTML = '';
    }

    formatPrice(price) {
        return parseFloat(price || 0).toFixed(2);
    }

    showError(message) {
        // Create or update error alert
        let errorAlert = document.getElementById('error-alert');
        if (!errorAlert) {
            errorAlert = document.createElement('div');
            errorAlert.id = 'error-alert';
            errorAlert.className = 'alert alert-danger alert-dismissible fade show mt-3';
            document.querySelector('.container-fluid').insertBefore(errorAlert, document.querySelector('main'));
        }

        errorAlert.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = bootstrap.Alert.getOrCreateInstance(errorAlert);
            alert.close();
        }, 5000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ReceiptSplitter();
});
