
var dict = []; 

dict.push({
    key:   'Reset',
    value: "\x1b[0m"
});
dict.push({
    key:   'Bright',
    value: "\x1b[1m"
});
dict.push({
    key:   'Dim',
    value: "\x1b[2m"
});
dict.push({
    key:   'Underscore',
    value: "\x1b[4m"
});
dict.push({
    key:   'Blink',
    value: "\x1b[5m"
});
dict.push({
    key:   'Reverse',
    value: "\x1b[7m"
});
dict.push({
    key:   'Hidden',
    value: "\x1b[8m"
});
dict.push({
    key:   'FgBlack',
    value: "\x1b[30m"
});
dict.push({
    key:   'FgRed',
    value: "\x1b[31m"
});
dict.push({
    key:   'FgGreen',
    value: "\x1b[32m"
});
dict.push({
    key:   'FgYellow',
    value: "\x1b[33m"
});
dict.push({
    key:   'FgBlue',
    value: "\x1b[34m"
});
dict.push({
    key:   'FgMagenta',
    value: "\x1b[35m"
});
dict.push({
    key:   'FgCyan',
    value: "\x1b[37m"
});
dict.push({
    key:   'BgGreen',
    value: "\x1b[42m"
});
dict.push({
    key:   'BgWhite',
    value: "\x1b[47m"
});

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"

function getfontColor(colorName){
   // console.log(colorName);
    let colorRepresentation = dict.find(f=> f.key.includes(colorName));
   // console.log(colorRepresentation)
return colorRepresentation.value;
}

module.exports.getfontColor = getfontColor;