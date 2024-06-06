import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getUniqueArrayElements = (items) => Array.from(new Set(items));

const getArrayFromObjectColumn = (initObject, column) => initObject ? initObject.map((elem) => elem[column]) : '';

const getRandomNumber = (maxValue = 1) => Math.floor(Math.random() * maxValue);

const humanizeDate = (date, format) => date ? dayjs(date).format(format) : '';

const convertToKebabCase = (initString) =>
  initString ?
    initString.charAt(0).toLowerCase() + initString.slice(1) // Lowercase the first character
      .replace(/\W+/g, ' ') // Remove all excess white space and replace & , . etc.
      .replace(/([a-z])([A-Z])([a-z])/g, '$1 $2$3') // Put a space at the position of a camelCase -> camel Case
      .split(/\B(?=[A-Z]{2,})/) // Now split the multi-uppercases customerID -> customer,ID
      .join(' ') // And join back with spaces.
      .split(' ') // Split all the spaces again, this time we're fully converted
      .join('-') // And finally kebab-case things up
      .toLowerCase() // With a nice lower case
    : '';


const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

const Sorting = {
  DAY: (waypointA, waypointB) => dayjs(waypointA.dateFrom).diff(dayjs(waypointB.dateFrom)),
  TIME: (waypointA, waypointB) => {
    const durationA = dayjs(waypointA.dateTo).diff(dayjs(waypointA.dateFrom));
    const durationB = dayjs(waypointB.dateTo).diff(dayjs(waypointB.dateFrom));
    return durationB - durationA;
  },
  PRICE: (waypointA, waypointB) => waypointB.basePrice - waypointA.basePrice,
};

export {
  getRandomArrayElement,
  getRandomNumber,
  humanizeDate,
  convertToKebabCase,
  updateItem,
  Sorting,
  getUniqueArrayElements,
  getArrayFromObjectColumn
};
