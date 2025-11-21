const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const clearCompleted = document.getElementById('clearCompleted');
const pendingCount = document.getElementById('pendingCount');

const STORAGE_KEY = 'todo-list-2025';

// Cargar tareas al inicio
loadTasks();

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => e.key === 'Enter' && addTask());
clearCompleted.addEventListener('click', () => {
  const completedTasks = document.querySelectorAll('.task.completed');
  completedTasks.forEach(task => task.remove());
  saveTasks();
  updateCounter();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  
  const li = createTaskElement(text, false);
  taskList.appendChild(li);
  taskInput.value = '';
  saveTasks();
  updateCounter();
}

function createTaskElement(text, completed) {
  const li = document.createElement('li');
  li.className = `task ${completed ? 'completed' : ''}`;

  li.innerHTML = `
    <input type="checkbox" ${completed ? 'checked' : ''}>
    <label>${text}</label>
    <button class="delete-btn">×</button>
  `;

  const checkbox = li.querySelector('input');
  const deleteBtn = li.querySelector('.delete-btn');

  checkbox.addEventListener('change', () => {
    li.classList.toggle('completed');
    saveTasks();
    updateCounter();
  });

  deleteBtn.addEventListener('click', () => {
    li.remove();
    saveTasks();
    updateCounter();
  });

  return li;
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll('.task').forEach(task => {
    tasks.push({
      text: task.querySelector('label').textContent,
      completed: task.classList.contains('completed')
    });
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  
  const tasks = JSON.parse(saved);
  tasks.forEach(t => taskList.appendChild(createTaskElement(t.text, t.completed)));
  updateCounter();
}

function updateCounter() {
  const pending = document.querySelectorAll('.task:not(.completed)').length;
  pendingCount.textContent = `${pending} pendiente${pending !== 1 ? 's' : ''}`;
}