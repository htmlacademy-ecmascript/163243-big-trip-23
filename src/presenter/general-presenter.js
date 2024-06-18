import TripInfoView from '../view/trip-info-view.js';
// import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import NoPointView from '../view/no-point-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import WaypointPresenter from './waypoint-presenter.js';
import NewWaypointPresenter from './new-waypoint-presenter.js';
import { Sorting } from '../utils/utils.js';
import { filter } from '../utils/filter.js';
import { SortTypes, UpdateType, UserAction, FilterTypes } from '../const.js';

export default class GeneralPresenter {
  #eventsListComponent = new EventsListView;
  #sortComponent = null;
  #tripInfoComponent = new TripInfoView();
  // #filterComponent = new FilterView();
  #noPointComponent = null;
  #tripMain;
  #tripFilters;
  #tripEvents;
  #pointModel = null;
  #filterModel = null;
  #filterType = FilterTypes.EVERYTHING;
  #waypointPresenters = new Map();
  #newWaypointPresenter = null;
  #currentSortType = SortTypes.DAY;

  constructor({pointModel, filterModel, onNewWaypointDestroy}) {
    this.#tripMain = document.querySelector('.trip-main');
    this.#tripFilters = document.querySelector('.trip-controls__filters');
    this.#tripEvents = document.querySelector('.trip-events');
    this.#pointModel = pointModel;
    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleModelEvent);


    this.#newWaypointPresenter = new NewWaypointPresenter({
      waypointListContainer: this.#tripEvents,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewWaypointDestroy
    });
  }

  get waypoints() {
    this.#filterType = this.#filterModel.filter;
    const waypoints = this.#pointModel.points;
    const filteredWaypoints = filter[this.#filterType](waypoints);

    switch (this.#currentSortType) {
      case SortTypes.DAY:
        return filteredWaypoints.sort(Sorting.DAY);
      case SortTypes.TIME:
        return filteredWaypoints.sort(Sorting.TIME);
      case SortTypes.PRICE:
        return filteredWaypoints.sort(Sorting.PRICE);
    }
    return filteredWaypoints;
  }

  #renderTripInfo() {
    render(this.#tripInfoComponent, this.#tripMain, RenderPosition.AFTERBEGIN);
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

    render(this.#sortComponent, this.#tripEvents, RenderPosition.AFTERBEGIN);
  }

  #renderTripEvents() {
    render(this.#eventsListComponent, this.#tripEvents, RenderPosition.BEFOREEND);
  }

  #handleModeChange = () => {
    this.#newWaypointPresenter.destroy();
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
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
    switch (updateType) {
      case UpdateType.PATCH:
        this.#waypointPresenters.get(data.id).init(data, this.#pointModel.destinations, this.#pointModel.offers);
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

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });
    render(this.#noPointComponent, this.#tripEvents);
  }


  #clearTripBoard({resetSortType = false} = {}) {
    this.#newWaypointPresenter.destroy();
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();

    remove(this.#eventsListComponent);

    remove(this.#sortComponent);
    remove(this.#tripInfoComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortTypes.DAY;
    }
  }

  #renderTripBoard() {
    const waypoints = this.waypoints;
    const waypointsCount = waypoints.length;

    if (waypointsCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderTripInfo();
    this.#renderSort();

    this.#renderTripEvents();
    waypoints.forEach((point) => this.#renderWaypoint(point, this.#pointModel.destinations, this.#pointModel.offers));
  }


  init() {
    this.#renderTripBoard();
  }

  createWaypoint() {
    this.#currentSortType = SortTypes.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#newWaypointPresenter.init(this.#pointModel.destinations, this.#pointModel.offers);
  }
}
