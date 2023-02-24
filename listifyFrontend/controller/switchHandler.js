import { getAllTasks } from "./fetch";
import { renderTask } from "../views/renderTask";
import { addToList, removeAllFromList,} from "./taskList";
export{setTimers};

function setTimers(now, switchDate){
    setTimeout(renderAllTasks, switchDate - now);
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