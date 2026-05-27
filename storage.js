// Storage management

class EmployeeStorage {
    constructor() {
        this.storageKey = CONFIG.APP.STORAGE_KEY;
    }

    getAllEmployees() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            logError('getAllEmployees', error);
            return [];
        }
    }

    addEmployee(employee) {
        try {
            const employees = this.getAllEmployees();
            const newEmployee = {
                ...employee,
                id: generateUniqueId(),
                createdAt: new Date().toISOString()
            };
            employees.push(newEmployee);
            localStorage.setItem(this.storageKey, JSON.stringify(employees));
            return newEmployee;
        } catch (error) {
            logError('addEmployee', error);
            throw error;
        }
    }

    updateEmployee(id, updates) {
        try {
            let employees = this.getAllEmployees();
            const index = employees.findIndex(emp => emp.id === id);
            if (index === -1) throw new Error('Employee not found');
            employees[index] = { ...employees[index], ...updates };
            localStorage.setItem(this.storageKey, JSON.stringify(employees));
            return true;
        } catch (error) {
            logError('updateEmployee', error);
            throw error;
        }
    }

    deleteEmployee(id) {
        try {
            let employees = this.getAllEmployees();
            employees = employees.filter(emp => emp.id !== id);
            localStorage.setItem(this.storageKey, JSON.stringify(employees));
            return true;
        } catch (error) {
            logError('deleteEmployee', error);
            throw error;
        }
    }

    searchEmployees(query) {
        try {
            const employees = this.getAllEmployees();
            const lowerQuery = query.toLowerCase();
            return employees.filter(emp =>
                emp.name.toLowerCase().includes(lowerQuery) ||
                emp.email.toLowerCase().includes(lowerQuery) ||
                emp.designation.toLowerCase().includes(lowerQuery)
            );
        } catch (error) {
            logError('searchEmployees', error);
            return [];
        }
    }

    exportAsJSON() {
        const employees = this.getAllEmployees();
        return JSON.stringify(employees, null, 2);
    }

    exportAsCSV() {
        const employees = this.getAllEmployees();
        if (employees.length === 0) return '';
        const headers = Object.keys(employees[0]);
        const rows = employees.map(emp => 
            headers.map(h => typeof emp[h] === 'string' ? `"${emp[h]}"` : emp[h]).join(',')
        );
        return [headers.join(','), ...rows].join('\n');
    }

    getStats() {
        const employees = this.getAllEmployees();
        const totalSalary = employees.reduce((sum, emp) => sum + parseFloat(emp.salary || 0), 0);
        return {
            totalEmployees: employees.length,
            totalSalary,
            averageSalary: employees.length > 0 ? totalSalary / employees.length : 0
        };
    }
}

const storage = new EmployeeStorage();