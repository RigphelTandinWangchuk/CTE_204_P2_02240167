let assignments = [];
const form = document.getElementById('assignment-form');
const inputModule = document.getElementById('module-name');
const inputTitle = document.getElementById('assignment-title');
const inputDate = document.getElementById('due-date');
const inputPriority = document.getElementById('priority');
const clearBtn = document.getElementById('clear-form-btn');
const listEl = document.getElementById('assignment-list');
const emptyState = document.getElementById('empty-state');
const countPending = document.getElementById('count-pending');
const countOverdue = document.getElementById('count-overdue');
const countDone = document.getElementById('count-done');

function getTodayISO() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const dd   = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getUrgencyStatus(assignment) {
  if (assignment.completed) return 'done';
  const today    = getTodayISO();
  const dueDate  = assignment.dueDate;
  if (dueDate < today) return 'overdue';

  const msPerDay    = 1000 * 60 * 60 * 24;
  const dueMidnight = new Date(dueDate + 'T00:00:00');
  const nowMidnight = new Date(today + 'T00:00:00');
  const daysUntil   = (dueMidnight - nowMidnight) / msPerDay;

  if (daysUntil <= 2) return 'warning';
  return 'ok';
}

function getUrgencyLabel(status) {
  const labels = { done: 'Completed', overdue: 'Overdue', warning: 'Due Soon', ok: 'Upcoming' };
  return labels[status] || '';
}

