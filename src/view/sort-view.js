import AbstractView from '../framework/view/abstract-view.js';

const SortColumns = ['day', 'event', 'time', 'price', 'offer'];

const createSortViewItemTemplate = (column) =>
  `
    <div class="trip-sort__item  trip-sort__item--${column}">
      <input id="sort-${column}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${column}">
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
  get template() {
    return createSortViewTemplate();
  }
}
