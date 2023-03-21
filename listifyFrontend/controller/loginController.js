export {addLoginListeners};

function addLoginListeners(){
    document.querySelector('.guestLogin').addEventListener('click', async (e)=>{
        let taskSent = await fetch(`${import.meta.env.VITE_ALIAS}/testlogin`, {mode:'cors'});
        let receivedBody = await taskSent.json();
        if(receivedBody.status == 'it worked'){
            document.querySelector('body').innerHTML = '<div class="allTasks">'
            renderAddButton();
            getAllTasks().then((tasks) => {
                tasks.forEach((el)=>{
                    renderTask(el, addToList(el));
                })
            });
            }
    })
}