import { createElement } from '../render.js';

const FILTER_TYPES = ['everything', 'future', 'present', 'past'];

function createFilterViewItemTemplate(type) {
  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}">
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>
  `;
}

function createFilterViewTemplate() {
  return `
    <form class="trip-filters" action="#" method="get">
      ${FILTER_TYPES.map((type) => createFilterViewItemTemplate(type)).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FiltersView {
  getTemplate() {
    return createFilterViewTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
