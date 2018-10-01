
const isFunction = (fn) => typeof fn === 'function';

const isNumber = (n) => typeof n === 'number' && !Number.isNaN(n) && Number.isFinite(n) && n > 0;

const isObject = (obj) => typeof obj === 'object' && !Array.isArray(obj) && obj !== null;

const loadTextFile = (file, callback) => {
  const rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType('application/json');
  rawFile.open('GET', file, true);
  rawFile.onreadystatechange = () => {
    if (rawFile.readyState === 4 && rawFile.status == "200") callback(rawFile.responseText);
  }
  rawFile.send(null);
}

export default { isFunction, isNumber, isObject, loadTextFile };
