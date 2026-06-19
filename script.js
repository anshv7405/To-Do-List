//Selecting Elements
var taskForm = document.getElementById("taskForm");
var taskTitle = document.getElementById("taskTitle");
var taskCategory = document.getElementById("taskCategory");
var taskContainer = document.getElementById("taskContainer");

var completedCount = document.getElementById("completedCount");
var pendingCount = document.getElementById("pendingCount");

var searchTask = document.getElementById("searchTask");
var clearAllBtn = document.getElementById("clearAllBtn");

var taskId = 1;

//Loading Tasks on Startup
loadTasks();

//Add Task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var title = taskTitle.value.trim();
    var category = taskCategory.value;

    if (title === "") {
        alert("Please enter a task title");
        return;
    }
    createTask(title, category, "pending");
    saveTasks();
    taskForm.reset();
});

//Task Function
function createTask(title, category, status) {
    var taskCard = document.createElement("div");
    taskCard.className = "task-card";
    taskCard.setAttribute("data-id", taskId);
    taskCard.setAttribute("data-status", status);
    taskCard.setAttribute("data-category", category);
    //dataset example
    taskCard.dataset.category = category;
    taskId++;
    var titleElement = document.createElement("h3");
    var titleText = document.createTextNode(title);
    titleElement.appendChild(titleText);

    if (status === "completed") {
        titleElement.classList.add("completed");
    }
    var categoryElement = document.createElement("p");
    categoryElement.textContent = "Category: " + category;
    var statusElement = document.createElement("p");
    statusElement.textContent = "Status: " + status;
    statusElement.className = "status-text";
    var editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    var completeBtn = document.createElement("button");
    completeBtn.textContent = "Complete";
    completeBtn.className = "complete-btn";
    var deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";

    taskCard.append(titleElement);
    taskCard.append(categoryElement);
    taskCard.append(statusElement);
    taskCard.append(editBtn);
    taskCard.append(completeBtn);
    taskCard.append(deleteBtn);

    //prepend() requirement
    taskContainer.prepend(taskCard);
    updateCounters();
}

//Save Tasks
function saveTasks() {
    var allTasks = [];
    var cards = document.querySelectorAll(".task-card");
    cards.forEach(function (card) {
        var task = {
            title: card.querySelector("h3").textContent,
            category: card.dataset.category,
            status: card.getAttribute("data-status")
        };
        allTasks.push(task);
    });
    localStorage.setItem("tasks", JSON.stringify(allTasks));
}

//Load Tasks
function loadTasks() {
    var storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks === null) {
        return;
    }
    var fragment = document.createDocumentFragment();
    storedTasks.forEach(function (task) {
        var taskCard = document.createElement("div");
        taskCard.className = "task-card";
        taskCard.setAttribute("data-id", taskId);
        taskCard.setAttribute("data-status", task.status);
        taskCard.setAttribute("data-category", task.category);
        taskCard.dataset.category = task.category;
        taskId++;
        var titleElement = document.createElement("h3");
        titleElement.textContent = task.title;

        if (task.status === "completed") {
            titleElement.classList.add("completed");
        }

        var categoryElement = document.createElement("p");
        categoryElement.textContent = "Category: " + task.category;
        var statusElement = document.createElement("p");
        statusElement.textContent = "Status: " + task.status;
        statusElement.className = "status-text";
        var editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        var completeBtn = document.createElement("button");
        completeBtn.textContent = "Complete";
        completeBtn.className = "complete-btn";

        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        taskCard.appendChild(titleElement);
        taskCard.appendChild(categoryElement);
        taskCard.appendChild(statusElement);

        taskCard.appendChild(editBtn);
        taskCard.appendChild(completeBtn);
        taskCard.appendChild(deleteBtn);
        fragment.appendChild(taskCard);
    });
    taskContainer.appendChild(fragment);
    updateCounters();
}
//Update Counters
function updateCounters() {
    var completed = 0;
    var pending = 0;
    var cards = document.querySelectorAll(".task-card");
    cards.forEach(function (card) {
        var status = card.getAttribute("data-status");
        if(status === "completed") {
            completed++;
        } else {
            pending++;
        }
    });
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
}
//Attributes vs Properties Demo
//input.value
//Gives the current value typed by the user
//input.getAttribute("value")
//Gives the original value written in HTML
console.log("Property Value:", taskTitle.value);
console.log("Attribute Value:", taskTitle.getAttribute("value"));

