import {FilterTypes} from '../const.js';
import {isTripInFuture, isTripInPresent, isTripInPast} from './utils.js';

const filter = {
  [FilterTypes.EVERYTHING]: (waypoints) => waypoints,
  [FilterTypes.FUTURE]: (waypoints) => waypoints.filter((waypoint) => isTripInFuture(waypoint.dateFrom)),
  [FilterTypes.PRESENT]: (waypoints) => waypoints.filter((waypoint) => isTripInPresent(waypoint.dateFrom, waypoint.dateTo)),
  [FilterTypes.PAST]: (waypoints) => waypoints.filter((waypoint) => isTripInPast(waypoint.dateTo)),
};

export {filter};
