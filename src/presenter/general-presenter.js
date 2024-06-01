import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import { render } from '../framework/render.js';
import WaypointPresenter from './waypoint-presenter.js';

// const WAYPOINTS_COUNT = 3;

export default class GeneralPresenter {
  #eventsListComponent = new EventsListView;
  #tripMain;
  #tripFilters;
  #tripEvents;
  #pointModel;


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

  #renderWaypoint(point, destinations, offers) {
    const wayPointPresenter = new WaypointPresenter({
      waypointListContainer: this.#eventsListComponent.element
    });
    wayPointPresenter.init(point, destinations, offers);
  }

  init() {
    const points = this.#pointModel.points;
    const destinations = this.#pointModel.destinations;
    const offers = this.#pointModel.offers;
    this.#renderTripInfo();
    this.#renderFilters();
    this.#renderSorting();
    this.#renderTripEvents(destinations, offers);
    points.forEach((point) => {
      this.#renderWaypoint(point, destinations, offers);
      // this.#renderEditForm(point, destinations, offers);
    });
  }
}
