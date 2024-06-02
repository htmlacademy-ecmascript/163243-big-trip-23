import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import { render } from '../framework/render.js';
import WaypointPresenter from './waypoint-presenter.js';
import { updateItem, Sorting } from '../utils.js';
import { SortTypes } from '../const.js';

// const WAYPOINTS_COUNT = 3;

export default class GeneralPresenter {
  #eventsListComponent = new EventsListView;
  #sortComponent = null;
  #tripMain;
  #tripFilters;
  #tripEvents;
  #pointModel;
  #tripWaypoints = [];
  #sourcedTripWaypoints = [];
  #waypointPresenters = new Map();
  #currentSortType = SortTypes.DAY;



  constructor(pointModel) {
    this.#tripMain = document.querySelector('.trip-main');
    this.#tripFilters = document.querySelector('.trip-controls__filters');
    this.#tripEvents = document.querySelector('.trip-events');
    this.#pointModel = pointModel;
  }


  #renderTripInfo() {
    render(new TripInfoView(), this.#tripMain, 'afterbegin');
  }

  #renderFilters() {
    render(new FilterView(), this.#tripFilters);
  }

  #handleSortTypeChange = (sortType) => {
    // - Сортируем задачи
    // - Очищаем список
    // - Рендерим список заново
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTasks(sortType);
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

  #handleTaskChange = (updatedWaypoint, destinations, offers) => {
    this.#tripWaypoints = updateItem(this.#tripWaypoints, updatedWaypoint);
    this.#sourcedTripWaypoints = updateItem(this.#sourcedTripWaypoints, updatedWaypoint);
    this.#waypointPresenters.get(updatedWaypoint.id).init(updatedWaypoint, destinations, offers);
  };

  #renderWaypoint(point, destinations, offers) {
    const wayPointPresenter = new WaypointPresenter({
      waypointListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleTaskChange,
      onModeChange: this.#handleModeChange
    });
    wayPointPresenter.init(point, destinations, offers);
    this.#waypointPresenters.set(point.id, wayPointPresenter);
  }

  #clearWaypointList() {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();
  }

  #sortTasks(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortTypes.TIME:
        this.#tripWaypoints.sort(Sorting.byTime);
        break;
      case SortTypes.PRICE:
        this.#tripWaypoints.sort(Sorting.byPrice);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this.#tripWaypoints.sort(Sorting.byDay);
    }

    this.#currentSortType = sortType;
  }


  init() {
    const destinations = this.#pointModel.destinations;
    const offers = this.#pointModel.offers;
    this.#tripWaypoints = [...this.#pointModel.points];
    this.#sourcedTripWaypoints = [...this.#pointModel.points];
    this.#renderTripInfo();
    this.#renderFilters();
    this.#renderSort();
    this.#renderTripEvents(destinations, offers);
    this.#tripWaypoints.forEach((point) => {
      this.#renderWaypoint(point, destinations, offers);
      // this.#renderEditForm(point, destinations, offers);
    });
  }
}
