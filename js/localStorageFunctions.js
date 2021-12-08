import { itemsLeft } from "./main.js";

export function renderFromLocal(container){
    let tasks = getTasks();
    tasks.map(({id, title, completed}) => {
        let li = document.createElement('li');
        li.classList.add("task"); 
        li.setAttribute("data-id", `${id}`);           
        if (completed === true) {
            li.className += ' checked'
            li.innerHTML = `
                <span class="check"><img src="images/icon-check.svg" alt=""></span>
                <span class="task-span">${title}</span>
                <span class="delete"><img src="images/icon-cross.svg" alt=""></span>`;
        }else{
            li.innerHTML = `
                <span class="check"><img src="" alt=""></span>
                <span class="task-span">${title}</span>
                <span class="delete"><img src="images/icon-cross.svg" alt=""></span>`;
            itemsLeft(true);
            }
        container.appendChild(li);        
    })
}

//get tasks from local storage and turn into an array
export function getTasks(){
    let tasks;
    if(localStorage.getItem('tasks') === null){
        tasks = [];
    }else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
}

//find a task using the id
function findTask(tasks, id){
    let task = tasks.find(task => task.id === id);
    return task
}

export function deleteFromLocal(id){
    let tasks = getTasks();
    tasks.splice(tasks.indexOf(findTask(tasks, id)), 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function saveOnLocal(task){
    let tasks = getTasks();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks))
};

export function updateOnLocal(id, boolean){
    let tasks = getTasks();
    let task = findTask(tasks, id);
    task.completed = boolean;
    localStorage.setItem("tasks", JSON.stringify(tasks)); 
}