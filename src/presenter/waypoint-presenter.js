import EditPointFormView from '../view/edit-point-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import { render, replace } from '../framework/render.js';

export default class WaypointPresenter {
  #waypointListContainer = null;
  #waypointComponent = null;
  #waypointEditFormComponent = null;
  #waypoint = null;
  #destinations = null;
  #offers = null;

  constructor({waypointListContainer}) {
    this.#waypointListContainer = waypointListContainer;
  }

  init(waypoint, destinations, offers) {
    this.#waypoint = waypoint;
    this.#destinations = destinations;
    this.#offers = offers;


    this.#waypointComponent = new WaypointView({
      point: this.#waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onExpandClick: this.#handleExpandClick,
    });

    this.#waypointEditFormComponent = new EditPointFormView({
      point: this.#waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onCollapseClick: this.#handleCollapseClick,
      onSubmitForm: this.#handleSubmitForm,
    });
    render(this.#waypointComponent, this.#waypointListContainer);
  }

  #replaceWaypontToForm() {
    replace(this.#waypointEditFormComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToWaypoint() {
    replace(this.#waypointComponent, this.#waypointEditFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToWaypoint();
    }
  };

  #handleExpandClick = () => this.#replaceWaypontToForm();
  #handleCollapseClick = () => this.#replaceFormToWaypoint();
  #handleSubmitForm = () => this.#replaceFormToWaypoint();
}
