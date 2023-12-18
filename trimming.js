let str = "w34.u6%";
let result = parseFloat(`${str.split('[')[0].trim()}`.split('%')[0].trim());
console.log({result});