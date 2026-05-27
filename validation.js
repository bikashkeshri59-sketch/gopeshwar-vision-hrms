// Validation utilities

class FieldValidator {
    static validateName(name) {
        const trimmed = name.trim();
        if (!trimmed) return { valid: false, error: 'Name is required' };
        if (trimmed.length < 2) return { valid: false, error: 'Name too short' };
        if (!/^[a-zA-Z\s'-]{2,}$/.test(trimmed)) 
            return { valid: false, error: 'Invalid name format' };
        return { valid: true, error: null, value: trimmed };
    }

    static validateEmail(email) {
        const trimmed = email.trim().toLowerCase();
        if (!trimmed) return { valid: false, error: 'Email is required' };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) 
            return { valid: false, error: 'Invalid email' };
        return { valid: true, error: null, value: trimmed };
    }

    static validatePhone(phone) {
        const trimmed = phone.trim();
        if (!trimmed) return { valid: false, error: 'Phone is required' };
        if (!/^[0-9]{10}$/.test(trimmed)) 
            return { valid: false, error: 'Phone must be 10 digits' };
        return { valid: true, error: null, value: trimmed };
    }

    static validateSalary(salary) {
        const num = parseFloat(salary);
        if (isNaN(num)) return { valid: false, error: 'Invalid salary' };
        if (num < 0) return { valid: false, error: 'Salary cannot be negative' };
        return { valid: true, error: null, value: num };
    }

    static validateIncrement(increment) {
        const num = parseFloat(increment);
        if (isNaN(num)) return { valid: false, error: 'Invalid increment' };
        if (num < 0 || num > 100) return { valid: false, error: 'Increment must be 0-100' };
        return { valid: true, error: null, value: num };
    }

    static validateJoiningDate(date) {
        if (!date) return { valid: false, error: 'Date required' };
        const joiningDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (joiningDate > today) 
            return { valid: false, error: 'Date cannot be in future' };
        return { valid: true, error: null, value: date };
    }

    static validateDesignation(designation) {
        const trimmed = designation.trim();
        if (!trimmed) return { valid: false, error: 'Designation required' };
        return { valid: true, error: null, value: trimmed };
    }

    static validateEmployeeForm(data) {
        const validations = {
            name: this.validateName(data.name || ''),
            email: this.validateEmail(data.email || ''),
            phone: this.validatePhone(data.phone || ''),
            designation: this.validateDesignation(data.designation || ''),
            salary: this.validateSalary(data.salary || ''),
            increment: this.validateIncrement(data.increment || '0'),
            joiningDate: this.validateJoiningDate(data.joiningDate || '')
        };

        const errors = {};
        let isValid = true;

        Object.keys(validations).forEach(key => {
            if (!validations[key].valid) {
                errors[key] = validations[key].error;
                isValid = false;
            }
        });

        return { valid: isValid, errors };
    }
}