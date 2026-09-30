const header = document.querySelector('#siteHeader');
const menuToggle = document.querySelector('#menuToggle');
const primaryNav = document.querySelector('#primaryNav');

function updateHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 20);
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  primaryNav?.classList.toggle('is-open', !isOpen);
});

primaryNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open menu');
  });
});

const form = document.querySelector('#volunteerForm');
const status = document.querySelector('#formStatus');
const submitButton = document.querySelector('#formSubmit');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const fields = new FormData(form);
  const csrfToken = fields.get('csrfmiddlewaretoken');
  const payload = Object.fromEntries(fields.entries());
  delete payload.csrfmiddlewaretoken;

  status.hidden = false;
  status.className = 'form-status';
  status.textContent = 'Registering...';
  submitButton.disabled = true;

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to register. Please try again.');

    status.classList.add('success');
    status.textContent = result.message;
    form.reset();
  } catch (error) {
    status.classList.add('error');
    status.textContent = error instanceof Error ? error.message : 'Network error. Please check your connection.';
  } finally {
    submitButton.disabled = false;
  }
});
