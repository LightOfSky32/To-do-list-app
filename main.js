const textInput = document.getElementById("input");
const button = document.getElementById("addbtn");
const list = document.getElementById("taskList");
const tasks = [];

button.addEventListener("click", () => {
    // learn how to check for empty strings first 

    const message = document.getElementById("message");
    if (textInput.value.trim() === "") {
        message.textContent = "please input text";
        setTimeout(() =>{
            message.textContent ="";
        }, 2000)
        return;
    } 

    //done. rest of the code
    const userInput = textInput.value;
    const newTask = document.createElement("li");
    newTask.textContent = userInput;

    const removeButton = document.createElement("button");
    removeButton.textContent = "delete task";
    removeButton.addEventListener("click", () => {
        removeButton.parentElement.remove();
    })


    newTask.appendChild(removeButton);
    list.appendChild(newTask);
    textInput.value = "";

})