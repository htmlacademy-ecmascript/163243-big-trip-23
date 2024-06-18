import {remove, render, RenderPosition} from '../framework/render.js';
import EditPointFormView from '../view/edit-point-form-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType, BLANK_WAYPOINT} from '../const.js';

export default class NewWaypointPresenter {
  #waypointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #waypoint = BLANK_WAYPOINT;
  #destinations = null;
  #offers = null;

  #waypointEditComponent = null;

  constructor({waypointListContainer, onDataChange, onDestroy}) {
    this.#waypointListContainer = waypointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(destinations, offers) {
    if (this.#waypointEditComponent !== null) {
      return;
    }
    this.#destinations = destinations;
    this.#offers = offers;


    this.#waypointEditComponent = new EditPointFormView({
      point: this.#waypoint,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onCollapseClick: this.#handleCollapseClick,
      isNewPoint: true,
    });

    render(this.#waypointEditComponent, this.#waypointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#waypointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#waypointEditComponent);
    this.#waypointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (waypoint) => {
    this.#handleDataChange(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      // Пока у нас нет сервера, который бы после сохранения
      // выдывал честный id задачи, нам нужно позаботиться об этом самим
      {id: nanoid(), ...waypoint},
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleCollapseClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
