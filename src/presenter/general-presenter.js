import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import { render, remove } from '../framework/render.js';
import WaypointPresenter from './waypoint-presenter.js';
import { Sorting } from '../utils.js';
import { SortTypes, UpdateType, UserAction } from '../const.js';

export default class GeneralPresenter {
  #eventsListComponent = new EventsListView;
  #sortComponent = null;
  #tripInfoComponent = new TripInfoView();
  #filterComponent = new FilterView();
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
    render(this.#tripInfoComponent, this.#tripMain, 'afterbegin');
  }

  #renderFilters() {
    render(this.#filterComponent, this.#tripFilters);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType.split('-')[1];
    this.#clearTripBoard();
    this.#renderTripBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
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
        this.#waypointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTripBoard();
        this.#renderTripBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearTripBoard({resetSortType: true});
        this.#renderTripBoard();
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


  #clearTripBoard({resetSortType = false} = {}) {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();

    remove(this.#eventsListComponent);

    remove(this.#sortComponent);
    remove(this.#tripInfoComponent);
    remove(this.#filterComponent);
    // remove(this.#noWaypointsComponent);

    if (resetSortType) {
      this.#currentSortType = SortTypes.DAY;
    }
  }

  #renderTripBoard() {
    const waypoints = this.waypoints;
    const waypointsCount = waypoints.length;

    if (waypointsCount === 0) {
      // this.#renderNoWaypoints();
      return;
    }

    this.#renderTripInfo();
    this.#renderFilters();
    this.#renderSort();

    this.#renderTripEvents();
    waypoints.forEach((point) => this.#renderWaypoint(point, this.#pointModel.destinations, this.#pointModel.offers));
  }


  init() {
    this.#renderTripBoard();
  }
}
