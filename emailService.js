// Email service

class EmailService {
    constructor() {
        emailjs.init(CONFIG.EMAIL.PUBLIC_KEY);
    }

    async sendSalarySlip(data) {
        try {
            await emailjs.send(
                CONFIG.EMAIL.SERVICE_ID,
                CONFIG.EMAIL.TEMPLATE_ID,
                {
                    employee_name: data.name,
                    employee_email: data.email,
                    message: `
Dear ${data.name},

Your Salary Slip has been generated successfully.

Final Salary: Rs ${formatCurrency(data.salary)}

Regards,
Gopeshwar Vision HR Team
                    `
                }
            );
            showToast('Email sent successfully!', 'success');
            return true;
        } catch (error) {
            logError('sendSalarySlip', error);
            showToast('Email failed to send', 'error');
            return false;
        }
    }

    async sendWelcomeEmail(data) {
        try {
            await emailjs.send(
                CONFIG.EMAIL.SERVICE_ID,
                CONFIG.EMAIL.TEMPLATE_ID,
                {
                    employee_name: data.name,
                    employee_email: data.email,
                    message: `
Welcome to Gopeshwar Vision!

We are excited to have you join our team as ${data.designation}.

Your joining date: ${formatDate(data.joiningDate)}

Regards,
Gopeshwar Vision HR Team
                    `
                }
            );
            return true;
        } catch (error) {
            logError('sendWelcomeEmail', error);
            return false;
        }
    }
}

const emailService = new EmailService();