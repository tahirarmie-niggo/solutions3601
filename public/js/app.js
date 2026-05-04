var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.reveal').forEach(function(el) {
    observer.observe(el);
  });
});

function showMsg(el, type, text) {
  el.className = 'form-msg ' + type;
  el.textContent = text;
  el.style.display = 'block';
  setTimeout(function() { el.style.display = 'none'; }, 6000);
}

function submitInquiry(fields, btnId, msgId) {
  var btn = document.getElementById(btnId);
  var msg = document.getElementById(msgId);
  if (!fields.name || !fields.email || !fields.phone) {
    showMsg(msg, 'error', 'Please fill in your name, email and phone.');
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Sending...';
  fetch('/api/inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields)
  })
  .then(function(res) { return res.json(); })
  .then(function(result) {
    showMsg(msg, result.success ? 'success' : 'error', result.message);
    if (result.success) {
      btn.textContent = 'Inquiry Sent!';
    } else {
      btn.disabled = false;
      btn.textContent = 'Submit Inquiry';
    }
  })
  .catch(function() {
    showMsg(msg, 'error', 'Something went wrong. Please try again.');
    btn.disabled = false;
    btn.textContent = 'Submit Inquiry';
  });
}
