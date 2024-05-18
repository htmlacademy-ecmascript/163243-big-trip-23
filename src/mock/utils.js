import { getRandomNumber, getRandomArrayElement } from '../utils';

/**
 * Функция для генерации рандомного комментария/описания
 * @param {array} textArray - массив с текстом из которого выбираем предложения.
 * @returns {string} - возвращает строку из 1 или 2 предложений
 */
const getRandomText = (textArray, sentencesCount) => Array.from({length: getRandomNumber(sentencesCount)}, () => getRandomArrayElement(textArray)).join(' ');

export { getRandomText };
