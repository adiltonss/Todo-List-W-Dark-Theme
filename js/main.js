import {renderFromLocal, deleteFromLocal, saveOnLocal, updateOnLocal} from "../js/localStorageFunctions.js";

let noncompledtasks = 0;

function Task(title){
    this.id = Math.random().toString(36).substr(2, 9);
    this.title = title;
    this.completed = false
}

window.onload = renderFromLocal(document.querySelector(".ul-todo"));
document.querySelector(".change-theme").addEventListener("click", changeTheme);
document.querySelector(".input-todo").addEventListener("keydown", createTodo);
document.querySelector('.ul-todo').addEventListener('click', getLi);
document.querySelector(".clear-completed").addEventListener("click", deleteAll);

// -------------- change theme color -----------------
function changeTheme(){
    if (document.querySelector("html").className === "light-mode"){
        document.querySelector("html").className = "dark-mode";
        document.querySelector('.theme-img').src = 'images/icon-sun.svg';
    }else{
        document.querySelector("html").className = "light-mode";
        document.querySelector('.theme-img').src = 'images/icon-moon.svg';
    }
};
// ------------- listen to check and delete clicks -------------------
function getLi(e){
    let currentLi = e.target;
    while(currentLi.nodeName !== "LI"){
        currentLi = currentLi.parentElement
    }

    if (e.target.classList == "check") {
        if (!currentLi.classList.contains("checked")) {
            updateOnLocal(currentLi.getAttribute('data-id'), true);
            currentLi.classList += " checked";
            currentLi.querySelector('img').src = "images/icon-check.svg";
            itemsLeft(false);
        }else{
            currentLi.classList.remove("checked");
            currentLi.querySelector('img').src = "";
            updateOnLocal(currentLi.getAttribute('data-id'), false);
            itemsLeft(true);
        }
    }

    if (e.target.classList == "delete") {
            currentLi.className += " deleting";
            deleteFromLocal(currentLi.getAttribute('data-id'));
            currentLi.addEventListener("animationend", ()=>{
            currentLi.remove();
        });
        if (!currentLi.classList.contains('checked')) {
            itemsLeft(false);
        }
    }
};
// ------------------ create tasks ---------------------
function createTodo(e){
    if(e.keyCode === 13){
        if(e.target.value !== ''){
            const task = new Task(e.target.value);
            let li = document.createElement('li');
            li.setAttribute("data-id", `${task.id}`);
            li.classList.add("task");
            li.innerHTML = `
                <span class="check"><img src="" alt=""></span>
                <span class="task-span">${task.title}</span>
                <span class="delete"><img src="images/icon-cross.svg" alt=""></span>`;
            document.querySelector(".ul-todo").appendChild(li);
            saveOnLocal(task);
            e.target.value = '';
            e.target.focus();
            itemsLeft(true);
        }else{
            alert("Necessário digitar uma tarefa primeiro!");
        }
    }
};
// ------------ filter completed and non completed tasks ------------------
document.querySelector('.filter-bar').addEventListener('click', (e)=>{
    let tasks = document.querySelectorAll('.task');
    tasks.forEach(task =>{
        switch (e.target.textContent) {
            case "All":
                task.style.display = 'grid';       
                break;
            case "Completed":
                if(task.classList.contains("checked")){
                    task.style.display = 'grid';
                }else{
                    task.style.display = 'none';
                }
                break;
            case "Active":
                if(task.classList.contains("checked")){
                    task.style.display = 'none';
                }else{
                    task.style.display = 'grid';
                }
                break;
            default:
                break;
        }
    })    
});
//update the field items left at the DOM
export function itemsLeft(value){
    if(noncompledtasks < 0){
        noncompledtasks = 0
    }

    if(value){
        noncompledtasks++
        document.querySelector('.non-completed').innerHTML = `${noncompledtasks} Items left`;
    }else{
        noncompledtasks--;
        document.querySelector('.non-completed').innerHTML = `${noncompledtasks} Items left`;
    }
};

//delete all completed tasks
function deleteAll(){
    let tasks = document.querySelectorAll('.task');
    tasks.forEach(task =>{
        if (task.classList.contains("checked")) {
            task.classList += ' deleting'
            task.addEventListener("animationend", ()=>{
            task.remove();
            deleteFromLocal(task.getAttribute('data-id'));
        })
        }
    });
};