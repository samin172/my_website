let tasks = [];
let editIndex = null;
let deleteIndex = null;

const taskList = document.getElementById("taskList");
const taskModal = document.getElementById("taskModal");
const deleteModal = document.getElementById("deleteModal");
const modalTitle = document.getElementById("modalTitle");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescInput = document.getElementById("taskDesc");
const taskDateInput = document.getElementById("taskDate");
const taskTimeInput = document.getElementById("taskTime");

function openModal(isEdit = false, index = null) {
  taskModal.style.display = "flex";
  if (isEdit) {
    modalTitle.textContent = "Edit Task";
    editIndex = index;
    taskTitleInput.value = tasks[index].title;
    taskDescInput.value = tasks[index].desc;
    taskDateInput.value = tasks[index].date;
    taskTimeInput.value = tasks[index].time;
  } else {
    modalTitle.textContent = "Add Task";
    editIndex = null;
    taskTitleInput.value = "";
    taskDescInput.value = "";
    taskDateInput.value = "";
    taskTimeInput.value = "";
  }
}

function closeModal() {
  taskModal.style.display = "none";
}

function saveTask() {
  const title = taskTitleInput.value.trim();
  const desc = taskDescInput.value.trim();
  const date = taskDateInput.value;
  const time = taskTimeInput.value;

  if (title === "") {
    alert("Task title is required!");
    return;
  }

  if (editIndex !== null) {
    tasks[editIndex] = { ...tasks[editIndex], title, desc, date, time };
  } else {
    tasks.push({ title, desc, date, time, done: false });
  }
  renderTasks();
  closeModal();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task-item" + (task.done ? " completed" : "");
    div.innerHTML = `
      <div>
        <div class="task-title">${task.title}</div>
        <div class="task-meta">${task.desc || ""}</div>
        <div class="task-meta">📅 ${task.date || "No date"} ⏰ ${task.time || "No time"}</div>
      </div>
      <div class="task-actions">
        <button class="btn btn-done" onclick="toggleDone(${index})">${task.done ? "Undo" : "Done"}</button>
        <button class="btn btn-delete" onclick="openDeleteModal(${index})">Delete</button>
        <button class="btn btn-edit" onclick="openModal(true, ${index})">Edit</button>
      </div>
    `;
    taskList.appendChild(div);
  });
}

// ===== Delete Modal Functions =====
function openDeleteModal(index) {
  deleteIndex = index;
  deleteModal.style.display = "flex";
}

function closeDeleteModal() {
  deleteModal.style.display = "none";
  deleteIndex = null;
}

function confirmDelete() {
  if (deleteIndex !== null) {
    tasks.splice(deleteIndex, 1);
    renderTasks();
  }
  closeDeleteModal();
}

// ===== Close modals on outside click =====
window.onclick = (e) => {
  if (e.target == taskModal) closeModal();
  if (e.target == deleteModal) closeDeleteModal();
};
