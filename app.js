// Global State
let currentFormData = {
    employer: {},
    bt44: [],
    bt46: [],
    bt52: [],
    bt55: [],
    contract: []
};

// Form Templates
const formTemplates = {
    employer: null,
    bt44: null,
    bt46: null,
    bt52: null,
    bt55: null,
    contract: null
};

// Initialize Application
async function initializeApp() {
    try {
        // Load JSON templates
        formTemplates.employer = await fetchJSON('batch_processing_template.json');
        formTemplates.bt44 = await fetchJSON('bt44_template.json');
        formTemplates.bt46 = await fetchJSON('bt46_template.json');
        formTemplates.bt52 = await fetchJSON('bt52_template.json');
        formTemplates.bt55 = await fetchJSON('bt55_template.json');
        formTemplates.contract = await fetchJSON('employment_contract_template.json');

        // Generate form elements
        generateEmployerForm();
        generateBT44Form();
        generateBT46Form();
        generateBT52Form();
        generateBT55Form();
        generateContractForm();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showError('ไม่สามารถโหลดข้อมูลแบบฟอร์มได้');
    }
}

// Fetch JSON file
async function fetchJSON(filename) {
    const response = await fetch(filename);
    return response.json();
}

// Switch between forms
function switchForm(formId) {
    // Hide all forms
    document.querySelectorAll('.form-section').forEach(form => {
        form.classList.remove('active');
    });
    
    // Show selected form
    document.getElementById(`${formId}-form`).classList.add('active');
    
    // Update nav buttons
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[onclick="switchForm('${formId}')"]`).classList.add('active');
}

// Generate form elements based on JSON template
function generateFormFields(template, containerId) {
    const container = document.getElementById(containerId);
    const form = document.createElement('form');
    
    // Recursive function to generate form fields
    function createFields(obj, prefix = '') {
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null) {
                // Create fieldset for nested objects
                const fieldset = document.createElement('fieldset');
                fieldset.innerHTML = `<legend>${formatFieldName(key)}</legend>`;
                form.appendChild(fieldset);
                createFields(value, `${prefix}${key}.`);
            } else {
                // Create input field
                const formGroup = document.createElement('div');
                formGroup.className = 'form-group';
                
                const label = document.createElement('label');
                label.htmlFor = `${prefix}${key}`;
                label.textContent = formatFieldName(key);
                
                const input = document.createElement('input');
                input.type = getInputType(value);
                input.id = `${prefix}${key}`;
                input.name = `${prefix}${key}`;
                
                formGroup.appendChild(label);
                formGroup.appendChild(input);
                form.appendChild(formGroup);
            }
        }
    }
    
    createFields(template);
    container.appendChild(form);
}

// Format field names for display
function formatFieldName(key) {
    return key
        .replace(/_/g, ' ')
        .split('.')
        .pop()
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
}

// Determine input type based on value
function getInputType(value) {
    if (typeof value === 'number') return 'number';
    if (value.includes('date')) return 'date';
    if (value.includes('email')) return 'email';
    return 'text';
}

// Save form data
function saveData() {
    try {
        // Collect form data
        currentFormData.employer = collectFormData('employer-form');
        currentFormData.bt44 = collectFormData('bt44-form');
        currentFormData.bt46 = collectFormData('bt46-form');
        currentFormData.bt52 = collectFormData('bt52-form');
        currentFormData.bt55 = collectFormData('bt55-form');
        currentFormData.contract = collectFormData('contract-form');
        
        // Save to localStorage
        localStorage.setItem('formData', JSON.stringify(currentFormData));
        showSuccess('บันทึกข้อมูลสำเร็จ');
    } catch (error) {
        console.error('Failed to save data:', error);
        showError('ไม่สามารถบันทึกข้อมูลได้');
    }
}

// Collect form data
function collectFormData(formId) {
    const form = document.getElementById(formId);
    const formData = {};
    
    form.querySelectorAll('input, select, textarea').forEach(input => {
        const keys = input.name.split('.');
        let current = formData;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = input.value;
    });
    
    return formData;
}

// Generate PDFs
async function generatePDF() {
    try {
        // Validate data
        if (!validateForms()) {
            showError('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
        
        // Process PDF generation
        // This will integrate with your existing PDF processing system
        showSuccess('กำลังสร้างไฟล์ PDF...');
    } catch (error) {
        console.error('Failed to generate PDF:', error);
        showError('ไม่สามารถสร้างไฟล์ PDF ได้');
    }
}

// Validate forms
function validateForms() {
    // Add your validation logic here
    return true;
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.querySelector('.container').appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    document.querySelector('.container').appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', initializeApp);
