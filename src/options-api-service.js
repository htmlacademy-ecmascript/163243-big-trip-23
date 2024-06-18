import ApiService from './framework/api-service.js';


export default class OptionsApiService extends ApiService {
  get offers() {
    return this._load({url: 'big-trip/offers'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'big-trip/destinations'})
      .then(ApiService.parseResponse);
  }
}
