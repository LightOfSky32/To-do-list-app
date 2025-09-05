const today = new Date();
const dateTime = today.toLocaleDateString()
console.log(dateTime);


const textInput = document.getElementById("input");
const button = document.getElementById("addbtn");

const list = document.getElementById("taskList");
let tasks = [];

//edit, refactoring (making code into a function) because i'm lazy and don't want to rewrite code lines, moving function in event listener here

function displayTask(taskText){
    const newTask = document.createElement("div");
    newTask.classList.add("todo-item");

    const taskContent = document.createElement("span");
    taskContent.textContent = taskText;

    newTask.appendChild(taskContent);

    newTask.addEventListener("click", (event) => {
        if (event.target !== removeButton && event.target !== editButton) {
            newTask.classList.toggle("done");
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
            const originalText = taskContent.textContent.trim();
            const taskIndex = tasks.indexOf(originalText);

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
        }
        newTask.remove();
        event.stopPropagation();
    })


    newTask.appendChild(removeButton);
    newTask.appendChild(editButton);
    list.appendChild(newTask);

}



const loadItem = () => {
    const savedTasks = localStorage.getItem("todo")
    if (savedTasks !== null){
        tasks = JSON.parse(savedTasks);
       }

       for (const ele of tasks) {
        displayTask(ele);
       }
    }


//adding local storage (learning)
function save(){
    localStorage.setItem("todo", JSON.stringify(tasks))
    
}


button.addEventListener("click", () => {

     const userInput = textInput.value.trim();
     const message = document.getElementById("message");
    // learn how to check for empty strings first 

    const today = new Date();
    const formattedDateTime = today.toLocaleString();
    
    if (userInput === "") {
        message.textContent = "please input text";
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
    textInput.value = "";
    

});


loadItem();

