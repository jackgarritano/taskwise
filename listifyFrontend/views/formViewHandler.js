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

formElements.dueDate.addEventListener('click', (e) => {
    let calendarHolder = document.querySelector('.calendarHolder')
    if(e.target.classList.contains('dateCircle') || e.target.parentElement.classList.contains('dateCircle')){
        calendarHolder.classList.add('hidden');
    }
    else if(calendarHolder.classList.contains('hidden')){
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

formElements.priority.addEventListener('click', (e) => {
    let priorityPicker = document.querySelectorAll('.priorityPickerHolder')[0];
    if(e.target.classList.contains('regPriorityButton')){
        formElements.priority.querySelector('input').setAttribute('value', e.target.dataset.number);
        priorityPicker.classList.add('hidden');
    }
    else if(priorityPicker.classList.contains('hidden')){
        priorityPicker.classList.toggle('hidden');
        closePopupListener();
    }
})
formElements.maxPriority.addEventListener('click', (e) => {
    let maxPriorityPicker = document.querySelectorAll('.priorityPickerHolder')[1];
    if(e.target.classList.contains('maxPriorityButton')){
        formElements.maxPriority.querySelector('input').setAttribute('value', e.target.dataset.number);
        maxPriorityPicker.classList.add('hidden');
    }
    else if(maxPriorityPicker.classList.contains('hidden')){
        maxPriorityPicker.classList.toggle('hidden');
        closePopupListener();
    }
})
formElements.estTime.querySelectorAll('.textInput').forEach((el)=>{
    el.addEventListener('focus', (e)=>{
        e.target.select();
})})

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

function gatherTextInput(e){
    let input = e.target.innerText;
    let inputField = document.querySelector(`#${e.target.dataset.inputType}`);
    inputField.setAttribute('value', input);
}

formElements.taskName.addEventListener('blur', gatherTextInput);
formElements.description.addEventListener('blur', gatherTextInput);

formElements.estTime.querySelectorAll('input').forEach((el)=>{
    el.addEventListener('keydown', (e)=>{
        if(e.code == "Minus"){
            e.preventDefault();
        }
    })
    el.addEventListener('paste', (e)=>{
        let pastedDatas = e.clipboardData.getData('text/plain');
        let currVal = e.target.value;
        let highlightedStr = '';
        let newVal = '';
        while(pastedDatas.indexOf('-') != -1){        
            pastedDatas = pastedDatas.replace('-','');
        }
        if (window.getSelection){
            highlightedStr = window.getSelection();
        }
        else if (document.getSelection){
            highlightedStr = document.getSelection();
        }
        else if (document.selection){
            highlightedStr = document.selection.createRange().text;;
        }
        newVal = currVal.replace(highlightedStr, pastedDatas);
        if(newVal.length > 3){
            newVal = newVal.slice(0,3);
        }
        e.target.value = newVal;
        e.preventDefault();
    })
    el.addEventListener('input', (e)=>{
        if(e.target.value.length > 3){
            e.target.value = e.target.value.slice(0,3);
        }
    })
    el.addEventListener('blur', (e)=>{
        if(e.target.value === ''){
            e.target.value = '0';
        }
    })
    })
        

}