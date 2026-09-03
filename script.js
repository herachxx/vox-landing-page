const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const leadModal = document.getElementById('lead-modal');
const techModal = document.getElementById('tech-modal');
const modalLeadForm = document.getElementById('modal-lead-form');
const pageLeadForm = document.getElementById('lead-form');
const WA_PHONE = '77053456789';

function onScroll() {
  header?.classList.toggle('scrolled', window.scrollY > 14);
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  mobileNav.hidden = isOpen;
});

mobileNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.hidden = true;
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

function openDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  document.body.classList.add('modal-open');
}
function closeDialog(dialog) {
  if (!dialog) return;
  dialog.close();
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.js-open-lead').forEach(button => {
  button.addEventListener('click', () => {
    const plan = button.dataset.plan || 'Пилот';
    const planInput = modalLeadForm?.querySelector('[name="plan"]');
    if (planInput) planInput.value = plan;
    if (!mobileNav?.hidden) {
      mobileNav.hidden = true;
      menuButton?.setAttribute('aria-expanded', 'false');
    }
    openDialog(leadModal);
  });
});

document.querySelectorAll('.js-close-modal').forEach(button => button.addEventListener('click', () => closeDialog(leadModal)));
document.querySelectorAll('.js-open-tech').forEach(button => button.addEventListener('click', () => openDialog(techModal)));
document.querySelectorAll('.js-close-tech').forEach(button => button.addEventListener('click', () => closeDialog(techModal)));

[leadModal, techModal].forEach(dialog => {
  dialog?.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    const inDialog = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inDialog) closeDialog(dialog);
  });
  dialog?.addEventListener('close', () => document.body.classList.remove('modal-open'));
});

function whatsappFromForm(form) {
  const data = new FormData(form);
  const name = (data.get('name') || '').toString().trim();
  const clinic = (data.get('clinic') || '').toString().trim();
  const phone = (data.get('phone') || '').toString().trim();
  const goal = (data.get('goal') || '').toString().trim();
  const plan = (data.get('plan') || 'Пилот').toString().trim();

  const lines = [
    'Здравствуйте! Хочу обсудить Vox.',
    '',
    `Формат: ${plan}`,
    `Имя: ${name}`,
    `Клиника / специальность: ${clinic}`,
    `Мой контакт: ${phone}`
  ];
  if (goal) lines.push(`Что хочу автоматизировать: ${goal}`);

  const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

[modalLeadForm, pageLeadForm].forEach(form => {
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    whatsappFromForm(form);
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Keep only one FAQ item open at a time for a cleaner mobile experience.
document.querySelectorAll('.faq-list details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details').forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});
