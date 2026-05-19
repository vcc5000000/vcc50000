// Official VCC50000 AI Assistant link
const GPT_ASSISTANT_URL = 'https://chatgpt.com/g/g-69d308e63dec8191a773b8cf9cf13ddd-vcc50000-ai';

const nav = document.getElementById('nav');
const mobileToggle = document.getElementById('mobileToggle');
const profileCta = document.getElementById('profileCta');
const resetProfile = document.getElementById('resetProfile');
const profileSummary = document.getElementById('profileSummary');
const form = document.getElementById('contactForm');

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

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
