const textInput = document.getElementById("input");
const button = document.getElementById("addbtn");
const list = document.getElementById("taskList");
const tasks = [];

button.addEventListener("click", () => {
    const userInput = textInput.value;
    const newTask = document.createElement("li");
    newTask.textContent = userInput;
    
    list.appendChild(newTask);
    textInput.value = "";
})