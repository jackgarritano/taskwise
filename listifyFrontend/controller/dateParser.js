import * as chrono from 'chrono-node';
export {parsedDate, update};


const parsedDate = function(editNode){
    let obj = {
        'dateArr': [],
        'length': 0,
        node: editNode,
    };

    obj.node.addEventListener('keydown', (e) => {
        if(e.code == 'Space'){
            e.preventDefault();
            let offset = Cursor.getCurrentCursorPosition(obj.node);
            removeStrong(obj.node);
            let inputText = obj.node.textContent;
            inputText = inputText.substr(0, offset) + '\u00A0' + inputText.substr(offset);
            obj.node.textContent = inputText;
            obj.highlight(false);
            Cursor.setCurrentCursorPosition(offset + 1, obj.node);
        }
    })

    obj['compare'] = function(parsedObj){
        let add = this.length < parsedObj.length; //changed to length
        let both = this.length == parsedObj.length;//changed to length
        let minIncrement = Math.min(this.length, parsedObj.length);//changed to length
   
        for(let i=0; i<minIncrement; i++){
            if(this.dateArr[i].date !== `${parsedObj[i].start.get('month')}/${parsedObj[i].start.get('day')}/${parsedObj[i].start.get('year')}`){
                return {
                    add,
                    index: i,
                    both,
                };
            }
        }
   
        if(parsedObj.length < this.length){//changed to length
            return {
                add: false,
                index: minIncrement,
                both,
            };
        }
        else if(parsedObj.length > this.length){//changed to length
            return {
                add: true,
                index: minIncrement,
                both,
            };
        }
        else{
            return {
                add: false,
                index: -1,
                both,
            };
        }
    }


    obj['add'] = function(day, month, year, index, ind1, ind2){
        let date = `${month}/${day}/${year}`;
        let highlighted = true;
       
        for(let i=index; i<this.length; i++){//changed to length
            if(this.dateArr[i].highlightable){
                highlighted = false;
                break;
            }
        }


        let dateObj = {
            date,
            'highlightable' : true,
            highlighted,
            ind1,
            ind2,
        }
        this.dateArr.splice(index, 0, dateObj);
        this.length ++;
        if(highlighted){
            this.highlight(true);
        }
        console.table(this.dateArr);
    }


    obj['remove'] = function(index){
        let removeHighlightNeeded = false;
        console.table(this.dateArr);
        if(this.dateArr[index].highlighted){
            removeHighlightNeeded = true;
        }
        this.dateArr.splice(index, 1);
        this.length --;
        console.table(this.dateArr);
        if(removeHighlightNeeded){
            this.highlight(true);
        }
    }


    obj['highlight'] = function(removeNecessary){        //first check if a highlight already exists. If it does, change that obj's highlighted prop to false, its highlightable
                                                         //to false, and remove the
                                                         //highlight element from the innerhtml. Then start at end of dateArr and firnd first obj which is highlightable
                                                         //and make its highlighted property true. Then add the necessary element around that text and innerhtml it in
        let highlight = document.createElement('strong');
        highlight.classList.add('highlighted');
        let dateToHighlight;

        let offset = Cursor.getCurrentCursorPosition(this.node);

        if(removeNecessary){
            removeHighlight(this, this.node);
        }

        dateToHighlight = highlightLastDate(this);

        if(dateToHighlight){
            let textNode = Array.from(this.node.childNodes).find((node) => {
                return node.nodeName === '#text'}).splitText(dateToHighlight.ind1);
            
            if(textNode.length > dateToHighlight.ind2){
                textNode.splitText(dateToHighlight.ind2);
            }
            
            let range = document.createRange();
            range.selectNodeContents(textNode);
            range.surroundContents(highlight);

        }
        Cursor.setCurrentCursorPosition(offset, this.node);
        this.node.focus();
       
    }


    return obj;
}


function update(datesObj, parseResult){
    let comparison = datesObj.compare(parseResult);
    if(comparison.index != -1){
      if(comparison.both){
        datesObj.remove(comparison.index);
        datesObj.add(parseResult[comparison.index].start.get('day'), parseResult[comparison.index].start.get('month'),
          parseResult[comparison.index].start.get('year'), comparison.index, parseResult[comparison.index].index, parseResult[comparison.index].text.length);
      }
      else{
        if(comparison.add){
            console.log(parseResult[comparison.index].index);
            datesObj.add(parseResult[comparison.index].start.get('day'), parseResult[comparison.index].start.get('month'),
          parseResult[comparison.index].start.get('year'), comparison.index, parseResult[comparison.index].index, parseResult[comparison.index].text.length);
        }
        else{
            datesObj.remove(comparison.index);
        }
      }
    }
}

function removeHighlight(parsedDateObj, parentNode){
    for(let i=0; i<parsedDateObj.length; i++){
        if(parsedDateObj.dateArr[i].highlighted){
            parsedDateObj.dateArr[i].highlighted = false;
        }
    }
    removeStrong(parentNode);
}

function removeStrong(parentNode){
    let highlight;
    while(highlight = parentNode.querySelector('strong')){
        while(highlight.firstChild){
            parentNode.insertBefore(highlight.firstChild, highlight);
        }
        highlight.remove();
    }
    parentNode.normalize();
}

function highlightLastDate(parsedDateObj){
    for(let i=parsedDateObj.length-1; i>=0; i--){
        if(parsedDateObj.dateArr[i].highlightable){
            parsedDateObj.dateArr[i].highlighted = true;
            return parsedDateObj.dateArr[i];
        }
    }
}

class Cursor {
    static getCurrentCursorPosition(parentElement) {
        var selection = window.getSelection(),
            charCount = -1,
            node;
       
        if (selection.focusNode) {
            if (Cursor._isChildOf(selection.focusNode, parentElement)) {
                node = selection.focusNode;
                charCount = selection.focusOffset;
               
                while (node) {
                    if (node === parentElement) {
                        break;
                    }


                    if (node.previousSibling) {
                        node = node.previousSibling;
                        charCount += node.textContent.length;
                    } else {
                        node = node.parentNode;
                        if (node === null) {
                            break;
                        }
                    }
                }
            }
        }
       
        return charCount;
    }
   
    static setCurrentCursorPosition(chars, element) {
        if (chars >= 0) {
            var selection = window.getSelection();
           
            let range = Cursor._createRange(element, { count: chars });


            if (range) {
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    static _createRange(node, chars, range) {
        if (!range) {
            range = document.createRange()
            range.selectNode(node);
            range.setStart(node, 0);
        }


        if (chars.count === 0) {
            range.setEnd(node, chars.count);
        } else if (node && chars.count >0) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.length < chars.count) {
                    chars.count -= node.textContent.length;
                } else {
                    range.setEnd(node, chars.count);
                    chars.count = 0;
                }
            } else {
                for (var lp = 0; lp < node.childNodes.length; lp++) {
                    range = Cursor._createRange(node.childNodes[lp], chars, range);


                    if (chars.count === 0) {
                    break;
                    }
                }
            }
        }


        return range;
    }
   
    static _isChildOf(node, parentElement) {
        while (node !== null) {
            if (node === parentElement) {
                return true;
            }
            node = node.parentNode;
        }


        return false;
    }
}