//Event Delegation
taskContainer.addEventListener("click", function (event) {
    var clickedElement = event.target;
    //Delete Task
    if (clickedElement.classList.contains("delete-btn")) {
        var taskCard = clickedElement.parentElement;
        taskCard.remove();
        saveTasks();
        updateCounters();
    }
    //Complete Task
    if (clickedElement.classList.contains("complete-btn")) {
        var taskCard = clickedElement.parentElement;
        var title = taskCard.querySelector("h3");
        var statusText = taskCard.querySelector(".status-text");
        taskCard.setAttribute("data-status","completed");
        title.classList.add("completed");
        statusText.textContent = "Status: completed";
        saveTasks();
        updateCounters();
    }
    //Edit Task
    if (clickedElement.classList.contains("edit-btn")) {
        var taskCard = clickedElement.parentElement;
        var titleElement = taskCard.querySelector("h3");
        var currentTitle = titleElement.textContent;
        var editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = currentTitle;
        //replaceWith() requirement
        titleElement.replaceWith(editInput);
        editInput.focus();
        editInput.addEventListener("blur", function() {
                var newTitle = editInput.value.trim();
                if(newTitle === "") {
                    newTitle = currentTitle;
                }
                var newHeading = document.createElement("h3");
                newHeading.textContent = newTitle;
                editInput.replaceWith(newHeading);
                saveTasks();
            }
        );
    }
});
//Search Task
searchTask.addEventListener("keyup", function() {
        var searchValue = searchTask.value.toLowerCase();
        var cards = document.querySelectorAll(".task-card");
        cards.forEach(function (card) {
            var title = card.querySelector("h3").textContent.toLowerCase();
            if(title.includes(searchValue)){
                card.style.display = "block";
            }
            else {
                card.style.display = "none";
            }
        });
    }
);
//Clear All Tasks
clearAllBtn.addEventListener("click", function() {
        taskContainer.innerHTML = "";
        localStorage.removeItem("tasks");
        updateCounters();
    }
);
//Theme Toggle
var themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", function() {
        var currentTheme =document.body.dataset.theme;
        if (currentTheme === "light"){
            document.body.setAttribute("data-theme","dark");
            themeToggle.textContent = "Light Mode";
        }
        else {
            document.body.setAttribute("data-theme","light");
            themeToggle.textContent = "Dark Mode";
        }
    }
);
//hasAttribute Demo
console.log(document.body.hasAttribute("data-theme"));
//removeAttribute Demo
var demoDiv = document.createElement("div");
demoDiv.setAttribute("data-demo", "sample");
demoDiv.removeAttribute("data-demo");

//before() Demo
var beforeMessage = document.createElement("p");
beforeMessage.textContent = "Task List Starts Below";
taskContainer.before(beforeMessage);

//after() Demo
var afterMessage = document.createElement("p");
afterMessage.textContent = "Task List Ends Above";
taskContainer.after(afterMessage);

//Event Bubbling
var grandparent = document.getElementById("grandparent");
var parent = document.getElementById("parent");
var childButton = document.getElementById("childButton");

grandparent.addEventListener("click", function() {
    console.log("Bubbling - Grandparent");
});
parent.addEventListener("click", function() {
        console.log("Bubbling - Parent");
    });

childButton.addEventListener("click", function() {
        console.log("Bubbling - Child");
    }
);

//Event Capturing
grandparent.addEventListener("click", function() {
    console.log("Capturing - Grandparent");
    },true);

parent.addEventListener("click", function() {
        console.log("Capturing - Parent");
    },true);

childButton.addEventListener("click", function() {
        console.log("Capturing - Child");
    },true);


// Event Propagation Notes
// Bubbling Order:
// Child -> Parent -> Grandparent

// Capturing Order:
// Grandparent -> Parent -> Child