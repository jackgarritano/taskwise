import * as chrono from 'chrono-node';
import { renderTask } from "../views/renderTask";
import { saveTask } from "./fetch";
import { addToList } from "./taskList";
import { derenderForm, derenderEditForm } from "../views/formViewHandler";
import { deleteTask } from "./taskHandler";
import { parsedDate } from '../dateParser';
export {onlyPasteText, regPriorityButtonClicked, maxPriorityButtonClicked,
  observeTextFields, validateTimeInputs, getErrorMessage, formSubmission, editFormSubmission};

function onlyPasteText(){
const inputText = document.querySelectorAll(".textInput");

inputText.forEach((item)=>{
    item.addEventListener("paste", function(e) {
        e.preventDefault();
        if (e.clipboardData && e.clipboardData.getData) {
          let text = e.clipboardData.getData("text/plain");
          document.execCommand("insertHTML", false, text);
        } else if (window.clipboardData && window.clipboardData.getData) {
          let text = window.clipboardData.getData("Text");
          insertTextAtCursor(text);
        }
      });
    })}

function regPriorityButtonClicked(target, formNode){
  if(!target.classList.contains('regPriorityButton')){
    return false;
  }
  else{
    formNode.querySelector('input[name="priInput"]').setAttribute('value', target.dataset.number);
    if(formNode.querySelector('input[name="maxPriInput"]').value != '' &&
      target.dataset.number > formNode.querySelector('input[name="maxPriInput"]').value){
      formNode.querySelector('input[name="maxPriInput"]').value = target.dataset.number;
      formNode.querySelector('.maxPriChoice > span').textContent = target.dataset.number;
    }
    formNode.querySelector('.priChoice > span').textContent = target.dataset.number;
    return true;
  }
}

function maxPriorityButtonClicked(target, highestUnavailable, formNode){
  if(!(target.classList.contains('maxPriorityButton') && target.dataset.number > highestUnavailable)){
    return false;
  }
  else{
    formNode.querySelector('input[name="maxPriInput"]').setAttribute('value', target.dataset.number);
    formNode.querySelector('.maxPriChoice > span').textContent = target.dataset.number;
    return true;
  }
}

function observeTextFields(checkIfAddAllowed, formNode){
  let taskName = formNode.querySelector('.title');
  let description = formNode.querySelector('.description');
  let taskNameDates = new parsedDate();
  let descriptionDates = new parsedDate();

  function gatherTitleInput(){
    let modifiedElement = taskName;
    let input = modifiedElement.innerText.replace(/\n/g, '');
    let inputField = formNode.querySelector(`#${modifiedElement.dataset.inputType}`);
    inputField.setAttribute('value', input);
    let parseResult = chrono.parse(input);
    let comparison = taskNameDates.compare(parseResult);
    console.log('title comparison output: ' + JSON.stringify(comparison));
    if(comparison.index != -1){
      if(comparison.add){
        taskNameDates.add(parseResult[index].start.get('month'), parseResult[index].start.get('day'), parseResult[index].start.get('year'), comparison.index)
      }
      else{
        taskNameDates.remove(comparison.index);
      }
    }

    checkIfAddAllowed();
  }

  function gatherDescInput(){
    let modifiedElement = description;
    let input = modifiedElement.innerText.replace(/\n/g, '');
    let inputField = formNode.querySelector(`#${modifiedElement.dataset.inputType}`);
    inputField.setAttribute('value', input);
    let parseResult = chrono.parse(input);
    let comparison = descriptionDates.compare(parseResult);
    console.log('title comparison output: ' + JSON.stringify(comparison));
    if(comparison.index != -1){
      if(comparison.add){
        descriptionDates.add(parseResult[index].start.get('month'), parseResult[index].start.get('day'), parseResult[index].start.get('year'), comparison.index)
      }
      else{
        descriptionDates.remove(comparison.index);
      }
    }

    checkIfAddAllowed();

    checkIfAddAllowed();
  }



  const titleObserver = new MutationObserver(gatherTitleInput);
  titleObserver.observe(taskName, {characterData: true, subtree: true});
  const descObserver = new MutationObserver(gatherDescInput);
  descObserver.observe(description, {characterData: true, subtree: true});
}

