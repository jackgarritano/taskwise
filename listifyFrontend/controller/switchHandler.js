import { getAllTasks } from "./fetch";
import { renderTask } from "../views/renderTask";
import { addToList, removeAllFromList,} from "./taskList";
export{setTimers, removeTimers};

let activeTimers = {};

function setTimers(now, switchDate, taskId){
    removeTimers(taskId);
    activeTimers[taskId] = setTimeout(renderAllTasks, switchDate - now);
}

function removeTimers(taskId){
    if(taskId in activeTimers){
        clearTimeout(activeTimers[taskId]);
        delete activeTimers[taskId];
    }
}

async function renderAllTasks(){
    let allTasks = Array.from(document.querySelector('.allTasks').children);
    
    getAllTasks().then((tasks) => {
        for(let i=1; i<allTasks.length; i++){
            allTasks[i].remove();
        }
        removeAllFromList();
        tasks.forEach((el)=>{
            renderTask(el, addToList(el));
        })
    });
    
}