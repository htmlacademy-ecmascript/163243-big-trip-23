const TripTypes = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
];

const SortTypes = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'};

const UserAction = {
  UPDATE_WAYPOINT: 'UPDATE_WAYPOINT',
  ADD_WAYPOINT: 'ADD_WAYPOINT',
  DELETE_WAYPOINT: 'DELETE_WAYPOINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const BLANK_WAYPOINT = {
  'id': null,
  'basePrice': 0,
  'dateFrom': null,
  'dateTo': null,
  'destination': null,
  'isFavorite': false,
  'offers': [],
  'type': 'flight',
};

export { TripTypes, SortTypes, UserAction, UpdateType, FilterTypes, BLANK_WAYPOINT };