function validateTimeInputs(el){
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
}

function getErrorMessage(formNode){
  let firstMessage = true;
  let message = '';
  if(formNode.querySelector('input[name=taskName]').value == ''){
      message += "Task name is required";
      firstMessage = false;
  }
  if(formNode.querySelector('input[name=priInput]').value == ''){
      if(!firstMessage){
          message += ', ';
      }
      message += 'Priority is required';
      firstMessage = false;
  }
  if(formNode.querySelector('input[name=dateInput]').value == '' &&
  formNode.querySelector('input[name=maxPriInput]').value != ''){
      if(!firstMessage){
          message += ', ';
      }
      message += 'Date is required to use Max. Priority';
      firstMessage = false;
  }
  return message;
}

function formSubmission(e, formNode){
  if(getErrorMessage(formNode) != ''){
    e.preventDefault();
  }
  else{
    e.preventDefault();
    let task = constructTask(formNode);
    renderTask(task, addToList(task));
    saveTask(task);
    derenderForm();
  }
}

async function editFormSubmission(e, formNode, taskClick){
  if(getErrorMessage(formNode) != ''){
    e.preventDefault();
  }
  else{
    e.preventDefault();
    derenderEditForm();
    await deleteTask(taskClick);
    let task = constructTask(formNode);
    renderTask(task, addToList(task));
    saveTask(task);
  }
}

function taskFactory(name, desc, due, priority, maxPriority, estimatedTime){
  let task = {name, desc, due, priority, maxPriority, estimatedTime};
  let switchTimes = [];
  if(maxPriority != ''){
    switchTimes = findSwitchTimes(task);
  }
  task.switchTimes = switchTimes;
  return task;
}

function findSwitchTimes(task) {
  let intervals = parseInt(task.maxPriority) - parseInt(task.priority);
  if (intervals == 0) {             //no intervals means priority doesn't switch
      return null;
  }
  let due = new Date(task.due);
  let dueMS = due.getTime();           //due date in milliseconds (date object)
  let today = new Date();          //current time in iso format
  let currentMS = today.getTime();     //current time in milliseconds
  let estimatedTime = task.estimatedTime;
  if (estimatedTime < 86400000) {   //ensures that highest priority will be reached a minimum of a day before due
      estimatedTime = 86400000;
  }
  let lastSwitch = dueMS - estimatedTime;
  let intervalTime = (lastSwitch - currentMS) / intervals;
  let switchTimes = [];
  for (let i = 1; i <= intervals; i++) {    //calculates each intervalTime and adds it to the array
      let nextInterval = new Date(currentMS + (intervalTime * i));
      switchTimes.push(nextInterval.toJSON());
  }
  return switchTimes
}

function constructTask(formNode){
  let name = formNode.querySelector('input[name=taskName]').value;
  let desc = formNode.querySelector('input[name=taskDesc]').value;
  let due = formNode.querySelector('input[name=dateInput]').value;
  let priority = formNode.querySelector('input[name=priInput]').value;
  let maxPriority = formNode.querySelector('input[name=maxPriInput]').value;
  let estimatedMins = parseInt(formNode.querySelector('input[name=estMinutes').value);
  let estimatedHours = parseInt(formNode.querySelector('input[name=estHours').value);
  let estimatedDays = parseInt(formNode.querySelector('input[name=estDays').value);
  let estimatedMs = (60000 * estimatedMins) + (3600000 * estimatedHours) + (86400000 * estimatedDays);

  let task = taskFactory(name, desc, due, priority, maxPriority, estimatedMs);
  return task;
}