import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomNumber = (maxValue = 1) => Math.floor(Math.random() * maxValue);

const humanizeDate = (date, format) => date ? dayjs(date).format(format) : '';

const convertToKebabCase = (string) =>
  string.charAt(0).toLowerCase() + string.slice(1) // Lowercase the first character
    .replace(/\W+/g, ' ') // Remove all excess white space and replace & , . etc.
    .replace(/([a-z])([A-Z])([a-z])/g, '$1 $2$3') // Put a space at the position of a camelCase -> camel Case
    .split(/\B(?=[A-Z]{2,})/) // Now split the multi-uppercases customerID -> customer,ID
    .join(' ') // And join back with spaces.
    .split(' ') // Split all the spaces again, this time we're fully converted
    .join('-') // And finally kebab-case things up
    .toLowerCase(); // With a nice lower case

export { getRandomArrayElement, getRandomNumber, humanizeDate, convertToKebabCase };