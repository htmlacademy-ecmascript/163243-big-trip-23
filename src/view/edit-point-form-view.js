import { TripTypes } from '../const.js';
import { humanizeDate, convertToKebabCase } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';

const DATE_FORMAT = 'DD/MM/YY h:mm';

const createOfferItemTemplate = (offer) =>
  `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${convertToKebabCase(offer.title)}-1" type="checkbox" name="event-offer-${convertToKebabCase(offer.title)}" checked>
      <label class="event__offer-label" for="event-offer-${convertToKebabCase(offer.title)}-1">
        <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
  </div>
  `;

const createEventTypeItemTemplate = (type) =>
  `
  <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>
  `;

const cretateOptionsTemplate = (destination, currentDestination) =>
  `
  <option ${destination.name === currentDestination.name ? 'selected' : ''} value="${destination.name}">${destination.name}</option>
  `;

const createEditPointItemTemplate = (point, destinations, offers) => {
  const currentDestination = destinations.find((destination) => destination.id === point.destination);
  const offersByType = offers.find((offer) => offer.type === point.type);
  let currentOffers = [];
  if (offersByType) {
    currentOffers = offersByType.offers.filter((offer) => point.offers.includes(offer.id));
  }
  return `
  <li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${TripTypes.map((type) => createEventTypeItemTemplate(type)).join('')}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${point.type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" list="destination-list-1" value="${currentDestination.name}">
        <datalist id="destination-list-1">
          ${destinations.map((destination) => cretateOptionsTemplate(destination, currentDestination)).join('')}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(point.dateFrom, DATE_FORMAT)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(point.dateTo, DATE_FORMAT)}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${currentOffers.map((offer) => createOfferItemTemplate(offer)).join('')}
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${currentDestination.description}</p>
      </section>
    </section>
  </form>
  </li>
  `;
};

export default class EditPointFormView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleCollapseClick = null;
  #handleFormSubmit = null;

  constructor({point, destinations, offers, onCollapseClick, onSubmitForm}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleCollapseClick = onCollapseClick;
    this.#handleFormSubmit = onSubmitForm;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#collapseClickHandler);

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

  }

  get template() {
    return createEditPointItemTemplate(this.#point, this.#destinations, this.#offers);
  }

  #collapseClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCollapseClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#point);
  };
}
