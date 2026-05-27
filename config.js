// Application Configuration
const CONFIG = {
    APP: {
        NAME: 'Gopeshwar Vision HRMS',
        VERSION: '2.0.0',
        STORAGE_KEY: 'gopeshwar_employees',
        DEBUG: true
    },
    EMAIL: {
        SERVICE_ID: 'service_6o4o4eh',
        TEMPLATE_ID: 'template_x8j17ix',
        PUBLIC_KEY: '2dtFMmREYfFbb57Mu'
    },
    GOOGLE_SHEETS: {
        SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwys6nAlfepKWtsX2qR7FHDOrM6KTbr8lNVsJR8IzSpPg8-DTv_qEBeNFD1MOoVYg87OQ/exec'
    },
    VALIDATION: {
        MIN_SALARY: 0,
        MAX_SALARY: 9999999,
        MIN_INCREMENT: 0,
        MAX_INCREMENT: 100,
        MIN_NAME_LENGTH: 2,
        MAX_NAME_LENGTH: 100,
        PHONE_PATTERN: /^[0-9]{10}$/,
        EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        NAME_PATTERN: /^[a-zA-Z\s'-]{2,}$/
    },
    UI: {
        TOAST_DURATION: 3000,
        DEBOUNCE_DELAY: 300
    }
};

function logError(context, error) {
    if (CONFIG.APP.DEBUG) {
        console.error(`[${context}] ${error.message}`);
    }
}

function logInfo(context, message) {
    if (CONFIG.APP.DEBUG) {
        console.info(`[${context}] ${message}`);
    }
}