import { TRIP_TYPES } from '../const.js';
import { getRandomArrayElement } from '../utils.js';

const mockPoints =
[
  {
    'id': 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    'basePrice': 1100,
    'dateFrom': '2019-07-10T22:55:56.845Z',
    'dateTo': '2019-08-11T11:45:13.375Z',
    'destination': 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    'isFavorite': false,
    'offers': [
      'b4c3e4e6-9053-42ce-b747-e281314baa31',
      'b4c3e4e6-9053-42ce-b747-e281314baa32',
      'b4c3e4e6-9053-42ce-b747-e281314baa33'
    ],
    'type': getRandomArrayElement(TRIP_TYPES)
  },
  {
    'id': 'f4b62099-293f-4c3d-a702-94eec4a2808d',
    'basePrice': 110,
    'dateFrom': '2019-08-10T22:55:56.845Z',
    'dateTo': '2019-08-11T11:38:13.375Z',
    'destination': 'cfe416cq-10xa-ye10-8077-2fs9a01edcac',
    'isFavorite': true,
    'offers': [
      'b4c3e4e6-9053-42ce-b747-e281314baa31'
    ],
    'type': getRandomArrayElement(TRIP_TYPES)
  },
  {
    'id': 'f4b62099-293f-4c3d-a702-94eec4a2808e',
    'basePrice': 2200,
    'dateFrom': '2019-07-18T22:55:56.845Z',
    'dateTo': '2019-07-21T11:22:13.375Z',
    'destination': 'cfe416cq-10xa-ye10-8077-2fs9a01edcad',
    'isFavorite': false,
    'offers': [
      'b4c3e4e6-9053-42ce-b747-e281314baa42'
    ],
    'type': getRandomArrayElement(TRIP_TYPES)
  }
];

const getRandomPoint = () => getRandomArrayElement(mockPoints);

export { getRandomPoint, mockPoints };
