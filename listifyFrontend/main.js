import './style.css';
import { getAllTasks } from './controller/fetch';
import { sortOnLoad } from './controller/ordering';
import { renderCalendar } from './views/calendar';
import { onlyPasteText } from './controller/formHandler';
import { renderForm } from './views/renderForm';

/*sortOnLoad().then((task) => {
    console.log(JSON.stringify(task));
});*/

//renderCalendar();

onlyPasteText();
let formElements = renderForm();
let allTasks = document.querySelector('.allTasks');
allTasks.append(formElements.addForm);
