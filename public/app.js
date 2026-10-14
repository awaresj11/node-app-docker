document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.className = '';
  status.textContent = 'Sending...';
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong.');
    form.reset();
    status.className = 'ok';
    status.textContent = 'Message sent. I will reply within a day.';
  } catch (err) {
    status.className = 'err';
    status.textContent = err.message;
  }
});
