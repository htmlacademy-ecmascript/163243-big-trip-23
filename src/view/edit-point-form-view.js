import { TripTypes } from '../const.js';
import { humanizeDate, convertToKebabCase } from '../utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const DATE_FORMAT = 'DD/MM/YY h:mm';

const getCurrentDestination = (destinations, point) => destinations.find((destination) => destination.id === point.destination);
const getOffersByType = (offers, point) => offers.find((offer) => offer.type === point.type);

const createOfferItemTemplate = (offer, checkedOffers) =>
  `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${convertToKebabCase(offer.title)}-1" type="checkbox" name="event-offer-${convertToKebabCase(offer.title)}" ${checkedOffers.includes(offer.id) ? 'checked' : ''}>
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

const createEditPointItemTemplate = (point, currentDestination, offersByType, allDestinations, checkedOffers) =>
  `
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
          ${allDestinations.map((destination) => cretateOptionsTemplate(destination, currentDestination)).join('')}
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
      ${ point.hasOffers ? `
      <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${offersByType.map((offer) => createOfferItemTemplate(offer, checkedOffers)).join('')}
    </section>
    `
    : ''}
    ${ point.hasDestination ? `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${currentDestination.description}</p>
    </section>
  </section>
  ` : ''}
  </form>
  </li>
  `;


export default class EditPointFormView extends AbstractStatefulView {
  #waypoint = null;
  #allOffers = null;
  #checkedOffers = null;
  #handleCollapseClick = null;
  #handleFormSubmit = null;
  #allDestinations = null;
  #currentDestination = null;
  #offersByType = null;

  constructor({point, destinations, offers, onCollapseClick, onSubmitForm}) {
    super();
    this.#waypoint = point;
    this.#currentDestination = getCurrentDestination(destinations, this.#waypoint);
    this.#allOffers = offers;
    this.#checkedOffers = point.offers;
    this.#offersByType = getOffersByType(offers, point) ? getOffersByType(offers, point).offers : '';
    this.#handleCollapseClick = onCollapseClick;
    this.#handleFormSubmit = onSubmitForm;
    this.#allDestinations = destinations;
    this._setState(EditPointFormView.parseWaypointToState(this.#waypoint, this.#offersByType, destinations));

    this._restoreHandlers();

  }

  get template() {
    return createEditPointItemTemplate(this._state, this.#currentDestination, this.#offersByType, this.#allDestinations, this.#checkedOffers);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#collapseClickHandler);

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
  }

  #collapseClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCollapseClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointFormView.parseStateToWaypoint(this._state));
  };

  static parseWaypointToState(waypoint, offersByType, destinations) {
    const destinationDescription = getCurrentDestination(destinations, waypoint).description;
    return {...waypoint,
      hasOffers: offersByType.length,
      hasDestination: destinationDescription,
    };
  }

  static parseStateToWaypoint(state) {
    const waypoint = {...state};

    delete waypoint.hasOffers;
    delete waypoint.hasDestination;
    return waypoint;
  }
}
