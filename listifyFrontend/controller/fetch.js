export {getAllTasks};

async function getAllTasks(){
    let tasksObject = await fetch('http://localhost:3000', {mode:'cors'});
    let newObj = await tasksObject.json();
    return newObj;
}