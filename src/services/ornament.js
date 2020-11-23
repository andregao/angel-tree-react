import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const variantOptions = ['round', 'oval', 'star'];
const colorOptions = [
  '#983843',
  '#cc231e',
  '#f5624d',
  '#F8B229',
  '#FCE43C',
  '#3A6671',
  '#fde7dd',
  '#F6A9A9',
];
const getRandomItem = collection =>
  collection[Math.floor(Math.random() * collection.length)];

export const getRandomVariant = () => getRandomItem(variantOptions);
export const getRandomColor = () => getRandomItem(colorOptions);
export const getOrnamentWidth = count => {
  switch (true) {
    case count > 90:
      return '3.4%';
    case count > 80:
      return '3.7%';
    case count > 70:
      return '4%';
    case count > 60:
      return '4.35%';
    case count > 50:
      return '4.65%';
    case count > 40:
      return '4.9%';
    case count > 30:
      return '5.5%';
    case count > 20:
      return '6.3%';
    case count > 10:
      return '7.4%';
    default:
      return '10.5%';
  }
};

// limit ornament count to 100 max
export const limitChildren = children => {
  // sort available children first, then only take the first 100
  let sortedChildren = children
    .sort((a, b) => {
      if (a.committed !== b.committed) {
        if (!a.committed) {
          return -1;
        }
        return 1;
      }
      return 0;
    })
    .slice(0, 100);

  // shuffle ornaments
  return sortedChildren
    .map(child => ({ sort: Math.random(), value: child }))
    .sort((a, b) => a.sort - b.sort)
    .map(item => item.value);
};

export const getTimeFromNow = time => dayjs(time).fromNow();
