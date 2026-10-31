```javascript
// Get the HTML elements
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const taskCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const emptyMessage = document.getElementById("empty-message");
const clearCompletedButton = document.getElementById("clear-completed");
const filterButtons = document.querySelectorAll(".filter-button");

// Load saved tasks from the browser
let tasks = JSON.parse(localStorage.getItem("bloomTodoTasks")) || [];
let currentFilter = "all";

// Save tasks in browser storage
function saveTasks() {
    localStorage.setItem("bloomTodoTasks", JSON.stringify(tasks));
}

// Update the progress bar and task numbers
function updateProgress() {
    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const total = tasks.length;
    const percentage = total === 0 ? 0 : (completed / total) * 100;

    completedCount.textContent = completed;
    taskCount.textContent = total;
    progressBar.style.width = percentage + "%";

    if (total === 0) {
        progressText.textContent = "Let's get started!";
    } else if (completed === total) {
        progressText.textContent = "Amazing! Everything is done!";
    } else {
        progressText.textContent = "You're making great progress!";
    }
}

// Display tasks on the page
function showTasks() {
    todoList.innerHTML = "";

    const visibleTasks = tasks.filter(function (task) {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    visibleTasks.forEach(function (task) {
        const listItem = document.createElement("li");
        listItem.className = "todo-item";

        if (task.completed) {
            listItem.classList.add("completed");
        }

        // Create checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "todo-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task as completed");

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            showTasks();
        });

        // Create task text
        const taskText = document.createElement("span");
        taskText.className = "todo-text";
        taskText.textContent = task.text;

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();
            showTasks();
        });

        // Add elements to the task row
        listItem.appendChild(checkbox);
        listItem.appendChild(taskText);
        listItem.appendChild(deleteButton);

        todoList.appendChild(listItem);
    });

    // Update the empty-list message
    emptyMessage.style.display =
        visibleTasks.length === 0 ? "block" : "none";

    if (tasks.length > 0 && visibleTasks.length === 0) {
        emptyMessage.querySelector(".empty-title").textContent =
            currentFilter === "completed"
                ? "Nothing completed yet"
                : "All caught up!";

        emptyMessage.querySelector(".empty-subtitle").textContent =
            currentFilter === "completed"
                ? "Tick a task when you've finished it."
                : "You've completed all your tasks. Lovely work!";
    } else {
        emptyMessage.querySelector(".empty-title").textContent =
            "A little space to begin";

        emptyMessage.querySelector(".empty-subtitle").textContent =
            "Add a task above and make it happen.";
    }

    updateProgress();
}

// Add a new task
todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = todoInput.value.trim();

    // Do not add an empty task
    if (text === "") {
        todoInput.focus();
        return;
    }

    const newTask = {
        id: Date.now() + Math.random(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    // Show the new task in the All Tasks filter
    currentFilter = "all";
    updateFilterButtons();
    showTasks();

    todoInput.value = "";
    todoInput.focus();
});

// Highlight the currently selected filter
function updateFilterButtons() {
    filterButtons.forEach(function (button) {
        button.classList.toggle(
            "active",
            button.dataset.filter === currentFilter
        );
    });
}

// Filter tasks: All, In Progress, or Completed
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;
        updateFilterButtons();
        showTasks();
    });
});

// Clear all completed tasks
clearCompletedButton.addEventListener("click", function () {
    tasks = tasks.filter(function (task) {
        return !task