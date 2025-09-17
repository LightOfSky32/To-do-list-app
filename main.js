const addButton = document.getElementById("addbtn");
const overviewButton = document.getElementById("overview-btn");
const completeButton = document.getElementById("completed-btn");
const uncompleteButton = document.getElementById("undone-btn");
const editDialog = document.getElementById("edit-dialog");
const editTitleInput = document.getElementById("edit-title-input");
const editDateInput = document.getElementById("edit-date-input");
const editTimeInput = document.getElementById("edit-time-input");
const editTextArea = document.getElementById("edit-textarea");
const saveEditBtn = document.getElementById("save-edit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const searchBar = document.getElementById("search");
const clearBtn = document.getElementById("clear-btn");
const messageWarn = document.getElementById("message");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const sortByDateBtn = document.getElementById("sort-date-btn");
const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");
const filterDateBtn = document.getElementById("filter-date-btn");
const showFilterBtn = document.getElementById("show-filter-btn");
const dateFilterContainer = document.getElementById("date-input-filter");
const emptyState = document.getElementById('empty-state');
const visibleItems = document.querySelectorAll('#taskList .todo-item');
const toggleFilterBtn = document.getElementById("toggle-filter-btn");
const filterButtonsContainer = document.getElementById("filter-container");

const list = document.getElementById("taskList");
let tasks = [];
let editingTaskId = null;

//edit, refactoring (making code into a function) because i'm lazy and don't want to rewrite code lines, moving function from event listener here

function displayTask(taskObject){
    const newTask = document.createElement("div");
    newTask.classList.add("todo-item");
    newTask.dataset.id = taskObject.id;

     if (taskObject.isCompleted) {
        newTask.classList.add("done");
    }

    const taskContent = document.createElement("span");
    taskContent.textContent = `${taskObject.title ? taskObject.title + ' - ' : ''}Date: ${taskObject.date} Time: ${taskObject.time} Task: ${taskObject.text}`;

    newTask.appendChild(taskContent);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");

    const removeButton = document.createElement("button");
    removeButton.textContent = "delete task";
    removeButton.classList.add("delete-btn");

    if (taskObject.isCompleted) {
        editButton.classList.add("hide");
        removeButton.classList.add("hide");
    }

    newTask.addEventListener("click", (event) => {
        if (event.target !== removeButton && event.target !== editButton) {
            newTask.classList.toggle("done");
            taskObject.isCompleted = !taskObject.isCompleted

            const buttons = newTask.querySelectorAll("button");
            if (newTask.classList.contains("done")) {
                buttons.forEach(button => button.classList.add("hide"));
            } else {
                buttons.forEach(button => button.classList.remove("hide"));
            }

            save();
            updateTaskCounter();
            
        }
    });

    editButton.addEventListener("click", (event) => {
        event.stopPropagation();
        
        const taskId = event.currentTarget.parentNode.dataset.id;
        const taskObject = tasks.find(task => task.id == taskId);

        if (!taskObject) {
          showMessage("Task not found", "error");
          return;
       }

        editingTaskId = taskId;
        setDialogMode('edit');
        editTitleInput.value = taskObject.title;
        setInputsFromTask(taskObject);
        editTextArea.value = taskObject.text;

        editDialog.showModal();
        });


    removeButton.addEventListener("click", (event) => {
        event.stopPropagation()
        const taskId = event.currentTarget.parentNode.dataset.id;
        const taskIndex = tasks.findIndex(task => task.id == taskId);

 
        if (taskIndex > -1) {
            tasks.splice(taskIndex, 1);
            save();
            updateTaskCounter();
        }
        event.currentTarget.parentNode.remove();
    })
    

    newTask.appendChild(removeButton);
    newTask.appendChild(editButton);
    list.appendChild(newTask);

}

function searchTasks() {
  if (!searchBar) return;
  const searchTerm = (searchBar.value || "").toLowerCase();
  const filteredTasks = tasks.filter(task =>
    String(task.title || "").toLowerCase().includes(searchTerm) ||
    String(task.text || "").toLowerCase().includes(searchTerm)
  );

  list.innerHTML = '';
  for (const task of filteredTasks) displayTask(task);
}

function filterTasks(filterType){
    list.innerHTML = '';
    let filteredTasks = [];
    if (filterType === "all"){
        filteredTasks = tasks;
    } else if (filterType === "done") {
        filteredTasks = tasks.filter(task => task.isCompleted);
    } else if (filterType === "undone") {
        filteredTasks = tasks.filter(task => !task.isCompleted);
    }

    for (const task of filteredTasks) {
        displayTask(task);
    }
}

function setInputsFromTask(task) {
  if (!task) {
    editDateInput.value = "";
    editTimeInput.value = "";
    return;
  }

  if (task.iso) {
    editDateInput.value = task.iso.slice(0,10);
    editTimeInput.value = task.iso.slice(11,16);
    return;
  }

  let date = null;
  if (task.date && task.time) {
    date = new Date(`${task.date} ${task.time}`);
  } else if (task.date) {
    date = new Date(task.date);
  }

  if (date && !isNaN(date.getTime())) {
    editDateInput.value = date.toISOString().slice(0,10);
    editTimeInput.value = date.toTimeString().slice(0,5);
  } else {
    editDateInput.value = "";
    editTimeInput.value = "";
  }
}



function setDialogMode(mode) {
  let titleEl = editDialog.querySelector('h2');

  if (mode === 'add') {
    titleEl.textContent = 'Add Task';
    saveEditBtn.textContent = 'Add Task';
  } else { 
    titleEl.textContent = 'Edit Task';
    saveEditBtn.textContent = 'Save Changes';
  }
}


function filterByDateRange() {
  if (!startDateInput.value || !endDateInput.value) {
        showMessage("Please select both a start and end date.", "error");
        return;
    }
    const startDate = new Date(startDateInput.value+ "T00:00:00");
    const endDate = new Date(endDateInput.value + "T23:59:59");

    const filteredTasks = tasks.filter(task => {
       const taskDate = task.iso ? new Date(task.iso) : (task.date ? new Date(`${task.date} ${task.time || ''}`) : null);
       if (!taskDate || isNaN(taskDate.getTime())){
        return false;
       } 


        return taskDate >= startDate && taskDate <= endDate;
    });

    list.innerHTML = '';
    for (const task of filteredTasks) {
        displayTask(task);
    }

    if (filteredTasks.length === 0) {
        showMessage("No tasks found in this date range.", "info");
    } else {
    showMessage(`Showing ${filteredTasks.length} tasks in this date range.`, "info");
  }
}


function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.isCompleted);
    save();
    loadItem();
}

