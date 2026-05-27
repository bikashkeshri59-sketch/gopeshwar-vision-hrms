// Utility functions

function generateUniqueId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-IN', options);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

function showToast(message, type = 'info', duration = CONFIG.UI.TOAST_DURATION) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#00a651' : type === 'error' ? '#ff1e1e' : '#2563eb'};
        color: white;
        border-radius: 10px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
}

function debounce(func, delay = CONFIG.UI.DEBOUNCE_DELAY) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

function calculateExperience(joiningDate) {
    const today = new Date();
    const joining = new Date(joiningDate);
    let experience = today.getFullYear() - joining.getFullYear();
    const monthDiff = today.getMonth() - joining.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < joining.getDate())) {
        experience--;
    }
    return experience;
}