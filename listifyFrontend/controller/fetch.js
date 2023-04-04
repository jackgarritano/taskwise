export {getAllTasks, saveTask, deleteFromDb, fetchWithMiddleware};

async function getAllTasks(){
    try{
        let tasksObject = await fetchWithMiddleware(`${import.meta.env.VITE_ALIAS}/tasks`, {mode:'cors'});
        let newObj = await tasksObject.json();
        return newObj;
    }
    catch(e){
        console.log("getAllTasks error: " + e);
    }
}

async function saveTask(task){
    try{
        let taskSent = await fetchWithMiddleware(`${import.meta.env.VITE_ALIAS}`,
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
        let taskSent = await fetchWithMiddleware(`${import.meta.env.VITE_ALIAS}`, 
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

function addHeadersToRequest(request) {
    // Set the desired headers here
    request.headers.set('m_id', document.m_id);
    return request;
  }
  
  function fetchWithMiddleware(url, options = {}) {
    // Apply the middleware to the request
    const request = addHeadersToRequest(new Request(url, options));
    return fetch(request);
  }