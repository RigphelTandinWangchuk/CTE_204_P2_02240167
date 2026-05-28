const assignments = [];
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

  // Calculate days until due
  const msPerDay    = 1000 * 60 * 60 * 24;
  const dueMidnight = new Date(dueDate + 'T00:00:00');
  const nowMidnight = new Date(today + 'T00:00:00');
  const daysUntil   = (dueMidnight - nowMidnight) / msPerDay;

  // Warn if due within 2 days
  if (daysUntil <= 2) return 'warning';
  return 'ok';
}

function getUrgencyLabel(status) {
  const labels = {
    done:    'Completed',
    overdue: 'Overdue',
    warning: 'Due Soon',
    ok:      'Upcoming',
  };
  return labels[status] || '';
}

function formatDate(isoDate) {
  const [yyyy, mm, dd] = isoDate.split('-');
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return `${parseInt(dd, 10)} ${months[parseInt(mm, 10) - 1]} ${yyyy}`;
}

function getSortedAssignments() {
  return [...assignments].sort((a, b) => {
    // Completed assignments always go to the bottom
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    // Otherwise sort by due date ascending
    return a.dueDate.localeCompare(b.dueDate);
  });
}

/* VALIDATION
   Checks each field individually and returns error messages.*/
function clearValidationErrors() {
  const fields = ['module-name', 'assignment-title', 'due-date', 'priority'];
  fields.forEach(function(id) {
    const errorEl = document.getElementById(id + '-error');
    const inputEl = document.getElementById(id);
    if (errorEl) errorEl.textContent = '';
    if (inputEl) inputEl.classList.remove('is-invalid');
  });
}

function validateForm() {
  let isValid = true;
  const today = getTodayISO();

  // Validate Module Name
  if (inputModule.value.trim() === '') {
    showFieldError('module-name', 'Module name is required.');
    isValid = false;
  }

  // Validate Assignment Title
  if (inputTitle.value.trim() === '') {
    showFieldError('assignment-title', 'Assignment title is required.');
    isValid = false;
  }

  // Validate Due Date
  if (inputDate.value === '') {
    showFieldError('due-date', 'Please select a due date.');
    isValid = false;
  } else if (inputDate.value < today) {
    showFieldError('due-date', 'Due date cannot be in the past.');
    isValid = false;
  }

  // Validate Priority
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

/* DATA MUTATIONS
   Functions that modify the assignments array and trigger re-render.*/
function addAssignment() {
  const newAssignment = {
    id:         Date.now(),
    moduleName: inputModule.value.trim(),
    title:      inputTitle.value.trim(),
    dueDate:    inputDate.value,
    priority:   inputPriority.value,
    completed:  false,
  };
  assignments.push(newAssignment);
}

function toggleComplete(id) {
  const assignment = assignments.find(function(a) { return a.id === id; });
  if (assignment) {
    assignment.completed = !assignment.completed;
  }
}

function deleteAssignment(id) {
  const index = assignments.findIndex(function(a) { return a.id === id; });
  if (index !== -1) {
    assignments.splice(index, 1);
  }
}

/* DOM RENDERING
   Functions that read from the data array and update the DOM.
   No innerHTML is used; all elements are created via document.createElement. */
function createAssignmentCard(assignment) {
  const status       = getUrgencyStatus(assignment);
  const urgencyLabel = getUrgencyLabel(status);

  // Outer list item
  const li = document.createElement('li');
  li.className = `assignment-card status-${status}`;
  li.dataset.id = assignment.id;

  // Card body 
  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  // Module name
  const moduleEl = document.createElement('span');
  moduleEl.className = 'card-module';
  moduleEl.textContent = assignment.moduleName;

  // Assignment title
  const titleEl = document.createElement('h3');
  titleEl.className = 'card-title';
  titleEl.textContent = assignment.title;

  // Meta row: due date + urgency badge + priority badge
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

  // Card actions 
  const cardActions = document.createElement('div');
  cardActions.className = 'card-actions';

  // Complete/Undo button
  const completeBtn = document.createElement('button');
  completeBtn.type = 'button';
  completeBtn.className = 'btn btn-complete';
  completeBtn.textContent = assignment.completed ? 'Undo' : '✓ Done';
  completeBtn.setAttribute('aria-label',
    (assignment.completed ? 'Mark incomplete: ' : 'Mark complete: ') + assignment.title);

  // Toggle completion on click — updates data, then re-renders
  completeBtn.addEventListener('click', function() {
    toggleComplete(assignment.id);
    renderAll();
  });

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn btn-delete';
  deleteBtn.textContent = '✕ Delete';
  deleteBtn.setAttribute('aria-label', 'Delete assignment: ' + assignment.title);

  // Remove assignment on click — updates data, then re-renders
  deleteBtn.addEventListener('click', function() {
    deleteAssignment(assignment.id);
    renderAll();
  });

  cardActions.appendChild(completeBtn);
  cardActions.appendChild(deleteBtn);

  li.appendChild(cardBody);
  li.appendChild(cardActions);

  return li;
}

function renderList() {
  // Remove all existing card elements
  while (listEl.firstChild) {
    listEl.removeChild(listEl.firstChild);
  }

  const sorted = getSortedAssignments();

  if (sorted.length === 0) {
    // Show the empty state and hide the list
    emptyState.classList.remove('hidden');
  } else {
    // Hide the empty state and populate the list
    emptyState.classList.add('hidden');
    sorted.forEach(function(assignment) {
      const card = createAssignmentCard(assignment);
      listEl.appendChild(card);
    });
  }
}

function renderSummary() {
  const today = getTodayISO();

  let pending  = 0;
  let overdue  = 0;
  let completed = 0;

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

/* FORM RESET
   Clears all form fields and validation state. */

function resetForm() {
  inputModule.value   = '';
  inputTitle.value    = '';
  inputDate.value     = '';
  inputPriority.value = '';
  clearValidationErrors();
}

/* EVENT LISTENERS
   Wired to user interactions. All logic is delegated to functions. */
form.addEventListener('submit', function(event) {
  event.preventDefault();
  clearValidationErrors();

  const isValid = validateForm();
  if (!isValid) return;

  addAssignment();
  resetForm();
  renderAll();
});

clearBtn.addEventListener('click', function() {
  resetForm();
});

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

/* INITIALISATION
   Entry point. Runs once when the script loads.*/
function init() {
  inputDate.setAttribute('min', getTodayISO());
  renderAll();
}

// Run initialisation
init();