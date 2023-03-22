import './style.css';
import { getAllTasks } from './controller/fetch';
import { initForm, renderAddButton } from './views/formViewHandler';
import { renderTask } from './views/renderTask';
import { addToList } from './controller/taskList';
import { initLoginScreen } from './views/loginScreen';

window.handleAuth = async (a) => {
    try{
      let taskSent = await fetch(`${import.meta.env.VITE_ALIAS}/auth`,
        {method:'POST',
        mode:'cors',
        headers:{
          'Content-Type': 'application/json',
          },
        body:JSON.stringify(a),
        })
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
    }
    catch(e){
      console.log('handleAuth error: ' + e);
    }
  }

initLoginScreen();



