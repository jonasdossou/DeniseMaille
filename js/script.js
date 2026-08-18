document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     Menu hamburger mobile
  --------------------------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.getElementById('mainNav');

  if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      const icon = hamburgerBtn.querySelector('i');
      const isOpen = mainNav.classList.contains('active');
      icon.classList.toggle('fa-bars', !isOpen);
      icon.classList.toggle('fa-xmark', isOpen);
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Sous-menu déroulant au tap sur mobile
    document.querySelectorAll('.dropdown > a').forEach((link) => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 860) {
          e.preventDefault();
          link.closest('.dropdown').classList.toggle('open');
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     Slider de témoignages dynamique
  --------------------------------------------------------------------- */
  const testimonials = [
    {
      quote: "« Des créations magnifiques, uniques et de très bonne qualité. Je recommande vivement Denise Maille ! »",
      author: "Aline K.",
      rating: 5
    },
    {
      quote: "« Les finitions sont impeccables et le tricot est incroyablement doux. Un vrai coup de cœur pour la marque. »",
      author: "Carine M.",
      rating: 5
    },
    {
      quote: "« Ma commande sur mesure est arrivée parfaite, comme dessinée juste pour moi. Un savoir-faire rare. »",
      author: "Odile F.",
      rating: 5
    }
  ];

  let currentTestimonial = 0;
  const quoteEl = document.querySelector('.testimonial-quote');
  const authorEl = document.querySelector('.author-name');
  const avatarEl = document.querySelector('.author-avatar');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  function initials(name) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  function updateTestimonial(index) {
    if (!quoteEl || !authorEl) return;
    const t = testimonials[index];
    quoteEl.textContent = t.quote;
    authorEl.textContent = t.author;
    if (avatarEl) avatarEl.textContent = initials(t.author);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      updateTestimonial(currentTestimonial);
    });

    prevBtn.addEventListener('click', () => {
      currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
      updateTestimonial(currentTestimonial);
    });
  }

  /* ---------------------------------------------------------------------
     Slider du hero (points)
  --------------------------------------------------------------------- */
  const dots = document.querySelectorAll('.slider-dots .dot');
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });

  /* ---------------------------------------------------------------------
     Apparition douce au scroll
  --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------------------
     Header : légère ombre après un petit scroll
  --------------------------------------------------------------------- */
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 6px 20px rgba(36,26,18,0.08)'
        : 'none';
    });
  }

  /* ---------------------------------------------------------------------
     Accordéon FAQ (pages Commander / Contact)
  --------------------------------------------------------------------- */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---------------------------------------------------------------------
     Formulaires (Commander / Contact) — ENVOI RÉEL par e-mail
     via FormSubmit (https://formsubmit.co), sans aucun serveur/backend.
     L'adresse de destination et le sujet sont définis directement dans
     le HTML (attribut "action" du <form> + champ caché "_subject"),
     ce script se charge uniquement d'envoyer les données en AJAX et
     d'afficher un message de confirmation ou d'erreur sans recharger
     la page.
  --------------------------------------------------------------------- */
  document.querySelectorAll('form[data-ajax-form]').forEach((form) => {
    const feedback = form.querySelector('.form-feedback');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnDefaultHTML = submitBtn ? submitBtn.innerHTML : '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Piège à robots (champ caché "_honey") : si rempli, on ignore l'envoi
      const honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Envoi en cours...';
      }
      if (feedback) {
        feedback.classList.remove('show');
        feedback.style.backgroundColor = '';
        feedback.style.color = '';
      }

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Réponse invalide du serveur');

        if (feedback) {
          feedback.textContent = "Merci ! Votre message a bien été envoyé, nous vous répondrons très vite.";
          feedback.classList.add('show');
        }
        form.reset();
      } catch (err) {
        if (feedback) {
          feedback.textContent = "Une erreur est survenue lors de l'envoi. Merci de réessayer, ou de nous écrire directement sur WhatsApp.";
          feedback.style.backgroundColor = 'rgba(168, 90, 46, 0.12)';
          feedback.style.color = 'var(--rust-deep, #7C3F1D)';
          feedback.classList.add('show');
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = btnDefaultHTML;
        }
      }
    });
  });
});