function dateSort() {
  tasks.sort((a, b) => {
    const dateA = a && a.iso ? new Date(a.iso) : (a && a.date ? new Date(`${a.date} ${a.time || ''}`) : new Date(0));
    const dateB = b && b.iso ? new Date(b.iso) : (b && b.date ? new Date(`${b.date} ${b.time || ''}`) : new Date(0));
    const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
    const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
    return timeA - timeB;
  });
  save();
  loadItem();
}

    
function updateTaskCounter() {
    const counterElement = document.getElementById("task-counter");

    const completedTasks = tasks.filter(task => task.isCompleted).length;
    let incompleteTasks = tasks.filter(task => !task.isCompleted).length;
    
    counterElement.textContent = `You have ${tasks.length} tasks: ${incompleteTasks} Incomplete and ${completedTasks} completed.`;
    emptyState.style.display = tasks.length === 0 ? 'block' : 'none';
}


function loadItem() {
  list.innerHTML = '';

  const savedTasks = localStorage.getItem("todo");
  if (!savedTasks) {
    tasks = [];
  } else {
    tasks = JSON.parse(savedTasks);
    if (!Array.isArray(tasks)) tasks = [];
  }

  for (const t of tasks) displayTask(t);
  updateTaskCounter();

  if (tasks.length === 0) {
    showMessage("You have no tasks to display.", "info");
  } else {
    showMessage("Tasks loaded successfully!", "success");
  }
}


