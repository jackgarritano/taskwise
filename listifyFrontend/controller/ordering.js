import { getAllTasks } from "./fetch";
export {sortOnLoad};

async function sortOnLoad(){  //todo: priority field doesn't reflect current priority: need to calculate the priority for this, not use the field
    let allTasks = await getAllTasks();
    allTasks.sort((item1, item2) => {
        if(parseInt(item1.priority) > parseInt(item2.priority)){
            return -1;
        }
        else if(parseInt(item1.priority) < parseInt(item2.priority)){
            return 1;
        }
        else if(Date.parse(item1.due) > Date.parse(item2.due)){
            return 1;
        }
        else if(Date.parse(item1.due) < Date.parse(item2.due)){
            return -1;
        }
        else{
            return 0;
        }
    })
    return allTasks;
}