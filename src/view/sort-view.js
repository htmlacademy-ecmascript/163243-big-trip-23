import AbstractView from '../framework/view/abstract-view.js';

const SortColumns = ['day', 'event', 'time', 'price', 'offer'];
const ActiveSort = ['day', 'time', 'price'];

const createSortViewItemTemplate = (column) =>
  `
    <div class="trip-sort__item  trip-sort__item--${column}">
      <input id="sort-${column}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${column}"
      ${ActiveSort.includes(column) ? '' : 'disabled'}
      ${column === 'day' ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-${column}">${column}</label>
    </div>
  `;

const createSortViewTemplate = () =>
  `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${SortColumns.map((column) => createSortViewItemTemplate(column)).join('')}
    </form>
  `;

export default class SortView extends AbstractView{
  #handleSortTypeChange = null;

  constructor({onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortViewTemplate();
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    // evt.preventDefault();
    this.#handleSortTypeChange(evt.target.value);
  };
}
