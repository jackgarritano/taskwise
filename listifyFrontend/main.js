import './style.css';
import { getAllTasks } from './controller/fetch';
import { sortOnLoad } from './controller/ordering';
import { renderCalendar } from './views/calendar';
import { onlyPasteText } from './controller/formHandler';

/*sortOnLoad().then((task) => {
    console.log(JSON.stringify(task));
});*/

//renderCalendar();

onlyPasteText();
