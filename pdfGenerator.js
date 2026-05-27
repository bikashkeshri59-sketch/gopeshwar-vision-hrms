// PDF generation

class PDFGenerator {
    constructor() {
        this.jsPDF = window.jspdf.jsPDF;
    }

    async addSignature(doc) {
        try {
            const img = await loadImage('Signature.png');
            doc.addImage(img, 'PNG', 135, 230, 45, 20);
            doc.text('Authorized Signature', 130, 255);
        } catch (error) {
            logError('addSignature', error);
        }
    }

    generateOfferLetter(data) {
        const doc = new this.jsPDF();
        doc.setFontSize(24);
        doc.text("GOPESHWAR VISION", 20, 20);
        doc.setFontSize(14);
        doc.text("Offer Letter", 20, 35);
        doc.line(20, 40, 190, 40);
        doc.setFontSize(13);

        const text = `
Dear ${sanitizeHTML(data.name)},

We are pleased to offer you the position of ${sanitizeHTML(data.designation)} at Gopeshwar Vision.

Your monthly salary will be Rs ${formatCurrency(data.salary)}.

Joining Date: ${formatDate(data.joiningDate)}

Regards,
Gopeshwar Vision HR Team
        `;

        doc.text(text, 20, 60);
        this.addSignature(doc);
        doc.save(`${data.name}_Offer_Letter.pdf`);
    }

    generateJoiningLetter(data) {
        const doc = new this.jsPDF();
        doc.setFontSize(24);
        doc.text("GOPESHWAR VISION", 20, 20);
        doc.setFontSize(14);
        doc.text("Joining Letter", 20, 35);
        doc.line(20, 40, 190, 40);
        doc.setFontSize(13);

        const text = `
Dear ${sanitizeHTML(data.name)},

Welcome to Gopeshwar Vision!

Your joining date is ${formatDate(data.joiningDate)}.

Designation: ${sanitizeHTML(data.designation)}

Regards,
Gopeshwar Vision HR Team
        `;

        doc.text(text, 20, 60);
        this.addSignature(doc);
        doc.save(`${data.name}_Joining_Letter.pdf`);
    }

    generateExperienceLetter(data) {
        const doc = new this.jsPDF();
        doc.setFontSize(24);
        doc.text("GOPESHWAR VISION", 20, 20);
        doc.setFontSize(14);
        doc.text("Experience Letter", 20, 35);
        doc.line(20, 40, 190, 40);
        doc.setFontSize(13);

        const experience = calculateExperience(data.joiningDate);
        const text = `
This is to certify that ${sanitizeHTML(data.name)} worked with Gopeshwar Vision 
as ${sanitizeHTML(data.designation)} for ${experience} year(s).

We appreciate the contribution and professionalism shown during employment.

Regards,
Gopeshwar Vision HR Team
        `;

        doc.text(text, 20, 60);
        this.addSignature(doc);
        doc.save(`${data.name}_Experience_Letter.pdf`);
    }

    generateSalarySlip(data) {
        const doc = new this.jsPDF();
        const incrementAmount = Math.round((data.salary * data.increment) / 100);
        const finalSalary = parseInt(data.salary) + incrementAmount;

        doc.setFontSize(24);
        doc.text("GOPESHWAR VISION", 20, 20);
        doc.setFontSize(14);
        doc.text("Salary Slip", 20, 35);
        doc.line(20, 40, 190, 40);
        doc.setFontSize(13);

        doc.text(`Employee Name: ${sanitizeHTML(data.name)}`, 20, 60);
        doc.text(`Designation: ${sanitizeHTML(data.designation)}`, 20, 80);
        doc.text(`Increment: ${data.increment}%`, 20, 100);
        doc.text(`Final Salary: ${formatCurrency(finalSalary)}`, 20, 120);
        doc.text(`Joining Date: ${formatDate(data.joiningDate)}`, 20, 140);

        this.addSignature(doc);
        doc.save(`${data.name}_Salary_Slip.pdf`);
    }
}

const pdfGenerator = new PDFGenerator();