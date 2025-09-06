const today = new Date();
const dateTime = today.toLocaleDateString()
console.log(dateTime);


const textInput = document.getElementById("input");
const addButton = document.getElementById("addbtn");
const overviewButton = document.getElementById("overview-btn");
const completeButton = document.getElementById("completed-btn");
const uncompleteButton = document.getElementById("undone-btn")

const list = document.getElementById("taskList");
let tasks = [];

//edit, refactoring (making code into a function) because i'm lazy and don't want to rewrite code lines, moving function from event listener here

function displayTask(taskText){
    const newTask = document.createElement("div");
    newTask.classList.add("todo-item");

    const taskContent = document.createElement("span");
    taskContent.textContent = taskText;

    newTask.appendChild(taskContent);

    newTask.addEventListener("click", (event) => {
        if (event.target !== removeButton && event.target !== editButton) {
            newTask.classList.toggle("done");
            updateTaskCounter();
        }
    });

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-btn");
    editButton.addEventListener("click", (event) => {
        event.stopPropagation();

        const editInput = document.createElement("textarea");
        editInput.value = taskContent.textContent;

        const originalSpanText = taskContent.textContent;
        taskContent.replaceWith(editInput);
        editInput.focus();

        editInput.addEventListener("blur", () => {
            const newTaskText = editInput.value.trim();
            const taskIndex = tasks.indexOf(originalSpanText);

            if (taskIndex > -1) {
                tasks[taskIndex] = newTaskText;
                save();
            }

            taskContent.textContent = newTaskText;
            editInput.replaceWith(taskContent);
        });

        editInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                editInput.blur();
            }
        });
    });

    const removeButton = document.createElement("button");
    removeButton.textContent = "delete task";
     removeButton.classList.add("delete-btn");
    removeButton.addEventListener("click", (event) => {
         const currentTaskText = newTask.querySelector('span').textContent;
        const taskIndex = tasks.indexOf(currentTaskText);


        if (taskIndex > -1) {
            tasks.splice(taskIndex, 1);
            save();
            updateTaskCounter();
        }
        newTask.remove();
        event.stopPropagation();
    })


    newTask.appendChild(removeButton);
    newTask.appendChild(editButton);
    list.appendChild(newTask);

}


function filterTasks(filterType){

    const items = document.querySelectorAll(".todo-item")
    for (const item of items){
        let displayItems = false

        if (filterType === "all"){
            displayItems = true
        } else if (filterType === "done" && item.classList.contains("done")){
             displayItems = true
        } else if (filterType ==="undone" && !(item.classList.contains("done"))){
             displayItems = true
        }

        if (displayItems) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    }

}

    
function updateTaskCounter() {
    const counterElement = document.getElementById("task-counter");

    let completedTasks = 0;
    let incompleteTasks = 0;
    const items = document.querySelectorAll(".todo-item");

        for (const item of items) {
        if (item.classList.contains("done")) {
            completedTasks++;
        } else {
            incompleteTasks++;
        }
    }
    counterElement.textContent = `You have ${tasks.length} tasks: ${incompleteTasks} incomplete and ${completedTasks} completed.`;

}


const loadItem = () => {
    const savedTasks = localStorage.getItem("todo")
    if (savedTasks !== null){
        tasks = JSON.parse(savedTasks);
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


addButton.addEventListener("click", () => {

     const userInput = textInput.value.trim();
     const message = document.getElementById("message");
    // learn how to check for empty strings first 

    const today = new Date();
    const formattedDateTime = today.toLocaleString();
    
    if (userInput === "") {
        message.textContent = "please input text";
        message.classList.add("warning");
        setTimeout(() =>{
            message.textContent ="";
        }, 2000)
        return;
    } 

    //done. rest of the code
    const combinedString = `Date: ${formattedDateTime} My task: ${userInput}` 
    tasks.push(combinedString);
    displayTask(combinedString);
    save();
    updateTaskCounter()
    textInput.value = "";
    

});

    overviewButton.addEventListener("click", () => { 
        filterTasks("all"); 
    })

    uncompleteButton.addEventListener("click", () => { 
        filterTasks("undone"); 
    })

    completeButton.addEventListener("click", () => { 
        filterTasks("done"); 
    })




loadItem();

