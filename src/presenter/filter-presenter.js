import {render, replace, remove} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {filter} from '../utils/filter.js';
import {FilterTypes, UpdateType} from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #waypointsModel = null;
  #filterComponent = null;

  constructor({filterContainer, filterModel, waypointsModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#waypointsModel = waypointsModel;

    this.#waypointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const waypoints = this.#waypointsModel.points;

    return Object.values(FilterTypes).map((type) => ({
      type,
      count: filter[type](waypoints).length
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
