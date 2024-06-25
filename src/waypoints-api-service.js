import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export default class WaypointsApiService extends ApiService {
  get waypoints() {
    return this._load({url: 'big-trip/points'})
      .then(ApiService.parseResponse);
  }

  async updateWaypoint(waypoint) {
    const response = await this._load({
      url: `big-trip/points/${waypoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(waypoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async addWaypoint(waypoint) {
    const response = await this._load({
      url: 'big-trip/points',
      method: Method.POST,
      body: JSON.stringify(waypoint),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async deleteWaypoint(waypoint) {
    const response = await this._load({
      url: `big-trip/points/${waypoint.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(waypoint) {
    const adaptedWaypoint = {...waypoint,
      'base_price': waypoint.basePrice,
      'date_from': waypoint.dateFrom instanceof Date ? waypoint.dateFrom.toISOString() : null,
      'date_to': waypoint.dateTo instanceof Date ? waypoint.dateTo.toISOString() : null,
      'is_favorite': waypoint.isFavorite,
    };

    delete adaptedWaypoint.basePrice;
    delete adaptedWaypoint.dateFrom;
    delete adaptedWaypoint.dateTo;
    delete adaptedWaypoint.isFavorite;

    return adaptedWaypoint;
  }

}
