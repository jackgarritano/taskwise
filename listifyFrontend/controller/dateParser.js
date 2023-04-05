import * as chrono from 'chrono-node';
export {parsedDate, update};

const parsedDate = function(editNode){
    let obj = {
        'dateArr': [],
        'length': 0,
        node: editNode,
    };

    this.node.addEventListener('keydown', function(event) {
        if (event.keyCode === 32) {
          
        }
      });

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
            this.highlight();
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
            this.highlight();
        }
    }

    obj['highlight'] = function(){                      //first check if a highlight already exists. If it does, change that obj's highlighted prop to false, its highlightable
                                                         //to false, and remove the
                                                         //highlight element from the innerhtml. Then start at end of dateArr and firnd first obj which is highlightable
                                                         //and make its highlighted property true. Then add the necessary element around that text and innerhtml it in
        let highlight = document.createElement('strong');
        highlight.classList.add('highlighted');
        let workingText = this.node.innerText;
        let dateToHighlight;

        for(let i=0; i<this.length; i++){
            if(this.dateArr[i].highlighted){
                this.dateArr[i].highlighted = false;
                break;
            }
        }

        for(let i=this.length-1; i>=0; i--){
            if(this.dateArr[i].highlightable){
                dateToHighlight = this.dateArr[i];
                dateToHighlight.highlighted = true;
                break;
            }
        }

        if(dateToHighlight){
            console.log('dateToHighlight isn"t null');
            let beforeStr = workingText.slice(0, dateToHighlight.ind1);
            let dateStr = workingText.slice(dateToHighlight.ind1, dateToHighlight.ind2);
            let afterStr = workingText.slice(dateToHighlight.ind2);

            highlight.textContent = dateStr;

            this.node.innerHTML = '';
            
            this.node.append(document.createTextNode(beforeStr));
            this.node.append(highlight);
            this.node.append(document.createTextNode(afterStr));

            // Create a range that starts immediately after the <strong> element
            let range = document.createRange();         //need it to be that space takes you outside
            range.setStartAfter(highlight);
            range.setEndAfter(highlight);

            // Set the selection to the range
            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
        else{
            console.log('dateToHighlight is null');
            let offset = Cursor.getCurrentCursorPosition(this.node);

            this.node.innerHTML = '';
            this.node.textContent = workingText;

            Cursor.setCurrentCursorPosition(offset, this.node);
            this.node.focus();
        }
        
    }

    return obj;
}

function update(datesObj, parseResult){
    let comparison = datesObj.compare(parseResult);
    if(comparison.index != -1){
      if(comparison.both){
        datesObj.remove(comparison.index);
        datesObj.add(parseResult[comparison.index].start.get('day'), parseResult[comparison.index].start.get('month'), 
          parseResult[comparison.index].start.get('year'), comparison.index, parseResult[comparison.index].index, parseResult[comparison.index].index + parseResult[comparison.index].text.length);
      }
      else{
        if(comparison.add){
            console.log(parseResult[comparison.index].index);
            datesObj.add(parseResult[comparison.index].start.get('day'), parseResult[comparison.index].index, 
          parseResult[comparison.index].start.get('year'), comparison.index, parseResult[comparison.index].index, parseResult[comparison.index].index + parseResult[comparison.index].text.length);
        }
        else{
            datesObj.remove(comparison.index);
        }
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