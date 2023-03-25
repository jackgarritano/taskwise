import { deleteFromList, getId } from "./taskList";
import { deleteFromDb } from "./fetch";
import { initEditForm } from "../views/formViewHandler";
import { removeTimers } from "./switchHandler";
export {addInteractvity, deleteTask, getCheckIndex};

function addInteractvity(taskNode){
    taskNode.checkCircle.addEventListener('click', (e) => {
        deleteTask(e);
    });
    taskNode.task.addEventListener('click', initEditForm);
}

async function deleteTask(e){
    e.stopPropagation();
    let index = getCheckIndex(e.target)
    let id = getId(index);
    try{
        let result = await deleteFromDb(id);
        if(result = 'success'){
            deleteFromList(index);
            document.querySelector('.allTasks').children[index+1].remove();
            removeTimers(id);
        }
    }
    catch(e){
        console.log('error deleting task: ' + e);
    }
}

function getCheckIndex(check){
    let tasks = document.querySelector('.allTasks').children;
    for(let i=1; i<tasks.length; i++){
        if(tasks[i].contains(check)){
            return i-1;
        }
    }
    return -1;
}