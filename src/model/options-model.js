import Observable from '../framework/observable.js';


export default class OptionsModel extends Observable {
  #destinations = [];
  #offers = [];
  #optionsApiService = null;

  constructor({optionsApiService}) {
    super();
    this.#optionsApiService = optionsApiService;

    this.#offers = this.#optionsApiService.offers;
    this.#destinations = this.#optionsApiService.destinations;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
