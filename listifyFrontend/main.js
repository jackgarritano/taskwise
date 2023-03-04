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

document.querySelector('body').innerHTML= '<form><input type="text" class="fillerInput"></input><button class="fillerButton">submit</button></form>';
document.querySelector('.fillerButton').addEventListener('click', (e)=>{
    e.preventDefault();
    fetch('http://localhost:3000/password', {method:'PUT',
        mode:'cors', headers:{
        'Content-Type': 'application/json',}, 
        body: JSON.stringify({password: document.querySelector('.fillerInput').value})})
        .then((res)=>{
            return res.json();
        })
        .then((res)=>{
            if(res.status == 'passed'){
                document.querySelector('body').innerHTML = '<div class="allTasks">'
                renderAddButton();
                getAllTasks().then((tasks) => {
                tasks.forEach((el)=>{
                renderTask(el, addToList(el));
            })
            });
            }
        })
})
