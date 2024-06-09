import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import { render } from '../framework/render.js';
import WaypointPresenter from './waypoint-presenter.js';
import { Sorting } from '../utils.js';
import { SortTypes, UpdateType, UserAction } from '../const.js';

export default class GeneralPresenter {
  #eventsListComponent = new EventsListView;
  #sortComponent = null;
  #tripMain;
  #tripFilters;
  #tripEvents;
  #pointModel;
  #waypointPresenters = new Map();
  #currentSortType = SortTypes.DAY;

  constructor(pointModel) {
    this.#tripMain = document.querySelector('.trip-main');
    this.#tripFilters = document.querySelector('.trip-controls__filters');
    this.#tripEvents = document.querySelector('.trip-events');
    this.#pointModel = pointModel;
    this.#pointModel.addObserver(this.#handleModelEvent);
  }

  get waypoints() {
    switch (this.#currentSortType) {
      case SortTypes.DAY:
        return [...this.#pointModel.points].sort(Sorting.DAY);
      case SortTypes.TIME:
        return [...this.#pointModel.points].sort(Sorting.TIME);
      case SortTypes.PRICE:
        return [...this.#pointModel.points].sort(Sorting.PRICE);
    }
    return this.#pointModel.points;
  }

  #renderTripInfo() {
    render(new TripInfoView(), this.#tripMain, 'afterbegin');
  }

  #renderFilters() {
    render(new FilterView(), this.#tripFilters);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType.split('-')[1];
    this.#clearWaypointsList();
    this.#renderWaypointsList();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#tripEvents);
  }

  #renderTripEvents() {
    render(this.#eventsListComponent, this.#tripEvents);
  }

  #handleModeChange = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log('actionType', actionType, 'updateType', updateType, 'update', update);
    switch (actionType) {
      case UserAction.UPDATE_WAYPOINT:
        this.#pointModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD_WAYPOINT:
        this.#pointModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#pointModel.deleteWaypoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#waypointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  };

  #renderWaypoint(point, destinations, offers) {
    const waypointPresenter = new WaypointPresenter({
      waypointListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    waypointPresenter.init(point, destinations, offers);
    this.#waypointPresenters.set(point.id, waypointPresenter);
  }

  #clearWaypointsList() {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();
  }

  #renderWaypointsList () {
    const waypoints = this.waypoints;
    waypoints.forEach((point) => this.#renderWaypoint(point, this.#pointModel.destinations, this.#pointModel.offers));
  }


  init() {
    this.#renderTripInfo();
    this.#renderFilters();
    this.#renderSort();
    this.#renderTripEvents();
    this.#renderWaypointsList();
  }
}
