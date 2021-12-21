export function serialize(obj) {
  return Object.keys(obj)
    .map(key => `${key}: ${obj[key]}`)
    .join('\n');
}

export function deSerialize(str) {
  var obj = {};
  str.split('\n').forEach(item => {
    var itemDetails = item.split(':');
    obj[itemDetails[0]] = `${itemDetails[1]}`.trim();
  });

  return obj;
}
