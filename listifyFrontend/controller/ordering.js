import { getAllTasks } from "./fetch";
import { calculateCurrentPriority } from "../views/renderTask";
export {sortOnLoad};

async function sortOnLoad(){  //todo: priority field doesn't reflect current priority: need to calculate the priority for this, not use the field
    let allTasks = await getAllTasks();
    allTasks.sort((item1, item2) => {
        priority1 = calculateCurrentPriority(item1.priority, item2.switchTimes);
        priority2 = calculateCurrentPriority(item2.priority, item2.switchTimes);
        if(parseInt(priority1) > parseInt(priority2)){
            return -1;
        }
        else if(parseInt(priority1) < parseInt(priority2)){
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