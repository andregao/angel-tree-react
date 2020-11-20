import { commitments, genders, names, sizes, wishes } from './mockData';
import { getRandomItem, getRandomItems } from '../utils';

// generate a group of children
const childrenCount = 120;
const children = new Array(childrenCount);
let id = 0;
for (let i = 0; i < childrenCount; i++) {
  children[i] = {
    id,
    name: `${getRandomItem(names)} ${getRandomItem(names)}`,
    gender: getRandomItem(genders), //👦👧
    age: Math.floor(Math.random() * 10) + 2,
    sizes: getRandomItems(sizes, Math.floor(Math.random() * 3 + 2)), // 2 to 4 sizes
    wishes: getRandomItems(wishes, Math.floor(Math.random() * 3 + 2)), // 2 to 4 items
    committed: [true, false][Math.floor(Math.random() * 2)],
  };
  id++;
}

const instructions = `Once you commit you will be the only sponsor that can buy for this child. You can buy whatever you like base on their sizes and preferences. Be sure to bring the items to school reception area by Dec 11th. 

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, at dolorum, eligendi enim magni minima necessitatibus odit pariatur perferendis quas quibusdam quidem vel? Animi eos harum impedit magnam qui rem!`;

commitments[0].childName = children[commitments[0].childId].name;
commitments[1].childName = children[commitments[1].childId].name;
commitments[2].childName = children[commitments[2].childId].name;
export { instructions, children, commitments };
