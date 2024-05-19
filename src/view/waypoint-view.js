import dayjs from 'dayjs';
import { createElement } from '../render.js';
import { humanizeDate } from '../utils.js';

const TIME_FORMAT = 'hh:mm';
const SHORT_DATE_FORMAT = 'yyyy-mm-dd';
const SHORT_DISPLAY_DATE_FORMAT = 'MMM D';
const DELTA_TIME_FORMAT = 'M[M] D[D] H[H] mm[M]';

const createOfferTemplate = (offer) => `
  <li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>
`;

const createWaypointViewTemplate = (point, destinations, offers) => {
  const currentDestination = destinations.find((destination) => destination.id === point.destination);
  const offersByType = offers.find((offer) => offer.type === point.type);
  let currentOffers = [];
  if (offersByType) {
    currentOffers = offersByType.offers.filter((offer) => point.offers.includes(offer.id));
  }

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${humanizeDate(point.dateFrom, SHORT_DATE_FORMAT)}">${humanizeDate(point.dateFrom, SHORT_DISPLAY_DATE_FORMAT)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${point.type} ${currentDestination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${point.dateFrom}">${humanizeDate(point.dateFrom, TIME_FORMAT)}</time>
            &mdash;
            <time class="event__end-time" datetime="${point.dateTo}">${humanizeDate(point.dateTo, TIME_FORMAT)}</time>
          </p>
          <p class="event__duration">${humanizeDate((dayjs(point.dateTo) - dayjs(point.dateFrom)), DELTA_TIME_FORMAT)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${currentOffers.map((offer) => createOfferTemplate(offer)).join('')}
        </ul>
        <button class="event__favorite-btn ${point.isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
};

export default class WaypointView {
  constructor(point, destinations, offers) {
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    return createWaypointViewTemplate(this.point, this.destinations, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
