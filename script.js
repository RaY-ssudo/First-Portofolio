// ── SECTION NAVIGATION ──────────────────────────────────────────────────────

function showSection(sectionId, el) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));

    document.getElementById(sectionId).style.display = 'flex';
    if (el) el.classList.add('active');

    history.replaceState(null, null, '#' + sectionId);
}

document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href').substring(1);
        showSection(target, this);
    });
});

window.onload = function () {
    // Load EmailJS SDK dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = function () {
        // ── REPLACE with your actual EmailJS Public Key ──
        emailjs.init('YOUR_PUBLIC_KEY');
    };
    document.head.appendChild(script);

    // Show correct section on load
    const hash = window.location.hash.substring(1) || 'home';
    const link = document.querySelector(`nav a[href="#${hash}"]`);
    showSection(hash, link);
};


// ── CONTACT FORM ─────────────────────────────────────────────────────────────

function sendMail() {
    const nameEl    = document.getElementById('name');
    const emailEl   = document.getElementById('email');
    const subjectEl = document.getElementById('subject');
    const messageEl = document.getElementById('message');
    const btn       = document.querySelector('.contact-form button');

    const name    = nameEl.value.trim();
    const email   = emailEl.value.trim();
    const subject = subjectEl.value.trim();
    const message = messageEl.value.trim();

    // ── Validation ──
    if (!name || !email || !subject || !message) {
        showToast('⚠️ Please fill in all fields.', 'warn');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('⚠️ Please enter a valid email address.', 'warn');
        return;
    }

    // ── Send via EmailJS ──
    btn.disabled    = true;
    btn.textContent = 'Sending...';

    // ── REPLACE with your actual EmailJS Service ID & Template ID ──
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        from_name:    name,
        from_email:   email,
        subject:      subject,
        message:      message,
        to_email:     'rashidrayiden@gmail.com'
    })
    .then(function () {
        showToast('✅ Message sent! I\'ll get back to you soon.', 'success');
        nameEl.value    = '';
        emailEl.value   = '';
        subjectEl.value = '';
        messageEl.value = '';
        btn.textContent = 'Send Message';
        btn.disabled    = false;
    })
    .catch(function (error) {
        console.error('EmailJS error:', error);
        showToast('❌ Failed to send. Please try again later.', 'error');
        btn.textContent = 'Send Message';
        btn.disabled    = false;
    });
}


// ── TOAST NOTIFICATION ────────────────────────────────────────────────────────

function showToast(msg, type) {
    // Remove any existing toast
    const old = document.getElementById('toast');
    if (old) old.remove();

    const colors = {
        success : '#2b4fc5',
        warn    : '#c5a72b',
        error   : '#c52b2b'
    };

    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.textContent = msg;

    Object.assign(toast.style, {
        position        : 'fixed',
        bottom          : '3rem',
        right           : '3rem',
        background      : colors[type] || '#2b4fc5',
        color           : 'white',
        padding         : '1.4rem 2.4rem',
        borderRadius    : '0.8rem',
        fontSize        : '1.5rem',
        fontFamily      : "'JetBrains Mono', monospace",
        boxShadow       : '0 8px 30px rgba(0,0,0,0.4)',
        zIndex          : '9999',
        opacity         : '0',
        transform       : 'translateY(10px)',
        transition      : 'opacity 0.3s ease, transform 0.3s ease',
        maxWidth        : '36rem'
    });

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity   = '1';
        toast.style.transform = 'translateY(0)';
    });

    // Animate out after 4 seconds
    setTimeout(() => {
        toast.style.opacity   = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
