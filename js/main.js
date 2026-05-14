// ══════════════════════════════════════════════
//  EMAILJS CONFIG  —  Completa estos 3 valores:
//  1. Crea cuenta gratis en https://emailjs.com
//  2. Add Email Service (Gmail) → copia el Service ID
//  3. Create Email Template → copia el Template ID
//  4. Account → API Keys → copia la Public Key
//
//  Variables del template EmailJS:
//    {{from_name}}  →  campo "nombre" del form
//    {{from_email}} →  campo "email" del form
//    {{message}}    →  campo "mensaje" del form
// ══════════════════════════════════════════════
const EJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';

// ── Mobile hamburger menu ──────────────────────
const menuToggle = document.querySelector('.menu-toggle');
const navList    = document.querySelector('.list');

function closeNav() {
    navList?.classList.remove('open');
    menuToggle?.classList.remove('active');
    menuToggle?.setAttribute('aria-expanded', 'false');
}

if (menuToggle && navList) {
    menuToggle.addEventListener('click', e => {
        e.stopPropagation();
        const isOpen = navList.classList.toggle('open');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.list_item a').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Close when clicking outside the nav
    document.addEventListener('click', e => {
        if (!e.target.closest('header')) closeNav();
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeNav();
    });
}

// ── Scroll-reveal animations ───────────────────
const revealObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in').forEach(el => revealObserver.observe(el));

// ── Language bar animation ─────────────────────
const langObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target;
            const target = fill.dataset.width || '0';
            requestAnimationFrame(() => {
                fill.style.width = target + '%';
            });
            langObserver.unobserve(fill);
        }
    }),
    { threshold: 0.5 }
);

document.querySelectorAll('.CVLangFill').forEach(el => langObserver.observe(el));

// ── Project filter ─────────────────────────────
const filterBtns  = document.querySelectorAll('.FiltroBtn');
const projectCards = document.querySelectorAll('.ProjectCard');
const counter     = document.getElementById('numVisible');

function filterProjects(category) {
    let visible = 0;

    projectCards.forEach(card => {
        const match = category === 'todos' || card.dataset.cat === category;
        card.classList.toggle('hidden', !match);
        if (match) visible++;
    });

    if (counter) counter.textContent = visible;
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        filterProjects(btn.dataset.filter);
    });
});

// ── Contact form (EmailJS) ─────────────────────
const contactForm  = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

if (contactForm && formFeedback) {
    // Init EmailJS if SDK is loaded and key is set
    if (typeof emailjs !== 'undefined' && EJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init({ publicKey: EJS_PUBLIC_KEY });
    }

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!contactForm.checkValidity()) {
            formFeedback.textContent = 'Por favor completa todos los campos correctamente.';
            formFeedback.className = 'FormFeedback error';
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const origText  = submitBtn.textContent;

        // EmailJS not configured → mailto fallback
        if (typeof emailjs === 'undefined' || EJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
            const nombre  = document.getElementById('nombre')?.value || '';
            const email   = document.getElementById('email')?.value || '';
            const mensaje = document.getElementById('mensaje')?.value || '';
            const body    = encodeURIComponent(`Nombre: ${nombre}\n\n${mensaje}`);
            const subject = encodeURIComponent(`Contacto desde portafolio — ${nombre}`);
            window.location.href = `mailto:brolkwin@gmail.com?subject=${subject}&body=${body}&cc=${encodeURIComponent(email)}`;
            formFeedback.textContent = 'Se abrió tu cliente de correo. ¡Gracias por escribirme!';
            formFeedback.className = 'FormFeedback success';
            contactForm.reset();
            return;
        }

        submitBtn.textContent = 'Enviando…';
        submitBtn.disabled = true;

        emailjs.sendForm(EJS_SERVICE_ID, EJS_TEMPLATE_ID, contactForm)
            .then(() => {
                formFeedback.textContent = '¡Mensaje enviado con éxito! Te contactaré pronto.';
                formFeedback.className = 'FormFeedback success';
                contactForm.reset();
            })
            .catch(() => {
                formFeedback.innerHTML = 'Hubo un error al enviar. Escríbeme directamente a '
                    + '<a href="mailto:brolkwin@gmail.com">brolkwin@gmail.com</a>';
                formFeedback.className = 'FormFeedback error';
            })
            .finally(() => {
                submitBtn.textContent = origText;
                submitBtn.disabled = false;
            });
    });
}
