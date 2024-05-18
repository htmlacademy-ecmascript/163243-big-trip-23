import { TRIP_TYPES } from '../const,sj';
import { getRandomArrayElement } from '../utils.js';

const mockPoints =
[
  {
    'id': 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    'base_price': 1100,
    'date_from': '2019-07-10T22:55:56.845Z',
    'date_to': '2019-07-11T11:22:13.375Z',
    'destination': 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    'is_favorite': false,
    'offers': [
      'b4c3e4e6-9053-42ce-b747-e281314baa31'
    ],
    'type': getRandomArrayElement(TRIP_TYPES)
  },
  {
    'id': 'f4b62099-293f-4c3d-a702-94eec4a2808d',
    'base_price': 110,
    'date_from': '2019-08-10T22:55:56.845Z',
    'date_to': '2019-08-11T11:22:13.375Z',
    'destination': 'cfe416cq-10xa-ye10-8077-2fs9a01edcac',
    'is_favorite': true,
    'offers': [
      'b4c3e4e6-9053-42ce-b747-e281314baa31'
    ],
    'type': getRandomArrayElement(TRIP_TYPES)
  },
  {
    'id': 'f4b62099-293f-4c3d-a702-94eec4a2808e',
    'base_price': 2200,
    'date_from': '2019-07-18T22:55:56.845Z',
    'date_to': '2019-07-21T11:22:13.375Z',
    'destination': 'cfe416cq-10xa-ye10-8077-2fs9a01edcad',
    'is_favorite': false,
    'offers': [
      'b4c3e4e6-9053-42ce-b747-e281314baa31'
    ],
    'type': getRandomArrayElement(TRIP_TYPES)
  }
];

export { mockPoints };
