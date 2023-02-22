export {getAllTasks, saveTask, deleteFromDb};

async function getAllTasks(){
    try{
        let tasksObject = await fetch('http://localhost:3000', {mode:'cors'});
        let newObj = await tasksObject.json();
        return newObj;
    }
    catch(e){
        console.log("getAllTasks error: " + e);
    }
}

async function saveTask(task){
    try{
        let taskSent = await fetch('http://localhost:3000', 
            {method:'POST',
            mode:'cors',
            headers:{
                'Content-Type': 'application/json',
                },
            body:JSON.stringify(task),
            })
        let receievdBody = await taskSent.json();
        task.id = receievdBody._id;
        return task;
    }
    catch(e){
        console.log('saveTask error: ' + e);
    }
}

async function deleteFromDb(id){
    try{
        let taskSent = await fetch('http://localhost:3000', 
            {method:'DELETE',
            mode:'cors',
            headers:{
                'Content-Type': 'application/json',
                },
            body: JSON.stringify({id:id}),
            })
        return 'success';
    }
    catch(e){
        return e;
    }
}