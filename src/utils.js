import dayjs from 'dayjs';

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomNumber = (maxValue = 1) => Math.floor(Math.random() * maxValue);

const humanizeDate = (date, format) => date ? dayjs(date).format(format) : '';

export { getRandomArrayElement, getRandomNumber, humanizeDate };
