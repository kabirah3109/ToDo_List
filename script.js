const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAll");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const pendingCountEl = document.getElementById("pendingCount");
const completedCountEl = document.getElementById("completedCount");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  updateTaskCounts();
});

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return alert("Please enter a task!");

  const newTask = {
    id: Date.now(),
    text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value = "";
}
function renderTasks() {
  taskList.innerHTML = "";

  const filter = filterSelect.value;
  const search = searchInput.value.toLowerCase();

  let filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(search);
    if (filter === "pending") return matchesSearch && !task.completed;
    if (filter === "completed") return matchesSearch && task.completed;
    return matchesSearch;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
            <div class="task-content">
                <span class="task-number">${index + 1}</span>
                <span class="task-text">${task.text}</span>
            </div>
            <div class="task-actions">
                <span class="toggle-complete">${
                  task.completed ? "✅" : "⭕"
                }</span>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

    li.querySelector(".toggle-complete").addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
      updateTaskCounts();
    });

    // Edit Task
    li.querySelector(".edit-btn").addEventListener("click", () => {
      const newText = prompt("Edit task:", task.text);
      if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
      }
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks();
      updateTaskCounts();
    });

    taskList.appendChild(li);
  });
}
function updateTaskCounts() {
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - completed;
  pendingCountEl.textContent = pending;
  completedCountEl.textContent = completed;
}
searchInput.addEventListener("input", renderTasks);
filterSelect.addEventListener("change", renderTasks);

clearAllBtn.addEventListener("click", () => {
  if (confirm("Delete all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
    updateTaskCounts();
  }
});
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
