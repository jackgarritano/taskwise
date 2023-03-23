export {addLoginListeners};
import { initForm, renderAddButton } from '../views/formViewHandler';
import { getAllTasks } from './fetch';
import { renderTask } from '../views/renderTask';
import { addToList } from './taskList';
import { renderEditor } from '../views/renderForm';

function addLoginListeners(){
    document.querySelector('.guestLogin').addEventListener('click', async (e)=>{
        let taskSent = await fetch(`${import.meta.env.VITE_ALIAS}/testlogin`, {mode:'cors'});
        let receivedBody = await taskSent.json();
        if(receivedBody.status == 'it worked'){
            document.querySelector('body').innerHTML = '<div class="overlay"><div class="allTasks"></div></div>'
            renderAddButton();
            getAllTasks().then((tasks) => {
                tasks.forEach((el)=>{
                    renderTask(el, addToList(el));
                })
            });
            }
    })
}