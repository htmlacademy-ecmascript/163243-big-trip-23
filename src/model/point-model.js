import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';


export default class PointModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];
  #waypointsApiService = null;

  constructor({waypointsApiService, optionsModel}) {
    super();
    this.#waypointsApiService = waypointsApiService;
    this.#waypointsApiService.waypoints.then((waypoints) => {
      waypoints.map(this.#adaptToClient);
    });
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  async init(optionsModel) {
    try {
      const points = await this.#waypointsApiService.waypoints;
      this.#offers = await optionsModel.offers;
      this.#destinations = await optionsModel.destinations;
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];

    }
    this._notify(UpdateType.INIT);
  }

  async updateWaypoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    try {
      const response = await this.#waypointsApiService.updateWaypoint(update);
      const updatedWaypoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedWaypoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedWaypoint);
    } catch(err) {
      throw new Error('Can\'t update waypoint');
    }
  }

  async addWaypoint(updateType, update) {
    try {
      const response = await this.#waypointsApiService.addWaypoint(update);
      const newWaypoint = this.#adaptToClient(response);
      this.#points = [newWaypoint, ...this.#points];
      this._notify(updateType, newWaypoint);
    } catch(err) {
      throw new Error('Can\'t add waypoint');
    }
  }

  async deleteWaypoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
    }

    try {
      await this.#waypointsApiService.deleteWaypoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete waypoint');
    }
  }

  #adaptToClient(waypoint) {
    const adaptedWaypoint = {...waypoint,
      basePrice: waypoint['base_price'],
      dateFrom: waypoint['date_from'],
      dateTo: waypoint['date_to'],
      isFavorite: waypoint['is_favorite'],
    };

    delete adaptedWaypoint['base_price'];
    delete adaptedWaypoint['date_from'];
    delete adaptedWaypoint['date_to'];
    delete adaptedWaypoint['is_favorite'];

    return adaptedWaypoint;
  }
}