function save() {
  localStorage.setItem("todo", JSON.stringify(tasks));
  
}



function showMessage(text, type = "info") {

  messageWarn.textContent = text;

  if (type === "error") {
    messageWarn.style.color = "red";
  } else if (type === "success") {
    messageWarn.style.color = "green";
  } else {
    messageWarn.style.color = "black";
  }
  setTimeout(() => {
    messageWarn.textContent = "";
  }, 3000);
}


addButton.addEventListener("click", () => {
  editingTaskId = null;

  const today = new Date();
  editTitleInput.value = "";
  editDateInput.value = today.toISOString().slice(0,10);
  editTimeInput.value = today.toTimeString().slice(0,5);
  editTextArea.value = "";
  setDialogMode('add');
  editDialog.showModal();
});


    overviewButton.addEventListener("click", () => { 
        filterTasks("all"); 
    });

    uncompleteButton.addEventListener("click", () => { 
        filterTasks("undone"); 
    });

    completeButton.addEventListener("click", () => { 
        filterTasks("done"); 
    });

    clearBtn.addEventListener("click", () => {
    if (tasks.length === 0) {
       showMessage("No tasks to clear.", "error");
       return;
    }

    tasks = [];
    save();
    list.innerHTML = "";
    updateTaskCounter();
    showMessage("All tasks cleared!", "success");
  });

  cancelEditBtn.addEventListener("click", () => {
    editingTaskId = null;
    editDialog.close();
  });

filterDateBtn.addEventListener('click', filterByDateRange);

toggleFilterBtn.addEventListener('click', () => {
    if (filterButtonsContainer.style.display === 'none') {
        filterButtonsContainer.style.display = 'block';
        toggleFilterBtn.textContent = 'Hide Filters';
    } else {
        filterButtonsContainer.style.display = 'none';
        toggleFilterBtn.textContent = 'Show Filter';
    }
});


saveEditBtn.addEventListener("click", () => {
  
  const title = editTitleInput.value.trim() || "Untitled Task";
  const text = editTextArea.value.trim();
  const dateValue = editDateInput.value;
  const timeValue = editTimeInput.value;

  let dateForIso;
  if (dateValue) {
    const isoInput = dateValue + "T" + (timeValue || "00:00");
    dateForIso = new Date(isoInput);
  } else {
    dateForIso = new Date();
  }
  const isoString = isNaN(dateForIso.getTime()) ? null : dateForIso.toISOString();
  const formattedDate = dateForIso.toLocaleDateString("en");
  const formattedTime = dateForIso.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (editingTaskId === null) {
    const newTaskObject = {
      id: Date.now().toString() + "-" + Math.random().toString(36).slice(2,6),
      title,
      date: formattedDate,
      time: formattedTime,
      iso: isoString,
      text,
      isCompleted: false
    };
    tasks.push(newTaskObject);
    showMessage("Task added successfully!", "success");
  } else {

    const taskObject = tasks.find(task => task.id == editingTaskId);
    if (!taskObject) {
      showMessage("Task not found.", "error");
      return;
    }

    taskObject.title = title;
    taskObject.date = formattedDate;
    taskObject.time = formattedTime;
    taskObject.iso = isoString;
    taskObject.text = text;
    showMessage("Task updated successfully!", "success");
  }

  save();
  loadItem();
  editingTaskId = null;
  editDialog.close();
});


showFilterBtn.addEventListener('click', () => {
    if (dateFilterContainer.style.display === 'none' || dateFilterContainer.style.display === '') {
        dateFilterContainer.style.display = 'block';
        showFilterBtn.textContent = 'Hide Date Filter';
    } else {
        dateFilterContainer.style.display = 'none'; 
        showFilterBtn.textContent = 'Show Date Filter';
    }
});

searchBar.addEventListener('input', searchTasks);
clearCompletedBtn.addEventListener("click", clearCompletedTasks);
sortByDateBtn.addEventListener("click", dateSort);
loadItem();

