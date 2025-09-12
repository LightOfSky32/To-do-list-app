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


    newTask.addEventListener("click", (event) => {
        if (event.target !== removeButton && event.target !== editButton) {
            newTask.classList.toggle("done");
            taskObject.isCompleted = !taskObject.isCompleted
            updateTaskCounter();
            save()
        }
    });

    editButton.addEventListener("click", (event) => {
        event.stopPropagation();

        const taskId = event.currentTarget.parentNode.dataset.id;
        const taskObject = tasks.find(task => task.id == taskId);

        editingTaskId = taskId;
        
        editTitleInput.value = taskObject.title;
        editDateInput.value = taskObject.date;
        editTimeInput.value = taskObject.time;
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
    const searchTerm = searchBar.value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm) || 
        task.text.toLowerCase().includes(searchTerm)
    );

    list.innerHTML = ''; 
    for (const task of filteredTasks) {
        displayTask(task); 
    }
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
    
function updateTaskCounter() {
    const counterElement = document.getElementById("task-counter");

    const completedTasks = tasks.filter(task => task.isCompleted).length;
    let incompleteTasks = tasks.filter(task => !task.isCompleted).length;
    
    counterElement.textContent = `You have ${tasks.length} tasks: ${incompleteTasks} Incomplete and ${completedTasks} completed.`;

}


const loadItem = () => {
    list.innerHTML = ''
    const savedTasks = localStorage.getItem("todo")
    if (savedTasks !== null){
        tasks = JSON.parse(savedTasks);

        tasks = tasks.map(task => {
            if (typeof task === "string") {
                return {
                    id: Date.now().toString() + Math.random(), 
                    title: "Imported Task",
                    date: "Unknown",
                    time: "Unknown",
                    text: task,
                    isCompleted: false
                };
            }
            return task; 
        });

       }

       for (const ele of tasks) {
        displayTask(ele);
       }
       updateTaskCounter()
    }


//adding local storage (learning)
function save(){
    localStorage.setItem("todo", JSON.stringify(tasks))
    
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
  // open dialog in "add" mode
  editingTaskId = null;

  const today = new Date();
  editTitleInput.value = "";
  editDateInput.value = today.toISOString().slice(0,10);
  editTimeInput.value = today.toTimeString().slice(0,5);
  editTextArea.value = "";

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




saveEditBtn.addEventListener("click", () => {
  // read values from dialog
  const title = editTitleInput.value.trim() || "Untitled Task";
  const text = editTextArea.value.trim();
  const dateValue = editDateInput.value;   
  const timeValue = editTimeInput.value;   

  // format date/time consistently for display
  let formattedDate, formattedTime;
  if (dateValue) {
    const iso = dateValue + "T" + (timeValue || "00:00");
    const date = new Date(iso);
    formattedDate = date.toLocaleDateString("en");
    formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else {
    const now = new Date();
    formattedDate = now.toLocaleDateString("en");
    formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (editingTaskId === null) {
    // Add new task
    const newTaskObject = {
      id: Date.now().toString() + "-" + Math.random().toString(36).slice(2,6),
      title,
      date: formattedDate,
      time: formattedTime,
      text,
      isCompleted: false
    };
    tasks.push(newTaskObject);
  } else {
    // Edit existing task
    const taskObject = tasks.find(task => task.id == editingTaskId);
    if (!taskObject) {
        showMessage("Task not found.", "error");
        return;
    }

    taskObject.title = title;
    taskObject.date = formattedDate;
    taskObject.time = formattedTime;
    taskObject.text = text;
  }

  save();
  loadItem();
  editingTaskId = null;
  editDialog.close();
});

searchBar.addEventListener('input', searchTasks);

loadItem();

