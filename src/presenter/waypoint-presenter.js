import EditPointFormView from '../view/edit-point-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import { render, replace, remove } from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class WaypointPresenter {
  #waypointListContainer = null;
  #waypointComponent = null;
  #waypointEditFormComponent = null;
  #waypoint = null;
  #destinations = null;
  #offers = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({waypointListContainer, onDataChange, onModeChange}) {
    this.#waypointListContainer = waypointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#waypointEditFormComponent, prevEditFormComponent);
    }

    remove(prevWaypointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this.#waypointComponent);
    remove(this.#waypointEditFormComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#waypointEditFormComponent.reset(this.#waypoint);
      this.#replaceFormToWaypoint();
    }
  }

  #replaceWaypontToForm() {
    replace(this.#waypointEditFormComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToWaypoint() {
    replace(this.#waypointComponent, this.#waypointEditFormComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
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
