import './style.css';
import { getAllTasks } from './controller/fetch';
import { sortOnLoad } from './controller/ordering';
import { renderCalendar } from './views/calendar';
import { onlyPasteText } from './controller/formHandler';
import { renderForm } from './views/renderForm';
import { initForm, renderAddButton } from './views/formViewHandler';
import { renderTask } from './views/renderTask';
import { addToList } from './controller/taskList';
import { setTimers } from './controller/switchHandler';

// document.querySelector('body').innerHTML= '<form><input type="text" class="fillerInput"></input><button class="fillerButton">submit</button></form>';
// document.querySelector('.fillerButton').addEventListener('click', (e)=>{
//     e.preventDefault();
//     fetch(`${import.meta.env.VITE_ALIAS}/password`, {method:'PUT',
//         mode:'cors', headers:{
//         'Content-Type': 'application/json',}, 
//         body: JSON.stringify({password: document.querySelector('.fillerInput').value})})
//         .then((res)=>{
//             return res.json();
//         })
//         .then((res)=>{
//             if(res.status == 'passed'){
//                 document.querySelector('body').innerHTML = '<div class="allTasks">'
//                 renderAddButton();
//                 getAllTasks().then((tasks) => {
//                 tasks.forEach((el)=>{
//                 renderTask(el, addToList(el));
//             })
//             });
//             }
//         })
// })
window.handleAuth = async (a) => {
    console.log(a);
    try{
      let taskSent = await fetch(`http://localhost:3000/auth`,
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

document.querySelector('body').innerHTML = `
    <div id="g_id_onload"
        data-client_id="334783994184-v63tsepd3hfgg4534l9v74r3nqtv1t6l.apps.googleusercontent.com"
        data-context="signin"
        data-ux_mode="popup"
        data-callback="handleAuth"
        data-auto_select="true"
        data-itp_support="true">
    </div>

    <div class="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="outline"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left">
    </div>`

