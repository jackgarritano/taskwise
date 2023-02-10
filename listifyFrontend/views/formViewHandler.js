import { renderForm } from "./renderForm";
import { clearCal, renderCalendar } from "./calendar";
import { onlyPasteText } from "../controller/formHandler";
export {initForm};

function initForm(){
onlyPasteText();
let formElements = renderForm();
let allTasks = document.querySelector('.allTasks');
allTasks.append(formElements.addForm);
renderCalendar(formElements.dueDate);

formElements.dueDate.addEventListener('click', () => {
    let calendarHolder = document.querySelector('.calendarHolder')
    if(calendarHolder.classList.contains('hidden')){
        calendarHolder.classList.toggle('hidden');
        closePopupListener();
    }
})

formElements.estTime.addEventListener('click', () => {
    let estTime = document.querySelector('.timePickerHolder')
    if(estTime.classList.contains('hidden')){
        estTime.classList.toggle('hidden');
        closePopupListener();
    }
})

function closePopupListener(e){
    let popup;
    let popups = document.querySelectorAll('.popup');
    popups.forEach((item) => {
        if(!item.classList.contains('hidden')){
            popup = item;
        }
    })
    let closePopup = function(e){ 
        if (!popup.contains(e.target)) {
            popup.classList.add('hidden');
            removeClosePopupListener();
        }
    }
    let removeClosePopupListener = function(){
        document.removeEventListener('click', closePopup, true);
    }
    document.addEventListener('click', closePopup, true)
}

}