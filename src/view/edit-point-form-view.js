import { TripTypes } from '../const.js';
import { humanizeDate, convertToKebabCase } from '../utils/utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const DATE_FORMAT = 'DD/MM/YY h:mm';

const getCurrentDestination = (destinations, point) => point.destination ? destinations.find((destination) => destination.id === point.destination) : '';

const getDestinationIdByName = (destinations, destinationName) => {
  const requiredDestination = destinations.find((destination) => destination.name === destinationName);
  return requiredDestination ? requiredDestination.id : '';
};

const getOfferIdByName = (allOffers, chekedId) => {
  const normalizedOfferName = chekedId.split('-').slice(2).join(' ').slice(0, -2);
  const kebabOfferName = convertToKebabCase(normalizedOfferName);
  const offersWithId = allOffers.find((offerByType) => offerByType.offers.find((offer) => convertToKebabCase(offer.title) === kebabOfferName));
  const offerId = offersWithId.offers.find((offer) => convertToKebabCase(offer.title) === kebabOfferName).id;
  return offerId;
};


const getOffersByType = (offers, type) => {
  if(!offers) {
    return '';
  }
  const offersByType = offers.find((offer) => offer.type === type);
  return offersByType ? offersByType.offers : '';
};

const rollupButtonTemplate = () => `
<button class="event__rollup-btn" type="button">
  <span class="visually-hidden">Open event</span>
</button>`;

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

const createOptionsTemplate = (destination, currentDestination) =>
  `
  <option value="${destination}" ${destination === currentDestination.name ? 'selected' : ''}></option>
  `;

const createEditPointItemTemplate = ({point, destinations, offers, isNewPoint}) => {
  const currentDestination = getCurrentDestination(destinations, point);
  const checkedOffersIds = point.offers;
  const offersByType = getOffersByType(offers, point.type);
  const allDestinationsNames = [...new Set(destinations.map((destination) => destination.name))];

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
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" list="destination-list-1" value="${ currentDestination ? currentDestination.name : ''}" required>
        <datalist id="destination-list-1">
          ${allDestinationsNames.map((destination) => createOptionsTemplate(destination, currentDestination)).join('')}
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
        <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${point.basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">
      ${isNewPoint ? 'Cancel' : 'Delete'}
      </button>
      ${isNewPoint ? '' : rollupButtonTemplate()}
    </header>
    <section class="event__details">
      ${ point.hasOffers ? `
      <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersByType.map((offer) => createOfferItemTemplate(offer, checkedOffersIds)).join('')}
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
};


export default class EditPointFormView extends AbstractStatefulView {
  #waypoint = null;
  #allOffers = null;
  #allDestinations = null;

  #handleCollapseClick = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #isNewPoint = false;

  #dateFromPicker = null;
  #dateToPicker = null;


  constructor({point, destinations, offers, onCollapseClick, onFormSubmit, onDeleteClick, isNewPoint}) {
    super();
    this.#waypoint = point;
    this.#allDestinations = destinations;
    this.#allOffers = offers;
    this.#handleCollapseClick = onCollapseClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#isNewPoint = isNewPoint;


    this._setState(EditPointFormView.parseWaypointToState(
      this.#waypoint,
      this.#allDestinations,
      this.#allOffers,
    ));

    this._restoreHandlers();
  }

  get template() {
    return createEditPointItemTemplate({
      point: this._state,
      destinations: this.#allDestinations,
      offers: this.#allOffers,
      isNewPoint: this.#isNewPoint,
    });
  }

  reset = (waypoint) => {
    this.updateElement(
      EditPointFormView.parseWaypointToState({
        waypoint,
        destinations: this.#allDestinations,
        offers: this.#allOffers,
      }),
    );
  };

  _restoreHandlers() {

    if(!this.#isNewPoint) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#collapseClickHandler);
    }

    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#eventTypeClickHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationInputHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);

    this.#initDatePicker();
  }

  #initDatePicker = () => {
    const KEY = 'time_24hr';
    const commonParameter = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: { firstDayOfWeek: 1 },
      [KEY]: true,
    };
    this.#dateFromPicker = flatpickr(
      this.element.querySelector('input[name="event-start-time"]'),
      {
        ...commonParameter,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.dateTo,
      }
    );
    this.#dateToPicker = flatpickr(
      this.element.querySelector('input[name="event-end-time"]'),
      {
        ...commonParameter,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToCloseHandler,
        minDate: this._state.dateFrom,
      }
    );
  };

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({ dateFrom: userDate });
    this.#dateToPicker.set('minDate', this._state.dateFrom);
  };

  #dateToCloseHandler = ([userDate]) => {
    this._setState({ dateTo: userDate });
    this.#dateFromPicker.set('maxDate', this._state.dateTo);
  };

  #collapseClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCollapseClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const checkedOffers = this.element.querySelectorAll('.event__section--offers :checked');
    if (checkedOffers) {
      const checkedOffersKebabNames = [...checkedOffers].map((offer) => offer.id);
      const checkedOffersIds = checkedOffersKebabNames.map((offer) => getOfferIdByName(this.#allOffers, offer));
      this._setState({
        offers: checkedOffersIds,
      });
    }

    this.#handleFormSubmit(EditPointFormView.parseStateToWaypoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointFormView.parseStateToWaypoint(this._state));
  };

  #eventTypeClickHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.closest('.event__type-input')) {
      return;
    }

    this.updateElement({
      type: evt.target.value,
      hasOffers: getOffersByType(this.#allOffers, evt.target.value).length,
      offers: '',
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    const id = getDestinationIdByName(this.#allDestinations, evt.target.value);
    if(id) {
      this.updateElement({
        destination: id,
      });
    }
    if(this.#isNewPoint) {
      this.updateElement({
        destination: id,
      });
    }
  };

  static parseWaypointToState(waypoint, destinations, offers) {
    const destinationDescription = getCurrentDestination(destinations, waypoint).description;
    const offersByType = getOffersByType(offers, waypoint.type);

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
