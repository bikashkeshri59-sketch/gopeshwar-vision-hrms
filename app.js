// Main application logic

let editingEmployeeId = null;

function getFormData() {
    return {
        name: document.getElementById('employeeName')?.value || '',
        designation: document.getElementById('designation')?.value || '',
        salary: document.getElementById('salary')?.value || '',
        increment: document.getElementById('increment')?.value || '0',
        joiningDate: document.getElementById('joiningDate')?.value || '',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || ''
    };
}

function clearForm() {
    document.getElementById('employeeName').value = '';
    document.getElementById('designation').value = '';
    document.getElementById('salary').value = '';
    document.getElementById('increment').value = '0';
    document.getElementById('joiningDate').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    editingEmployeeId = null;
    document.getElementById('saveBtn').textContent = 'Save Employee';
}

async function saveEmployee() {
    const data = getFormData();
    const validation = FieldValidator.validateEmployeeForm(data);

    if (!validation.valid) {
        const errorMsg = Object.values(validation.errors).join('\n');
        showToast(`Validation errors:\n${errorMsg}`, 'error');
        return;
    }

    try {
        if (editingEmployeeId) {
            storage.updateEmployee(editingEmployeeId, data);
            showToast('Employee updated successfully!', 'success');
        } else {
            const employee = storage.addEmployee(data);
            await emailService.sendWelcomeEmail(employee);
            showToast('Employee saved successfully!', 'success');
        }
        clearForm();
    } catch (error) {
        logError('saveEmployee', error);
        showToast('Error saving employee', 'error');
    }
}

function generateOfferLetter() {
    const data = getFormData();
    const validation = FieldValidator.validateEmployeeForm(data);

    if (!validation.valid) {
        showToast('Please fill all fields correctly', 'error');
        return;
    }

    pdfGenerator.generateOfferLetter(data);
    showToast('Offer letter generated!', 'success');
}

function generateJoiningLetter() {
    const data = getFormData();
    const validation = FieldValidator.validateEmployeeForm(data);

    if (!validation.valid) {
        showToast('Please fill all fields correctly', 'error');
        return;
    }

    pdfGenerator.generateJoiningLetter(data);
    showToast('Joining letter generated!', 'success');
}

function generateSalarySlip() {
    const data = getFormData();
    const validation = FieldValidator.validateEmployeeForm(data);

    if (!validation.valid) {
        showToast('Please fill all fields correctly', 'error');
        return;
    }

    pdfGenerator.generateSalarySlip(data);
    emailService.sendSalarySlip(data);
    showToast('Salary slip generated and email sent!', 'success');
}

function generateExperienceLetter() {
    const data = getFormData();
    const validation = FieldValidator.validateEmployeeForm(data);

    if (!validation.valid) {
        showToast('Please fill all fields correctly', 'error');
        return;
    }

    pdfGenerator.generateExperienceLetter(data);
    showToast('Experience letter generated!', 'success');
}

function deleteEmployeeRecord(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            storage.deleteEmployee(id);
            showToast('Employee deleted successfully!', 'success');
            return true;
        } catch (error) {
            logError('deleteEmployee', error);
            showToast('Error deleting employee', 'error');
            return false;
        }
    }
    return false;
}

function loadEmployeeForEdit(emp) {
    document.getElementById('employeeName').value = emp.name;
    document.getElementById('designation').value = emp.designation;
    document.getElementById('salary').value = emp.salary;
    document.getElementById('increment').value = emp.increment;
    document.getElementById('joiningDate').value = emp.joiningDate;
    document.getElementById('email').value = emp.email;
    document.getElementById('phone').value = emp.phone;
    editingEmployeeId = emp.id;
    document.getElementById('saveBtn').textContent = 'Update Employee';
    showToast('Employee loaded for editing', 'info');
}

