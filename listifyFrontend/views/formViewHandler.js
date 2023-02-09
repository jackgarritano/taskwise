import { renderForm } from "./renderForm";
import { clearCal, renderCalendar } from "./calendar";
import { onlyPasteText } from "../controller/formHandler";
export {initForm};

function initForm(){
onlyPasteText();
let formElements = renderForm();
let allTasks = document.querySelector('.allTasks');
allTasks.append(formElements.addForm);

formElements.dueDate.addEventListener('click', () => {
    if(!document.querySelector('.calendarHolder')){
        renderCalendar(formElements.dueDate);
    }
})

document.addEventListener('click', function(e) {
    let calendarHolder = document.querySelector('.calendarHolder');
    if(calendarHolder){
        if (!calendarHolder.contains(e.target)) {
            clearCal();
            }
    }
}, true)
}