
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

// ── Contact form (Formspree) ───────────────────
const contactForm  = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!contactForm.checkValidity()) {
            formFeedback.textContent = 'Por favor completa todos los campos correctamente.';
            formFeedback.className = 'FormFeedback error';
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const origText  = submitBtn.textContent;
        submitBtn.textContent = 'Enviando…';
        submitBtn.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formFeedback.textContent = '¡Mensaje enviado con éxito! Te contactaré pronto.';
                formFeedback.className = 'FormFeedback success';
                contactForm.reset();
            } else {
                throw new Error();
            }
        } catch {
            formFeedback.innerHTML = 'Hubo un error al enviar. Escríbeme a '
                + '<a href="mailto:brolkwin@gmail.com">brolkwin@gmail.com</a>';
            formFeedback.className = 'FormFeedback error';
        } finally {
            submitBtn.textContent = origText;
            submitBtn.disabled = false;
        }
    });
}