function formatDate(isoDate) {
  const [yyyy, mm, dd] = isoDate.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${parseInt(dd, 10)} ${months[parseInt(mm, 10) - 1]} ${yyyy}`;
}

/* API NETWORK OPERATIONS */
async function fetchAssignments() {
  try {
    const res = await fetch('/api/assignments');
    assignments = await res.json();
    renderAll();
  } catch (err) {
    console.error('Failed fetching assignments', err);
  }
}

async function addAssignment() {
  const payload = {
    moduleName: inputModule.value.trim(),
    title: inputTitle.value.trim(),
    dueDate: inputDate.value,
    priority: inputPriority.value
  };

  try {
    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) await fetchAssignments();
  } catch (err) {
    console.error('Failed submitting assignment', err);
  }
}

async function toggleComplete(id) {
  try {
    const res = await fetch(`/api/assignments/${id}/toggle`, { method: 'PATCH' });
    if (res.ok) await fetchAssignments();
  } catch (err) {
    console.error('Toggle complete failed', err);
  }
}

async function deleteAssignment(id) {
  try {
    const res = await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
    if (res.ok) await fetchAssignments();
  } catch (err) {
    console.error('Delete processing failure', err);
  }
}

/* DOM RENDERING */
function createAssignmentCard(assignment) {
  const status       = getUrgencyStatus(assignment);
  const urgencyLabel = getUrgencyLabel(status);

  const li = document.createElement('li');
  li.className = `assignment-card status-${status}`;
  li.dataset.id = assignment.id;

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const moduleEl = document.createElement('span');
  moduleEl.className = 'card-module';
  moduleEl.textContent = assignment.moduleName;

  const titleEl = document.createElement('h3');
  titleEl.className = 'card-title';
  titleEl.textContent = assignment.title;

  const metaEl = document.createElement('div');
  metaEl.className = 'card-meta';

  const dueEl = document.createElement('span');
  dueEl.className = 'card-due';
  dueEl.textContent = 'Due: ' + formatDate(assignment.dueDate);

  const urgencyBadge = document.createElement('span');
  urgencyBadge.className = `card-urgency urgency-${status}`;
  urgencyBadge.textContent = urgencyLabel;

  const priorityBadge = document.createElement('span');
  priorityBadge.className = `badge-priority priority-${assignment.priority}`;
  priorityBadge.textContent = assignment.priority;

  metaEl.appendChild(dueEl);
  metaEl.appendChild(urgencyBadge);
  metaEl.appendChild(priorityBadge);
  cardBody.appendChild(moduleEl);
  cardBody.appendChild(titleEl);
  cardBody.appendChild(metaEl);

  const cardActions = document.createElement('div');
  cardActions.className = 'card-actions';

  const completeBtn = document.createElement('button');
  completeBtn.type = 'button';
  completeBtn.className = 'btn btn-complete';
  completeBtn.textContent = assignment.completed ? 'Undo' : '✓ Done';
  completeBtn.addEventListener('click', () => toggleComplete(assignment.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn btn-delete';
  deleteBtn.textContent = '✕ Delete';
  deleteBtn.addEventListener('click', () => deleteAssignment(assignment.id));

  cardActions.appendChild(completeBtn);
  cardActions.appendChild(deleteBtn);
  li.appendChild(cardBody);
  li.appendChild(cardActions);

  return li;
}

function renderList() {
  while (listEl.firstChild) {
    listEl.removeChild(listEl.firstChild);
  }
  if (assignments.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    assignments.forEach(function(assignment) {
      const card = createAssignmentCard(assignment);
      listEl.appendChild(card);
    });
  }
}

function renderSummary() {
  const today = getTodayISO();
  let pending  = 0, overdue  = 0, completed = 0;

  assignments.forEach(function(a) {
    if (a.completed) {
      completed++;
    } else {
      pending++;
      if (a.dueDate < today) overdue++;
    }
  });

  countPending.textContent  = pending;
  countOverdue.textContent  = overdue;
  countDone.textContent     = completed;
}

function renderAll() {
  renderList();
  renderSummary();
}

function clearValidationErrors() {
  ['module-name', 'assignment-title', 'due-date', 'priority'].forEach(function(id) {
    const errorEl = document.getElementById(id + '-error');
    const inputEl = document.getElementById(id);
    if (errorEl) errorEl.textContent = '';
    if (inputEl) inputEl.classList.remove('is-invalid');
  });
}

function validateForm() {
  let isValid = true;
  const today = getTodayISO();

  if (inputModule.value.trim() === '') {
    showFieldError('module-name', 'Module name is required.');
    isValid = false;
  }
  if (inputTitle.value.trim() === '') {
    showFieldError('assignment-title', 'Assignment title is required.');
    isValid = false;
  }
  if (inputDate.value === '') {
    showFieldError('due-date', 'Please select a due date.');
    isValid = false;
  } else if (inputDate.value < today) {
    showFieldError('due-date', 'Due date cannot be in the past.');
    isValid = false;
  }
  if (inputPriority.value === '') {
    showFieldError('priority', 'Please select a priority level.');
    isValid = false;
  }
  return isValid;
}

function showFieldError(fieldId, message) {
  const inputEl = document.getElementById(fieldId);
  const errorEl = document.getElementById(fieldId + '-error');
  if (inputEl) inputEl.classList.add('is-invalid');
  if (errorEl) errorEl.textContent = message;
}

function resetForm() {
  inputModule.value = '';
  inputTitle.value = '';
  inputDate.value = '';
  inputPriority.value = '';
  clearValidationErrors();
}

form.addEventListener('submit', async function(event) {
  event.preventDefault();
  clearValidationErrors();
  if (!validateForm()) return;

  await addAssignment();
  resetForm();
});

clearBtn.addEventListener('click', () => resetForm());

[inputModule, inputTitle, inputDate].forEach(function(inputEl) {
  inputEl.addEventListener('input', function() {
    inputEl.classList.remove('is-invalid');
    const errorEl = document.getElementById(inputEl.id + '-error');
    if (errorEl) errorEl.textContent = '';
  });
});

inputPriority.addEventListener('change', function() {
  inputPriority.classList.remove('is-invalid');
  const errorEl = document.getElementById('priority-error');
  if (errorEl) errorEl.textContent = '';
});

function init() {
  inputDate.setAttribute('min', getTodayISO());
  fetchAssignments();
}

init();