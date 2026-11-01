// Select HTML elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyState = document.getElementById("emptyState");
const clearCompleted = document.getElementById("clearCompleted");

// Load saved tasks from browser storage
let tasks = JSON.parse(localStorage.getItem("aestheticTodoTasks")) || [];

// Save tasks
function saveTasks() {
    localStorage.setItem("aestheticTodoTasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach((task) => {

        // Create task item
        const li = document.createElement("li");

        li.className =
            `task ${task.completed ? "completed" : ""}`;

        // Create check button
        const check = document.createElement("button");

        check.className = "task-check";

        check.setAttribute(
            "aria-label",
            "Toggle task"
        );

        check.addEventListener("click", () => {
            toggleTask(task.id);
        });


        // Create task text
        const text = document.createElement("span");

        text.className = "task-text";

        text.textContent = task.text;


        // Create delete button
        const deleteButton =
            document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.innerHTML = "&times;";

        deleteButton.setAttribute(
            "aria-label",
            "Delete task"
        );

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });


        // Add everything to the task
        li.append(
            check,
            text,
            deleteButton
        );

        taskList.appendChild(li);
    });


    // Count unfinished tasks
    const remaining = tasks.filter(
        task => !task.completed
    ).length;


    taskCount.textContent =
        `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;


    // Show empty message if there are no tasks
    emptyState.classList.toggle(
        "hidden",
        tasks.length > 0
    );


    // Show Clear Completed button only when needed
    clearCompleted.style.visibility =
        tasks.some(task => task.completed)
            ? "visible"
            : "hidden";
}


// Add a new task
function addTask(text) {

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.unshift(newTask);

    saveTasks();

    renderTasks();
}


// Complete / uncomplete a task
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });

    saveTasks();

    renderTasks();
}


// Delete a task
function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();

    renderTasks();
}


// When Add Task button is clicked
taskForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const text = taskInput.value.trim();

    // Don't add empty tasks
    if (!text) {
        return;
    }

    addTask(text);

    // Clear input
    taskInput.value = "";

    // Put cursor back in input
    taskInput.focus();
});


// Clear all completed tasks
clearCompleted.addEventListener("click", () => {

    tasks = tasks.filter(
        task => !task.completed
    );

    saveTasks();

    renderTasks();
});


// Display tasks when page opens
renderTasks();