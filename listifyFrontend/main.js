import './style.css';
import { getAllTasks } from './controller/fetch';
import { sortOnLoad } from './controller/ordering';

sortOnLoad().then((task) => {
    console.log(JSON.stringify(task));
});
