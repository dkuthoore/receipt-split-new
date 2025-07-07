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
            this.displayImagePreview(file);
            this.displayReceiptData();
            this.hideUploadArea();
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

    hideUploadArea() {
        const uploadArea = document.getElementById('upload-area');
        uploadArea.style.display = 'none';
    }

    displayImagePreview(file) {
        const previewContainer = document.getElementById('image-preview');
        const previewImg = document.getElementById('preview-thumbnail');
        const fullscreenImg = document.getElementById('fullscreen-image');
        
        // Create URL for the uploaded file
        const imageUrl = URL.createObjectURL(file);
        
        // Set preview images
        previewImg.src = imageUrl;
        fullscreenImg.src = imageUrl;
        
        // Show preview container
        previewContainer.style.display = 'block';
        
        // Add click event to open modal
        previewImg.onclick = () => {
            const modal = new bootstrap.Modal(document.getElementById('imageModal'));
            modal.show();
        };
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
                        <span>
                            $<input type="number" 
                                   id="tip-input" 
                                   value="${this.formatPrice(this.receiptData.tip)}" 
                                   step="0.01" 
                                   min="0"
                                   style="width: 80px; background: var(--bg-tertiary); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 4px; padding: 2px 6px;"
                                   onchange="app.updateTip(this.value)">
                        </span>
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
        
        // Calculate split when people are added
        this.calculateSplit();
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
                <span class="remove-person" onclick="app.removePerson('${person}')" title="Remove ${person}">
                    <i class="fas fa-times"></i>
                </span>
            </span>
        `).join('');

        // Show assignment section if we have people and items
        if (this.people.length > 0 && this.receiptData) {
            this.showStep('assign-section');
        }
    }

    updateTip(newTip) {
        if (!this.receiptData) return;
        
        const tipValue = parseFloat(newTip) || 0;
        this.receiptData.tip = tipValue;
        
        // Update the displayed total
        this.receiptData.total = this.receiptData.subtotal + this.receiptData.tax + this.receiptData.tip;
        
        // Update the total display
        const totalDisplay = document.querySelector('#receipt-info .info-item:last-child span:last-child strong');
        if (totalDisplay) {
            totalDisplay.textContent = `$${this.formatPrice(this.receiptData.total)}`;
        }
        
        // Recalculate split
        this.calculateSplit();
    }

    updateAssignmentSection() {
        if (!this.receiptData || this.people.length === 0) return;

        const assignmentList = document.getElementById('assignment-list');
        
        if (this.receiptData.items.length === 0) {
            assignmentList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No items found on the receipt</p>
                </div>
            `;
            return;
        }
        
        assignmentList.innerHTML = this.receiptData.items.map((item, index) => `
            <div class="assignment-item">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="mb-0">${item.name}</h6>
                    <span class="badge bg-secondary">$${this.formatPrice(item.price)}</span>
                </div>
                <div class="person-buttons">
                    ${this.people.map(person => {
                        const isAssigned = this.assignments[index] && this.assignments[index].includes(person);
                        const assignedCount = this.assignments[index] ? this.assignments[index].length : 0;
                        const splitAmount = assignedCount > 0 ? item.price / assignedCount : 0;
                        return `
                            <button class="btn person-btn ${isAssigned ? 'btn-primary' : 'btn-outline-light'}" 
                                    onclick="app.toggleAssignment(${index}, '${person}')"
                                    title="${isAssigned ? `$${this.formatPrice(splitAmount)} per person` : 'Click to assign'}">
                                ${person}
                            </button>
                        `;
                    }).join('')}
                </div>
                ${this.assignments[index] && this.assignments[index].length > 0 ? `
                    <small class="text-muted mt-2 d-block">
                        Split ${this.assignments[index].length} way${this.assignments[index].length > 1 ? 's' : ''}: 
                        $${this.formatPrice(item.price / this.assignments[index].length)} each
                    </small>
                ` : ''}
            </div>
        `).join('');
    }

    toggleAssignment(itemIndex, person) {
        if (!this.assignments[itemIndex]) {
            this.assignments[itemIndex] = [];
        }

        if (this.assignments[itemIndex].includes(person)) {
            // Remove person from assignment
            this.assignments[itemIndex] = this.assignments[itemIndex].filter(p => p !== person);
        } else {
            // Add person to assignment
            this.assignments[itemIndex].push(person);
        }
        
        // Update the assignment section to reflect changes
        this.updateAssignmentSection();
        
        // Calculate split in real-time
        this.calculateSplit();
        
        
    }
    
    

    async calculateSplit() {
        if (!this.receiptData || this.people.length === 0) {
            // Hide results if no people
            this.hideStep('results-section');
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
            // Don't show error for real-time calculations
        }
    }

    displayResults(splitData) {
        const resultsTable = document.getElementById('results-table');
        
        // Calculate totals for the bottom row
        let totalSubtotal = 0, totalTax = 0, totalTip = 0, totalAmount = 0;
        
        // Show individual splits with breakdown
        resultsTable.innerHTML = splitData.splits.map(split => {
            // Calculate individual breakdowns
            const subtotalSplit = split.subtotal || 0;
            const taxSplit = split.tax || 0;
            const tipSplit = split.tip || 0;
            
            totalSubtotal += subtotalSplit;
            totalTax += taxSplit;
            totalTip += tipSplit;
            totalAmount += split.total;
            
            return `
                <tr>
                    <td>${split.name}</td>
                    <td>$${this.formatPrice(subtotalSplit)}</td>
                    <td>$${this.formatPrice(taxSplit)}</td>
                    <td>$${this.formatPrice(tipSplit)}</td>
                    <td class="fw-bold">$${this.formatPrice(split.total)}</td>
                </tr>
            `;
        }).join('');

        // Add total row
        resultsTable.innerHTML += `
            <tr class="table-success">
                <td><strong>Total</strong></td>
                <td><strong>$${this.formatPrice(totalSubtotal)}</strong></td>
                <td><strong>$${this.formatPrice(totalTax)}</strong></td>
                <td><strong>$${this.formatPrice(totalTip)}</strong></td>
                <td><strong>$${this.formatPrice(totalAmount)}</strong></td>
            </tr>
        `;
        
        // Add validation row if totals don't match receipt
        const expectedTotal = this.receiptData.total;
        const isMatching = Math.abs(expectedTotal - totalAmount) < 0.01;
        if (!isMatching && expectedTotal > 0) {
            resultsTable.innerHTML += `
                <tr class="text-warning">
                    <td colspan="5" class="text-center small">
                        <i class="fas fa-exclamation-triangle me-1"></i>
                        Receipt total: $${this.formatPrice(expectedTotal)}
                    </td>
                </tr>
            `;
        }
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
        ['items-section', 'people-section', 'assign-section', 'results-section', 'image-preview'].forEach(id => {
            this.hideStep(id);
        });

        // Reset form
        document.getElementById('receipt-input').value = '';
        document.getElementById('person-input').value = '';
        
        // Show upload area again
        document.getElementById('upload-area').style.display = 'block';
        
        // Clear displays
        document.getElementById('items-table').innerHTML = '';
        document.getElementById('people-list').innerHTML = '<p class="text-muted">No people added yet.</p>';
        document.getElementById('assignment-list').innerHTML = '';
        document.getElementById('results-table').innerHTML = '';
        
        // Clean up image preview
        const previewImg = document.getElementById('preview-thumbnail');
        const fullscreenImg = document.getElementById('fullscreen-image');
        if (previewImg.src) {
            URL.revokeObjectURL(previewImg.src);
            previewImg.src = '';
        }
        if (fullscreenImg.src) {
            fullscreenImg.src = '';
        }
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
