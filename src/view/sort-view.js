import AbstractView from '../framework/view/abstract-view.js';


const SortColumns = ['day', 'event', 'time', 'price', 'offer'];
const ActiveSortTypes = ['day', 'time', 'price'];

const createSortViewItemTemplate = (column, currentSortType) =>
  `
    <div class="trip-sort__item  trip-sort__item--${column}">
      <input id="sort-${column}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${column}"
      ${ActiveSortTypes.includes(column) ? '' : 'disabled'}
      ${column === currentSortType ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${column}">${column}</label>
    </div>
  `;

const createSortViewTemplate = (currentSortType) =>
  `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${SortColumns.map((column) => createSortViewItemTemplate(column, currentSortType)).join('')}
    </form>
  `;

export default class SortView extends AbstractView{
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({currentSortType, onSortTypeChange}) {
    super();
    this.#currentSortType = currentSortType;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortViewTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    this.#handleSortTypeChange(evt.target.value);
  };
}
