import { mockPoints } from '../mock/points.js';
import { mockDestinations } from '../mock/destinations.js';
import { mockOffers } from '../mock/offers.js';

export default class PointModel {
  #points;
  #destinations;
  #offers;

  constructor() {
    this.#points = [];
    this.#destinations = [];
  }

  get points() {
    this.#points = mockPoints;
    return this.#points;
  }

  get destinations() {
    this.#destinations = mockDestinations;
    return this.#destinations;
  }

  get offers() {
    this.#offers = mockOffers;
    return this.#offers;
  }
}
