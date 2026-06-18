// ── SECTION NAVIGATION ──────────────────────────────────────────────────────
function showSection(sectionId, el) {
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    document.getElementById(sectionId).style.display = 'flex';
    if (el) el.classList.add('active');
    history.replaceState(null, null, '#' + sectionId);
}

// Attach click handlers to nav links
document.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href').substring(1);
        showSection(target, this);
    });
});

window.onload = function () {
    const hash = window.location.hash.substring(1) || 'home';
    const link = document.querySelector(`nav a[href="#${hash}"]`);
    showSection(hash, link);
};

// ── CV DOWNLOAD DROPDOWN ──────────────────────────────────────────────────────
const cvBtn      = document.getElementById('cvBtn');
const cvDropdown = document.getElementById('cvDropdown');

// Toggle dropdown on button click
cvBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    cvDropdown.classList.toggle('open');
    cvBtn.classList.toggle('open');
});

// Close dropdown when clicking outside
document.addEventListener('click', function () {
    cvDropdown.classList.remove('open');
    cvBtn.classList.remove('open');
});

// Prevent clicks inside dropdown from closing it
cvDropdown.addEventListener('click', function (e) {
    e.stopPropagation();
});

/**
 * Trigger a file download.
 * @param {string} filename - The name of the CV file to download.
 */
function downloadCV(filename) {
    const link = document.createElement('a');
    link.href = filename;          // e.g. "cv-en.pdf" or "cv-id.pdf"
    link.download = filename;
    link.click();
}

/**
 * Download both CV versions with a small delay between them
 * so browsers don't block the second download.
 */
function downloadAll() {
    downloadCV('cv-en.pdf');
    setTimeout(() => downloadCV('cv-id.pdf'), 400);
    cvDropdown.classList.remove('open');
    cvBtn.classList.remove('open');
}
