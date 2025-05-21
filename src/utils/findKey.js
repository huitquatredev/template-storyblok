export default function findByKey(obj, key) {
  if (obj == null || obj == undefined) {
    return;
  }
  if (obj.constructor === Object || obj.constructor === Array) {
    var keys = Object.keys(obj);
    for (i in keys) {
      var i = keys[i];
      if (key == i) {
        return obj;
      } else {
        var test = findByKey(obj[i], key);
        if (test != undefined) {
          return test;
        }
      }
    }
  } else if (obj == key) {
    return key;
  }
  return;
}
