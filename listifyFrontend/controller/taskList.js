export {addToList, getId, deleteFromList, removeAllFromList};

let taskList = [];

function addToList(task){
    if(taskList.length == 0){
        taskList.push(task);
        return 0;
    }
    for(let i=0; i<taskList.length; i++){
        let iTask = taskList[i];
        if(task.priority > iTask.priority){
            taskList.splice(i, 0, task)
            return i;
        }
        else if(task.priority === iTask.priority ){
            if(!iTask.due || (Date.parse(task.due) <= Date.parse(iTask.due))){
                taskList.splice(i, 0, task);
                return i;
            }
        }
    }
    taskList.push(task);
    return taskList.length-1;
}

function getId(index){
    let id  = taskList[index]._id;
    return id;
}

function deleteFromList(index){
    taskList.splice(index, 1);
}

function removeAllFromList(){
    taskList = [];
}