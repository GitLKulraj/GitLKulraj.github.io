// Comments show/hide toggle with ARIA updates
const toggleBtn = document.querySelector('.show-hide');
const commentWrapper = document.getElementById('comment-wrapper');

if (toggleBtn && commentWrapper) {
  toggleBtn.addEventListener('click', () => {
    const isHidden = commentWrapper.hasAttribute('hidden');
    if (isHidden) {
      commentWrapper.removeAttribute('hidden');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.textContent = 'Hide comments';
      // Move focus to the first focusable inside the wrapper for keyboard users
      const firstFocusable = commentWrapper.querySelector('input, textarea, button, a, select, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) firstFocusable.focus();
    } else {
      commentWrapper.setAttribute('hidden', '');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = 'Show comments';
      toggleBtn.focus();
    }
  });
}

// Comment form: validate, sanitize, and append
const form = document.querySelector('.comment-form');
const nameField = document.getElementById('comment-name');
const commentField = document.getElementById('comment-text');
const errName = document.getElementById('err-name');
const errComment = document.getElementById('err-comment');
const list = document.querySelector('.comment-list');

// Utility: create text node safely (prevents HTML injection)
function addComment(name, text) {
  const li = document.createElement('li');

  const pName = document.createElement('p');
  pName.className = 'comment-author';
  const strong = document.createElement('strong');
  strong.appendChild(document.createTextNode(name));
  pName.appendChild(strong);

  const pText = document.createElement('p');
  pText.appendChild(document.createTextNode(text));

  li.appendChild(pName);
  li.appendChild(pText);

  list.appendChild(li);

  // Announce addition for screen readers via aria-live region (list)
  // Optionally set focus to the new comment
  li.setAttribute('tabindex', '-1');
  li.focus({ preventScroll: true });
  li.addEventListener('blur', () => li.removeAttribute('tabindex'), { once: true });
}

// Trim helper
function val(el) {
  return (el.value || '').trim();
}

// Show/hide error helper
function showError(el, errEl, show, message) {
  if (!errEl) return;
  if (show) {
    errEl.hidden = false;
    if (message) errEl.textContent = message;
    el.setAttribute('aria-invalid', 'true');
    el.setAttribute('aria-describedby', errEl.id);
  } else {
    errEl.hidden = true;
    el.removeAttribute('aria-invalid');
    el.removeAttribute('aria-describedby');
  }
}

if (form && nameField && commentField && list) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = val(nameField);
    const comment = val(commentField);

    // Basic validation
    let hasError = false;

    if (!name) {
      showError(nameField, errName, true, 'Please enter your name.');
      hasError = true;
    } else {
      showError(nameField, errName, false);
    }

    if (!comment) {
      showError(commentField, errComment, true, 'Please enter a comment.');
      hasError = true;
    } else if (comment.length > 1000) {
      showError(commentField, errComment, true, 'Comment is too long (max 1000 characters).');
      hasError = true;
    } else {
      showError(commentField, errComment, false);
    }

    if (hasError) {
      // Move focus to the first error
      if (!name) nameField.focus();
      else if (!comment) commentField.focus();
      return;
    }

    addComment(name, comment);

    // Clear fields
    nameField.value = '';
    commentField.value = '';

    // Return focus to name for quick successive entries
    nameField.focus();
  });

  // Real-time validation feedback on blur
  nameField.addEventListener('blur', () => {
    if (val(nameField)) showError(nameField, errName, false);
  });
  commentField.addEventListener('blur', () => {
    const v = val(commentField);
    if (v && v.length <= 1000) showError(commentField, errComment, false);
  });
}

// Progressive enhancement: open comments section if URL hash targets it
if (location.hash && location.hash.replace('#', '') === 'comment-wrapper') {
  if (commentWrapper && toggleBtn) {
    commentWrapper.removeAttribute('hidden');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.textContent = 'Hide comments';
  }
}