import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import EventsListView from '../view/events-list-view.js';
import EditPointFormView from '../view/edit-point-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import { render } from '../render.js';

// const WAYPOINTS_COUNT = 3;

export default class GeneralPresenter {
  eventListComponent = new EventsListView;

  constructor(pointModel) {
    this.tripMain = document.querySelector('.trip-main');
    this.tripFilters = document.querySelector('.trip-controls__filters');
    this.tripEvents = document.querySelector('.trip-events');
    this.pointModel = pointModel;
  }

  renderTripInfo() {
    render(new TripInfoView(), this.tripMain, 'afterbegin');
  }

  renderFilters() {
    render(new FilterView(), this.tripFilters);
  }

  renderSorting() {
    render(new SortView(), this.tripEvents);
  }

  renderEditForm(destinations, offers) {
    render(new EditPointFormView(destinations, offers), this.eventListComponent.getElement());
  }

  renderWaypoint(point, distinations, offers) {
    render(new WaypointView(point, distinations, offers), this.eventListComponent.getElement());
  }

  renderTripEvents(destinations, offers) {
    render(this.eventListComponent, this.tripEvents);
    this.renderEditForm(destinations, offers);
  }

  init() {
    const points = this.pointModel.getPoints();
    const destinations = this.pointModel.getDestinations();
    const offers = this.pointModel.getOffers();
    this.renderTripInfo();
    this.renderFilters();
    this.renderSorting();
    this.renderTripEvents(destinations, offers);
    points.forEach((point) => this.renderWaypoint(point, destinations, offers));
  }
}
