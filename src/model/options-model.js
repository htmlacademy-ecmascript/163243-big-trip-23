import { mockDestinations } from '../mock/destinations.js';
import { mockOffers } from '../mock/offers.js';
import Observable from '../framework/observable.js';


export default class OptionsModel extends Observable {
  #destinations = mockDestinations;
  #offers = mockOffers;

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
