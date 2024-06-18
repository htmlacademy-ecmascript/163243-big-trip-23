import AbstractView from '../framework/view/abstract-view.js';
import {FilterTypes} from '../const.js';

const NoPointsTextType = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.FUTURE]: 'There are no points in future',
  [FilterTypes.PRESENT]: 'There are no points in present',
  [FilterTypes.PAST]: 'There are no points in past',
};

function createNoPointsTemplate(filterType) {
  const noTaskTextValue = NoPointsTextType[filterType];
  return (
    `<p class="trip-events__msg">
      ${noTaskTextValue}
    </p>`
  );
}

export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }
}
