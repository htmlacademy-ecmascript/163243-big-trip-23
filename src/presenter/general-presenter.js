import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EditPointFormView from '../view/edit-point-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import { render, replace } from '../framework/render.js';

// const WAYPOINTS_COUNT = 3;

export default class GeneralPresenter {
  #eventListComponent = new EventsListView;
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

  #renderWaypoint(point, destinations, offers) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToWaypoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const formComponent = new EditPointFormView({
      point,
      destinations,
      offers,
      onCollapseClick: () => {
        replaceFormToWaypoint();
        document.addEventListener('keydown', escKeyDownHandler);
      },
      onSubmitForm: () => {
        replaceFormToWaypoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    const waypointComponent = new WaypointView({
      point,
      destinations,
      offers,
      onExpandClick: () => {
        replaceWaypontToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });

    function replaceWaypontToForm() {
      replace(formComponent, waypointComponent);
    }

    function replaceFormToWaypoint() {
      replace(waypointComponent, formComponent);
    }

    render(waypointComponent, this.#eventListComponent.element);
  }

  #renderTripEvents() {
    render(this.#eventListComponent, this.#tripEvents);
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
