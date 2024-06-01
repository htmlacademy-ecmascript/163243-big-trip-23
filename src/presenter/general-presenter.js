import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import { render } from '../framework/render.js';
import WaypointPresenter from './waypoint-presenter.js';
import { updateItem } from '../utils.js';

// const WAYPOINTS_COUNT = 3;

export default class GeneralPresenter {
  #eventsListComponent = new EventsListView;
  #tripMain;
  #tripFilters;
  #tripEvents;
  #pointModel;
  #tripWaypoints = [];
  #waypointPresenters = new Map();


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

  #renderSorting() {
    render(new SortView(), this.#tripEvents);
  }

  #renderTripEvents() {
    render(this.#eventsListComponent, this.#tripEvents);
  }

  #handleModeChange = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleTaskChange = (updatedWaypoint, destinations, offers) => {
    this.#tripWaypoints = updateItem(this.#tripWaypoints, updatedWaypoint);
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


  init() {
    const destinations = this.#pointModel.destinations;
    const offers = this.#pointModel.offers;
    this.#tripWaypoints = [...this.#pointModel.points];
    this.#renderTripInfo();
    this.#renderFilters();
    this.#renderSorting();
    this.#renderTripEvents(destinations, offers);
    this.#tripWaypoints.forEach((point) => {
      this.#renderWaypoint(point, destinations, offers);
      // this.#renderEditForm(point, destinations, offers);
    });
  }
}
