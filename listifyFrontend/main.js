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

let script = document.querySelector('body').querySelector('script');
document.querySelector('head').append(script);

renderAddButton();

getAllTasks().then((tasks) => {
    tasks.forEach((el)=>{
        renderTask(el, addToList(el));
    })
});



/*onlyPasteText();
let formElements = renderForm();
let allTasks = document.querySelector('.allTasks');
allTasks.append(formElements.addForm);
renderCalendar(formElements.dueDate);*/

//initForm();
//renderTask();