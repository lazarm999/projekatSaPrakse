export function isDefined(obj){
    return typeof obj !== "undefined";
}

export function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key)) return false;
    }
    return true;
}

export function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

export function formatNumber(str) {
    if(isDefined(str)) {
        let value = str.toString();
        let arr = [];
        let cnt = 0;
        for(var i = value.length - 1; i >= 0; i--) {
            arr.push(value[i]);
        cnt++;
        if(cnt % 3 === 0 && i !== 0) {
            arr.push("."); 
        }
        }
        return arr.reverse().join("");
    }
}