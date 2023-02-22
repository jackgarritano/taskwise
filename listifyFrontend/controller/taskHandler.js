import { deleteFromList, getId } from "./taskList";
import { deleteFromDb } from "./fetch";
export {addInteractvity};

function addInteractvity(taskNode){
    taskNode.checkCircle.addEventListener('click', deleteTask);
}

async function deleteTask(e){
    let index = getCheckIndex(e.target)
    let id = getId(index);
    try{
        let result = await deleteFromDb(id);
        if(result = 'success'){
            deleteFromList(index);
            document.querySelector('.allTasks').children[index+1].remove();
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