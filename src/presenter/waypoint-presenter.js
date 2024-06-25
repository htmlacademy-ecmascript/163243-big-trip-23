import EditPointFormView from '../view/edit-point-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import { render, replace, remove } from '../framework/render.js';
import {UserAction, UpdateType} from '../const.js';
import { isDatesEqual } from '../utils/utils.js';

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

  get tasks() {
    return this.#waypoint.points;
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
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevWaypointComponent === null || prevEditFormComponent === null) {
      render(this.#waypointComponent, this.#waypointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#waypointComponent, prevWaypointComponent);
      this.#mode = Mode.DEFAULT;
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

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#waypointEditFormComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#waypointEditFormComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#waypointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#waypointEditFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#waypointEditFormComponent.shake(resetFormState);
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
  #handleFormSubmit = (update) => {
    const isMinorUpdate =
      !isDatesEqual(this.#waypoint.dateTo, update.dateTo) ||
      !isDatesEqual(this.#waypoint.dateFrom, update.dateFrom) ||
      this.#waypoint.basePrice !== update.basePrice;

    this.#handleDataChange(
      UserAction.UPDATE_WAYPOINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
      this.#destinations,
      this.#offers
    );
    this.#replaceFormToWaypoint();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_WAYPOINT,
      UpdateType.MINOR,
      {...this.#waypoint, isFavorite: !this.#waypoint.isFavorite},
      this.#destinations,
      this.#offers,
    );
  };

  #handleDeleteClick = (waypoint) => {
    this.#handleDataChange(
      UserAction.DELETE_WAYPOINT,
      UpdateType.MINOR,
      waypoint,
    );

  };
}
