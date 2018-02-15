"use strict"
var i = 0;

function timedCount() {
    i = i + 1;
    self.postMessage(i);
    setTimeout("timedCount()",500);
}

timedCount();