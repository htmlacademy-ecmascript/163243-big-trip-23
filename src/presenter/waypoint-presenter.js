import EditPointFormView from '../view/edit-point-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import { render, replace, remove } from '../framework/render.js';

export default class WaypointPresenter {
  #waypointListContainer = null;
  #waypointComponent = null;
  #waypointEditFormComponent = null;
  #waypoint = null;
  #destinations = null;
  #offers = null;
  #handleDataChange = null;

  constructor({waypointListContainer, onDataChange}) {
    this.#waypointListContainer = waypointListContainer;
    this.#handleDataChange = onDataChange;
  }

  init(point, destinations, offers) {
    this.#waypoint = point;
    this.#destinations = destinations;
    this.#offers = offers;

    const prevWaypointComponent = this.#waypointComponent;
    const prevEditFormComponent = this.#waypointEditFormComponent;


    this.#waypointComponent = new WaypointView({
      point: this.#waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onExpandClick: this.#handleExpandClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#waypointEditFormComponent = new EditPointFormView({
      point: this.#waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onCollapseClick: this.#handleCollapseClick,
      onSubmitForm: this.#handleSubmitForm,
    });

    if (prevWaypointComponent === null || prevEditFormComponent === null) {
      render(this.#waypointComponent, this.#waypointListContainer);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.#waypointListContainer.contains(prevWaypointComponent.element)) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#waypointListContainer.contains(prevEditFormComponent.element)) {
      replace(this.#waypointEditFormComponent, prevEditFormComponent);
    }

    remove(prevWaypointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this.#waypointComponent);
    remove(this.#waypointEditFormComponent);
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
  #handleSubmitForm = (waypoint) => {
    this.#handleDataChange(waypoint, this.#destinations, this.#offers);
    this.#replaceFormToWaypoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#waypoint, isFavorite: !this.#waypoint.isFavorite}, this.#destinations, this.#offers);
  };

}
