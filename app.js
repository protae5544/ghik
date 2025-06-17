// Global State
let currentFormData = {
    employer: {},
    bt44: {},
    bt46: {},
    bt52: {},
    bt55: {},
    contract: {}
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
        showDebug('กำลังโหลด template...');
        console.log('Initializing application...');
        // Load JSON templates
        formTemplates.employer = await fetchJSON('batch_processing_template.json');
        formTemplates.bt44 = await fetchJSON('bt44_template.json');
        formTemplates.bt46 = await fetchJSON('bt46_template.json');
        formTemplates.bt52 = await fetchJSON('bt52_template.json');
        formTemplates.bt55 = await fetchJSON('bt55_template.json');
        formTemplates.contract = await fetchJSON('employment_contract_template.json');

        console.log('Templates loaded:', formTemplates);

        // Generate form elements
        generateFormFields(formTemplates.employer.employer_data.template, 'employer-form');
        generateFormFields(formTemplates.bt44, 'bt44-form');
        generateFormFields(formTemplates.bt46, 'bt46-form');
        generateFormFields(formTemplates.bt52, 'bt52-form');
        generateFormFields(formTemplates.bt55, 'bt55-form');
        generateFormFields(formTemplates.contract, 'contract-form');

        console.log('Forms generated');
        showSuccess('โหลดข้อมูลเรียบร้อย');
        showDebug('โหลด template สำเร็จ');
    } catch (error) {
        showDebug('เกิดข้อผิดพลาด: ' + error.message);
        console.error('Failed to initialize app:', error);
        showError('ไม่สามารถโหลดข้อมูลแบบฟอร์มได้: ' + error.message);
    }
}

// Fetch JSON file
async function fetchJSON(filename) {
    console.log('Fetching:', filename);
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data for', filename, ':', data);
        return data;
    } catch (error) {
        console.error('Error fetching', filename, ':', error);
        throw error;
    }
}

// Switch between forms
function switchForm(formId) {
    console.log('Switching to form:', formId);
    document.querySelectorAll('.form-section').forEach(form => {
        form.classList.remove('active');
    });
    
    const targetForm = document.getElementById(`${formId}-form`);
    if (targetForm) {
        targetForm.classList.add('active');
    } else {
        console.error('Form not found:', formId);
    }
    
    document.querySelectorAll('.nav-button').forEach(button => {
        button.classList.remove('active');
    });
    const targetButton = document.querySelector(`[onclick="switchForm('${formId}')"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }
}

// Generate form elements based on JSON template
function generateFormFields(template, containerId) {
    console.log('Generating fields for', containerId, 'with template:', template);
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    container.innerHTML = '';
    const form = document.createElement('form');
    
    function createFields(obj, prefix = '', parentElement = form) {
        if (!obj || typeof obj !== 'object') {
            console.warn('Invalid object for createFields:', obj);
            return;
        }

        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                const fieldset = document.createElement('fieldset');
                const legend = document.createElement('legend');
                legend.textContent = formatFieldName(key);
                fieldset.appendChild(legend);
                parentElement.appendChild(fieldset);
                createFields(value, `${prefix}${key}.`, fieldset);
            } else {
                const formGroup = document.createElement('div');
                formGroup.className = 'form-group';
                
                const label = document.createElement('label');
                label.htmlFor = `${prefix}${key}`;
                label.textContent = formatFieldName(key);
                
                let input;
                if (typeof value === 'string' && value.includes('|')) {
                    input = document.createElement('select');
                    value.split('|').forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option;
                        optionElement.textContent = option;
                        input.appendChild(optionElement);
                    });
                } else {
                    input = document.createElement('input');
                    input.type = getInputType(value);
                    input.value = value || '';
                }
                input.id = `${prefix}${key}`;
                input.name = `${prefix}${key}`;
                input.className = 'form-control';
                
                formGroup.appendChild(label);
                formGroup.appendChild(input);
                parentElement.appendChild(formGroup);
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
    if (String(value).includes('date')) return 'date';
    if (String(value).includes('email')) return 'email';
    return 'text';
}

// Get nested value from object
function getNestedValue(obj, path) {
    try {
        return path.split('.').reduce((current, key) => 
            current && current[key] !== undefined ? current[key] : undefined, obj);
    } catch (error) {
        console.warn(`Error getting nested value for path ${path}:`, error);
        return undefined;
    }
}

// Save form data
function saveData() {
    try {
        console.log('Saving form data...');
        currentFormData.employer = collectFormData('employer-form');
        currentFormData.bt44 = collectFormData('bt44-form');
        currentFormData.bt46 = collectFormData('bt46-form');
        currentFormData.bt52 = collectFormData('bt52-form');
        currentFormData.bt55 = collectFormData('bt55-form');
        currentFormData.contract = collectFormData('contract-form');
        
        console.log('Collected data:', currentFormData);
        
        const dataStr = JSON.stringify(currentFormData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'form_data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showSuccess('บันทึกข้อมูลเรียบร้อยแล้ว');
    } catch (error) {
        console.error('Failed to save data:', error);
        showError('ไม่สามารถบันทึกข้อมูลได้: ' + error.message);
    }
}

// Collect form data
function collectFormData(formId) {
    console.log('Collecting data from form:', formId);
    const form = document.getElementById(formId);
    if (!form) {
        console.error('Form not found:', formId);
        return {};
    }
    
    const formData = {};
    form.querySelectorAll('input, select').forEach(input => {
        const keys = input.name.split('.');
        let current = formData;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        const value = input.type === 'number' ? Number(input.value) : input.value;
        current[keys[keys.length - 1]] = value;
    });
    
    console.log('Collected data for', formId, ':', formData);
    return formData;
}

// Show error message
function showError(message) {
    console.error('Error:', message);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.querySelector('.container').appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Show success message
function showSuccess(message) {
    console.log('Success:', message);
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    document.querySelector('.container').appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
}

// เพิ่ม debug message
function showDebug(msg) {
    const debugDiv = document.getElementById('debug-message');
    if (debugDiv) debugDiv.textContent = msg;
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});