function openEmployeePage() {
    const employees = storage.getAllEmployees();
    
    if (employees.length === 0) {
        showToast('No employees saved yet', 'info');
        return;
    }

    let tableRows = employees.map(emp => `
        <tr>
            <td>${sanitizeHTML(emp.name)}</td>
            <td>${sanitizeHTML(emp.designation)}</td>
            <td>${formatCurrency(emp.salary)}</td>
            <td>${emp.increment}%</td>
            <td>${formatDate(emp.joiningDate)}</td>
            <td>${sanitizeHTML(emp.email)}</td>
            <td>
                <button onclick="handleEditEmployee('${emp.id}')" style="background:#2563eb; color:white; padding:8px 12px; border:none; border-radius:5px; cursor:pointer;">Edit</button>
            </td>
            <td>
                <button onclick="handleDeleteEmployee('${emp.id}')" style="background:#ff1e1e; color:white; padding:8px 12px; border:none; border-radius:5px; cursor:pointer;">Delete</button>
            </td>
        </tr>
    `).join('');

    const stats = storage.getStats();
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Employee Directory</title>
            <style>
                body { background:#000; color:white; font-family:Arial; padding:30px; }
                h1 { background:#FFAC00; padding:20px; border-radius:20px; text-align:center; color:#000; margin-bottom:20px; }
                .stats { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:30px; }
                .stat-card { background:#111; padding:20px; border-radius:10px; border:2px solid #FFAC00; text-align:center; }
                .stat-card h3 { color:#FFAC00; margin:0 0 10px 0; }
                table { width:100%; border-collapse:collapse; margin-top:30px; }
                th { background:#FFAC00; color:#000; padding:15px; text-align:left; }
                td { padding:12px 15px; text-align:left; background:#111; border-bottom:1px solid #333; }
                tr:hover { background:#222; }
                .btn-group { margin-top:30px; }
                button { padding:10px 15px; margin:5px; border:none; border-radius:5px; cursor:pointer; font-weight:bold; }
                .export-btn { background:#00a651; color:white; }
                .print-btn { background:#2563eb; color:white; }
            </style>
        </head>
        <body>
            <h1>Employee Directory</h1>
            <div class="stats">
                <div class="stat-card">
                    <h3>Total Employees</h3>
                    <p style="font-size:24px; margin:0;">${stats.totalEmployees}</p>
                </div>
                <div class="stat-card">
                    <h3>Total Salary</h3>
                    <p style="font-size:24px; margin:0;">₹${stats.totalSalary.toLocaleString('en-IN')}</p>
                </div>
                <div class="stat-card">
                    <h3>Avg Salary</h3>
                    <p style="font-size:24px; margin:0;">₹${Math.round(stats.averageSalary).toLocaleString('en-IN')}</p>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Salary</th>
                        <th>Increment</th>
                        <th>Joining Date</th>
                        <th>Email</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            <div class="btn-group">
                <button class="export-btn" onclick="exportData('json')">Export JSON</button>
                <button class="export-btn" onclick="exportData('csv')">Export CSV</button>
                <button class="print-btn" onclick="window.print()">Print</button>
            </div>
            <script>
                function handleEditEmployee(id) {
                    const emp = ${JSON.stringify(employees)}.find(e => e.id === id);
                    if (emp && window.opener && !window.opener.closed) {
                        window.opener.loadEmployeeForEdit(emp);
                        window.close();
                    } else {
                        alert('Error: Unable to access main window');
                    }
                }
                
                function handleDeleteEmployee(id) {
                    if (confirm('Delete this employee?')) {
                        if (window.opener && !window.opener.closed) {
                            const deleted = window.opener.deleteEmployeeRecord(id);
                            if (deleted) {
                                setTimeout(() => location.reload(), 500);
                            }
                        } else {
                            alert('Error: Unable to access main window');
                        }
                    }
                }
                
                function exportData(format) {
                    const data = ${JSON.stringify(employees)};
                    if (data.length === 0) {
                        alert('No data to export');
                        return;
                    }
                    
                    if (format === 'json') {
                        download(JSON.stringify(data, null, 2), 'employees.json', 'application/json');
                    } else {
                        try {
                            const headers = Object.keys(data[0]);
                            const csv = [headers.join(',')];
                            data.forEach(emp => {
                                const row = headers.map(h => {
                                    const val = emp[h];
                                    if (typeof val === 'string' && val.includes(',')) {
                                        return '"' + val + '"';
                                    }
                                    return val;
                                }).join(',');
                                csv.push(row);
                            });
                            download(csv.join('\\n'), 'employees.csv', 'text/csv');
                        } catch (e) {
                            alert('Error exporting CSV: ' + e.message);
                        }
                    }
                }
                
                function download(content, filename, type) {
                    const blob = new Blob([content], { type });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }
            </script>
        </body>
        </html>
    `;

    const win = window.open('', '_blank');
    if (win) {
        win.document.write(html);
    } else {
        alert('Please allow pop-ups to view employee directory');
    }
}
