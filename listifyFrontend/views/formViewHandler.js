import { renderForm } from "./renderForm";
import { renderCalendar } from "./calendar";
import { onlyPasteText } from "../controller/formHandler";
export {initForm};

function initForm(){
onlyPasteText();
let formElements = renderForm();
let allTasks = document.querySelector('.allTasks');
allTasks.append(formElements.addForm);
renderCalendar(formElements.dueDate);

formElements.dueDate.addEventListener('click', () => {
    let calendarHolder = document.querySelector('.calendarHolder');
    if(calendarHolder.classList.contains('hidden')){
        calendarHolder.classList.remove('hidden');
    }
})

document.addEventListener('click', function(e) {
    let calendarHolder = document.querySelector('.calendarHolder');
    if (!calendarHolder.contains(e.target)) {
        if(!(calendarHolder.classList.contains('hidden'))){
                calendarHolder.classList.add('hidden');
            }
        }
      }, true)
}