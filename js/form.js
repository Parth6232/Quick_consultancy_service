/**
 * form.js
 * Handles consultation form submission, phone validation, and routing to Email / WhatsApp.
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('consultation-form');
    if (!form) return;

    const nameInput = document.getElementById('form-name');
    const phoneInput = document.getElementById('form-phone');
    const serviceInput = document.getElementById('form-service');
    const phoneError = document.getElementById('phone-error');
    const formSuccess = document.getElementById('form-success');
    const btnWa = document.getElementById('btn-submit-wa');

    // Remove any non-digits from phone input
    phoneInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length === 10) {
            phoneError.classList.add('hidden');
        }
    });

    function validatePhone() {
        const val = phoneInput.value.trim();
        if (val.length !== 10) {
            phoneError.classList.remove('hidden');
            return false;
        }
        phoneError.classList.add('hidden');
        return true;
    }

    // Submit via Email (Default Form Submit)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validatePhone()) return;

        const name = nameInput.value.trim();
        const phone = '+91' + phoneInput.value.trim();
        const service = serviceInput.value;

        const subject = encodeURIComponent(`New Consultation Request from ${name}`);
        const body = encodeURIComponent(`Hello,\n\nI would like to request a consultation.\n\nDetails:\nName: ${name}\nPhone: ${phone}\nService Required: ${service}\n\nThank you.`);

        const mailtoLink = `mailto:indore@quickconsulting.in?subject=${subject}&body=${body}`;
        
        console.log("Mailto Link Generated:", mailtoLink);
        window.location.href = mailtoLink;

        formSuccess.textContent = 'Opening your email app — please hit Send to complete your request!';
        formSuccess.classList.remove('hidden');
        
        // Reset form visually after a short delay
        setTimeout(() => {
            form.reset();
            setTimeout(() => {
                formSuccess.classList.add('hidden');
            }, 5000);
        }, 1000);
    });

    // Submit via WhatsApp
    if (btnWa) {
        btnWa.addEventListener('click', () => {
            // If phone is empty, we still let them use WA, but if they filled it partially, show error
            const val = phoneInput.value.trim();
            if (val.length > 0 && val.length !== 10) {
                phoneError.classList.remove('hidden');
                return;
            }
            phoneError.classList.add('hidden');

            const name = nameInput.value.trim() || 'A new visitor';
            const phone = val.length === 10 ? '+91' + val : 'Not provided';
            const service = serviceInput.value;

            const text = encodeURIComponent(`Hello, I would like to request a consultation.\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Service:* ${service}`);
            const waLink = `https://wa.me/918109101811?text=${text}`;

            window.open(waLink, '_blank');
            
            formSuccess.textContent = 'Opening WhatsApp...';
            formSuccess.classList.remove('hidden');
            
            setTimeout(() => {
                formSuccess.classList.add('hidden');
            }, 5000);
        });
    }

    // Submit via Call Us Instead
    const btnCall = document.getElementById('btn-submit-call');
    if (btnCall) {
        btnCall.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'tel:+918109101811';
        });
    }
});
