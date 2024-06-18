import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getUniqueArrayElements = (items) => Array.from(new Set(items));

const getArrayFromObjectColumn = (initObject, column) => initObject ? initObject.map((elem) => elem[column]) : '';

const getRandomNumber = (maxValue = 1) => Math.floor(Math.random() * maxValue);

const humanizeDate = (date, format) => date ? dayjs(date).format(format) : '';

const convertToKebabCase = (initString) =>
  initString ?
    initString.charAt(0).toLowerCase() + initString.slice(1)
      .replace(/\W+/g, ' ')
      .replace(/([a-z])([A-Z])([a-z])/g, '$1 $2$3')
      .split(/\B(?=[A-Z]{2,})/)
      .join(' ')
      .split(' ')
      .join('-')
      .toLowerCase()
    : '';


const Sorting = {
  DAY: (waypointA, waypointB) => dayjs(waypointA.dateFrom).diff(dayjs(waypointB.dateFrom)),
  TIME: (waypointA, waypointB) => {
    const durationA = dayjs(waypointA.dateTo).diff(dayjs(waypointA.dateFrom));
    const durationB = dayjs(waypointB.dateTo).diff(dayjs(waypointB.dateFrom));
    return durationB - durationA;
  },
  PRICE: (waypointA, waypointB) => waypointB.basePrice - waypointA.basePrice,
};

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

const isTripInFuture = (dateFrom) => dayjs(dateFrom).isAfter(dayjs(), 'D');

const isTripInPresent = (dateFrom, dateTo) => dayjs(dateFrom).isBefore(dayjs(), 'M') && dayjs(dateTo).isAfter(dayjs(), 'D');

const isTripInPast = (dateTo) => dayjs(dateTo).isBefore(dayjs(), 'D');

export {
  getRandomArrayElement,
  getRandomNumber,
  humanizeDate,
  convertToKebabCase,
  Sorting,
  getUniqueArrayElements,
  getArrayFromObjectColumn,
  isDatesEqual,
  isTripInFuture,
  isTripInPresent,
  isTripInPast
};
