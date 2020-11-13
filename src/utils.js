export const itemsFromArray = array => {
  let result = '';
  array.map(item => (result += `${item}, `));
  return result;
};

export const itemsToArray = str => {
  return str
    .trim()
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 1);
};
export const getRandomItem = collection =>
  collection[Math.floor(Math.random() * collection.length)];
export const getRandomItems = (collection, count) => {
  const usedIndices = {};
  const result = [];
  for (let i = 0; i < count; i++) {
    const pick = Math.floor(Math.random() * collection.length);
    if (!usedIndices[pick]) {
      usedIndices[pick] = true;
      result.push(collection[pick]);
    } else {
      i--;
    }
  }
  return result;
};
