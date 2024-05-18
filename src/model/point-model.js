import { mockPoints } from '../mock/points.js';
import { mockDestinations } from '../mock/destinations.js';
import { mockOffers } from '../mock/offers.js';

export default class PointModel {
  constructor() {
    this.points = [];
    this.distinations = [];
  }

  getPoints() {
    this.points = mockPoints;
    return this.points;
  }

  getDestinations() {
    this.destinations = mockDestinations;
    return this.destinations;
  }

  getOffers() {
    this.offers = mockOffers;
    return this.offers;
  }
}
