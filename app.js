// Official VCC50000 AI Assistant link
const GPT_ASSISTANT_URL = 'https://chatgpt.com/g/g-69d308e63dec8191a773b8cf9cf13ddd-vcc50000-ai';

const nav = document.getElementById('nav');
const mobileToggle = document.getElementById('mobileToggle');
const profileCta = document.getElementById('profileCta');
const resetProfile = document.getElementById('resetProfile');
const profileSummary = document.getElementById('profileSummary');
const form = document.getElementById('contactForm');
const advisorModal = document.getElementById('advisorModal');
const advisorForm = document.getElementById('advisorForm');
const advisorInput = document.getElementById('advisorInput');
const advisorMessages = document.getElementById('advisorMessages');
const advisorSubmit = document.getElementById('advisorSubmit');
const principalAdvisorButtons = document.querySelectorAll('[data-principal-advisor]');
const ASESOR_API_ENDPOINT = window.VCC50000_ASESOR_API_URL || '/api/asesor-principal';
let advisorPreviousResponseId = null;


const profile = {
  client: '',
  interest: [],
  experience: ''
};

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

document.querySelectorAll('[data-gpt-link]').forEach((link) => {
  link.href = GPT_ASSISTANT_URL;
});

if (mobileToggle && nav) {
  mobileToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

document.querySelectorAll('.selectable-group').forEach((group) => {
  const groupName = group.dataset.group;
  const isMultiple = group.classList.contains('multiple');

  group.querySelectorAll('.select-card').forEach((card) => {
    card.addEventListener('click', () => {
      const value = card.dataset.value;

      if (isMultiple) {
        card.classList.toggle('selected');

        if (profile[groupName].includes(value)) {
          profile[groupName] = profile[groupName].filter((item) => item !== value);
        } else {
          profile[groupName].push(value);
        }
      } else {
        group.querySelectorAll('.select-card').forEach((item) => item.classList.remove('selected'));
        card.classList.add('selected');
        profile[groupName] = value;
      }

      updateProfileSummary();
    });
  });
});

if (resetProfile) {
  resetProfile.addEventListener('click', () => {
    profile.client = '';
    profile.interest = [];
    profile.experience = '';
    document.querySelectorAll('.select-card').forEach((card) => card.classList.remove('selected'));
    updateProfileSummary();
  });
}

function updateProfileSummary() {
  const summary = [
    profile.client ? `Client profile: ${profile.client}` : '',
    profile.interest.length ? `Interests: ${profile.interest.join(', ')}` : '',
    profile.experience ? `Experience: ${profile.experience}` : ''
  ].filter(Boolean).join(' | ');

  if (profileSummary) {
    profileSummary.value = summary;
  }

  if (profileCta) {
    profileCta.textContent = summary ? 'Continue with My Profile' : 'Continue';
  }
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const subject = encodeURIComponent('VCC50000 Consultation Request');
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\n` +
      `Email: ${data.get('email')}\n` +
      `Service: ${data.get('service')}\n` +
      `Investment Range: ${data.get('budget') || 'Not specified'}\n` +
      `Investor Profile: ${(profileSummary && profileSummary.value) || 'Not completed'}\n\n` +
      `Message:\n${data.get('message') || 'No additional message.'}`
    );

    window.location.href = `mailto:contact@vcc50000.com?subject=${subject}&body=${body}`;
  });
}


function openAdvisorModal() {
  if (!advisorModal) return;
  advisorModal.classList.add('open');
  advisorModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  setTimeout(() => {
    if (advisorInput) advisorInput.focus();
  }, 120);
}

function closeAdvisorModal() {
  if (!advisorModal) return;
  advisorModal.classList.remove('open');
  advisorModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function addAdvisorMessage(message, type = 'assistant') {
  if (!advisorMessages) return;

  const bubble = document.createElement('div');
  bubble.className = `advisor-message ${type}`;
  bubble.textContent = message;
  advisorMessages.appendChild(bubble);
  advisorMessages.scrollTop = advisorMessages.scrollHeight;
}

function setAdvisorLoading(isLoading) {
  if (advisorSubmit) {
    advisorSubmit.disabled = isLoading;
    advisorSubmit.textContent = isLoading ? 'Consultando...' : 'Enviar';
  }

  if (advisorInput) {
    advisorInput.disabled = isLoading;
  }
}

principalAdvisorButtons.forEach((button) => {
  button.addEventListener('click', openAdvisorModal);
});

document.querySelectorAll('[data-advisor-close]').forEach((button) => {
  button.addEventListener('click', closeAdvisorModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && advisorModal && advisorModal.classList.contains('open')) {
    closeAdvisorModal();
  }
});

if (advisorForm) {
  advisorForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = advisorInput ? advisorInput.value.trim() : '';
    if (!message) return;

    addAdvisorMessage(message, 'user');
    advisorForm.reset();
    setAdvisorLoading(true);

    try {
      const response = await fetch(ASESOR_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          topic: message,
          previousResponseId: advisorPreviousResponseId
        })
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        const startsWithHtml = text.trim().startsWith('<');
        throw new Error(
          startsWithHtml
            ? 'El frontend está recibiendo HTML en vez de JSON. En GitHub Pages esto pasa porque /api/asesor-principal no existe. Publica server.js en Render, Railway o Vercel y coloca esa URL en config.js.'
            : 'El servidor no devolvió JSON. Revisa la URL del backend en config.js.'
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo invocar el agente.');
      }

      advisorPreviousResponseId = data.responseId || advisorPreviousResponseId;
      addAdvisorMessage(data.reply || 'El agente no devolvió texto.', 'assistant');
    } catch (error) {
      console.error(error);
      addAdvisorMessage(error.message || 'No pude conectar con Asesor Principal.ai. Revisa que el backend esté publicado y que OPENAI_API_KEY esté configurado.', 'assistant error');
    } finally {
      setAdvisorLoading(false);
      if (advisorInput) advisorInput.focus();
    }
  });
}


const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
