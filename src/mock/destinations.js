import { getRandomText } from './utils';
import { getRandomArrayElement } from '../utils/utils';

const CITIES = ['Punta Cana', 'Lissabon', 'Amsterdam', 'New York', 'Taganrog', 'Vatikan'];

const MOCK_DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
];

const DESCTINATION_DESCRIPTION_SENTENCES = 5;
const PICTURE_DESCRIPTION_SENTENCES = 1;

const mockDestinations =
[
  {
    'id': 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    'description': getRandomText(MOCK_DESCRIPTION, DESCTINATION_DESCRIPTION_SENTENCES),
    'name': getRandomArrayElement(CITIES),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${Math.random()}`,
        'description': getRandomText(MOCK_DESCRIPTION, PICTURE_DESCRIPTION_SENTENCES),
      }
    ]
  },
  {
    'id': 'cfe416cq-10xa-ye10-8077-2fs9a01edcac',
    'description': getRandomText(MOCK_DESCRIPTION, DESCTINATION_DESCRIPTION_SENTENCES),
    'name': getRandomArrayElement(CITIES),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${Math.random()}`,
        'description': getRandomText(MOCK_DESCRIPTION, PICTURE_DESCRIPTION_SENTENCES),
      }
    ]
  },
  {
    'id': 'cfe416cq-10xa-ye10-8077-2fs9a01edcad',
    'description': getRandomText(MOCK_DESCRIPTION, DESCTINATION_DESCRIPTION_SENTENCES),
    'name': getRandomArrayElement(CITIES),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${Math.random()}`,
        'description': getRandomText(MOCK_DESCRIPTION, PICTURE_DESCRIPTION_SENTENCES),
      }
    ]
  }
];


export { mockDestinations };

