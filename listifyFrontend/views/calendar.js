export {renderCalendar, clearCal};

//todo: fix inconsistent spacing above and below 'today' and 'tomorrow' buttons
//todo: add a function to pre-populate selected date on open if a date was previously selected and render the month of the selected date instead of current month
//todo: add a prepend months method for use in the above case
function renderCalendar (parent){ 
    var monthsToShow, primary, accent, mode;
    var cal;
    const d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() - 1;
  
    let dateInput = document.querySelector('input[name=dateInput]');
    //const body = document.querySelector('body');
    const calendarHolder = document.createElement('div');
    calendarHolder.classList.add('calendarHolder', 'hidden', 'popup');
    const calendar = document.createElement('div');
    calendar.classList.add('calendar');
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('inputs');
    const today = document.createElement('div');
    today.classList.add('today');
    today.textContent = 'Today';
    const tomorrow = document.createElement('div');
    tomorrow.classList.add('tomorrow');
    tomorrow.textContent = "Tomorrow";
    const calContainer = document.createElement('div');
    calContainer.classList.add('cal__container');
    const scrollDown = document.createElement('span');
    //scrollDown.classList.add('scrollDown');
    scrollDown.textContent = '(scroll down)';
  
    inputContainer.append(today);
      inputContainer.append(tomorrow);
      calendar.append(inputContainer);
      calendar.append(calContainer);
      calendarHolder.append(calendar);
      parent.append(calendarHolder);
  
    /*inputContainer.append(today);
    inputContainer.append(tomorrow);
    calendar.append(inputContainer);
    calendar.append(calContainer);
    calendarHolder.append(calendar);
    body.append(calendarHolder);*/
  
    var style = false;
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "Decemeber"
    ];
  
    let Pikka = {
      date: function(options){
        style = options.style;
        monthsToShow = options.monthsToRender;
        accent = options.accentColor;
        primary = options.primaryColor;
        mode = options.mode;
      }
    }
  
    // options for setting up the calendar
    Pikka.date({
      format: "dd/mm/yyyy",
      style: "circles", // squares or circles
      primaryColor: "#FF5A5F",
      accentColor: "#f99092",
      monthsToRender: 4, // how many months to render in multiple mode
      disabledDatesFormat: "en-GB",
      userDatesFormat: "en-GB",
      mode: "multiple" // single or multiple
    });
  
    //document.addEventListener('DOMContentLoaded', function() {
        monthsToShow = 4;
      for (let i = 1; i <= monthsToShow; i++) {
        month = month + 1;
        if (month == 12) {
          month = 0;
          year = year + 1;
        }
        if(i == 2){
          buildCal(true);
        }
        else{
        buildCal(false);
        }
      }
        addMoreMonths();
   // });
  
    
  
    // Logic for calendar
    function buildCal(is2ndMonth) {
  
  
      let monthControls = document.createElement("div");
      monthControls.classList.add('month__controls');
      let newMonth = document.createElement("div");
      let monthTitle = document.createElement("span");
      let monthText = document.createTextNode(months[month] + " " + year);
      newMonth.appendChild(monthControls);
  
      monthTitle.appendChild(monthText);
      newMonth.classList.add("month");
  
      // create the table in the DOM
      cal = createTable();
      const daysOfWeek = ["m", "t", "w", "t", "f", "s", "s"];
      let header = cal.createTHead();
      for (let i = 0; i < daysOfWeek.length; i++) {
        let th = document.createElement("th");
        th.innerHTML = daysOfWeek[i];
        header.appendChild(th);
      }
  
      // this adds a day onto February every leap year (every 4 years)
      let daysInMonth = new Date(2019, parseInt(month) + 1, 0).getDate();
      if(month == 1 && year % 4 == 0) {
       daysInMonth = daysInMonth + 1;
      }
  
      // define a start day, then loop through the month
      let startDay = new Date(year, month, 1).getDay();
      let weekIndex = cal.getElementsByTagName("tr").length;
      let day = startDay == 0 ? 7 : startDay;
      var row = cal.insertRow(weekIndex);
  
      // creates the blanks at the start of the month
      for (let ed = 1; ed < day; ed++) {
        row.insertCell(-1);
      }
  
      // loops through the days adding cells and creating new rows
      for (let dim = 1; dim <= daysInMonth; dim++) {
        let cell = row.insertCell(-1);
        let gbFormat = new Intl.DateTimeFormat("en-US").format(new Date(year, month, dim));
        cell.setAttribute("data-date-intl", new Date(year, month, dim));
        cell.setAttribute("data-date", gbFormat);
        cell.classList.add('dateCircle');
        cell.innerHTML = '<span>'+dim+'</span>';
        day++;
        if (day == 8) {
          weekIndex++;
          row = cal.insertRow(weekIndex);
          day = 1;
        }
      }
      let monthTitleCont = document.createElement("div");
      monthTitleCont.appendChild(monthTitle);
      monthControls.appendChild(monthTitleCont); 
      if(is2ndMonth){
        monthControls.childNodes[0].appendChild(scrollDown);
      }
      newMonth.appendChild(cal);
      calContainer.appendChild(newMonth);
      if (month == new Date().getMonth() && year == new Date().getFullYear()) {
        highlightToday();
      }
  
      function scrollDisappear(){
        let scroll = calContainer.scrollTop || 0;
        scrollDown.style.opacity = 1-scroll/150;
        if(scroll >= 150){
          calContainer.removeEventListener('scroll', scrollDisappear);
          scrollDown.remove();
      }
      }
    calContainer.addEventListener('scroll', scrollDisappear);
  
      // function to add event listeners to each table cell
      initCells(cal);
    }
  
    // function to create and append more months to the calendar
    function addMoreMonths() {
      let reconcileMonths = function() {
            for (let i = 1; i <= 3; i++) {
              month = month + 1;
              if (month == 12) {
                month = 0;
                year = year + 1;
              }
              buildCal(false);
            }
            let moreMonthsCurrent = document.getElementsByClassName("more__months")[0];
            moreMonthsCurrent.remove();
            calContainer.appendChild(moreMonths);
          }
      let moreMonths = document.createElement("div");
      moreMonths.classList.add("more__months");
      moreMonths.innerHTML = "+";
      moreMonths.addEventListener("click", reconcileMonths);
      let observer = new IntersectionObserver(reconcileMonths, {
        root:document.querySelector('.calendar'),
        rootMargin:'50px',
      });
      observer.observe(moreMonths);
      calContainer.appendChild(moreMonths);
    }
  
    /* function to build a table */
    function createTable() {
      let table = document.createElement("table");
      let thead = table.createTHead();
      let tbody = table.createTBody();
      table.classList.add(style)
      return table;
    }
  
    var cells;
  
    function initCells(newMonth) {
      cells = newMonth.querySelectorAll("[data-date]");
      // loop through all cells adding event listeners
      cells.forEach(function(item, idx) {
        item.addEventListener("click", function() {
            clearRange();
            item.classList.add('selected__startEnd');
            dateInput.value = item.getAttribute("data-date");
        });
      });
    }
    /* 
    this function deletes all the <tr> elements
    then rebuilds the table header
    */
    function deletePrevMonth() {
      const cal = document.getElementById("cal");
      cal.innerHTML = "";
    }
  
    /* 
    function highlights the current day we're on
    only if we're on the right month
    */
    function highlightToday() {
      let today = new Date();
      let todayCell = document.querySelector(
        'td[data-date="' + new Intl.DateTimeFormat("en-US").format(today) + '"]'
      );
      todayCell.classList.add("todaysDate");
      let todayIndicator = document.createElement('div');
      todayIndicator.classList.add('todayIndicator');
      todayCell.append(todayIndicator);
  
    }
  
    /* function to clear the selected dates */
    function clearRange() {
      let selected = document.querySelectorAll('.selected,.selected__startEnd');
      for(let item of selected) {
        item.classList = "";
      }
    }
  }
  // function to destroy the calendar element
  function clearCal() {
    let calCont = document.querySelector('.calendarHolder');
    calCont.remove();
  }