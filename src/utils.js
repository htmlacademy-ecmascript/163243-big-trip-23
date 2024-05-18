const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const getRandomNumber = (maxValue = 1) => Math.floor(Math.random() * maxValue);

export { getRandomArrayElement, getRandomNumber };
