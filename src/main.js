import GeneralPresenter from './presenter/general-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { render } from './framework/render.js';
import NewEventButtonView from './view/new-event-button-view.js';
import WaypointsApiService from './waypoints-api-service.js';
import OptionsApiService from './options-api-service.js';
import OptionsModel from './model/options-model.js';

const AUTHORIZATION = 'Basic hS1SfS32wCj1sa2jHJSHskj';
const END_POINT = 'https://23.objects.htmlacademy.pro';

const tripMainElement = document.querySelector('.trip-main');
const tripFilters = document.querySelector('.trip-controls__filters');
const oldButton = document.querySelector('.trip-main__event-add-btn');
const optionsModel = new OptionsModel({
  optionsApiService: new OptionsApiService(END_POINT, AUTHORIZATION)
});
const pointModel = new PointModel({
  waypointsApiService: new WaypointsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();
const generalPresenter = new GeneralPresenter({
  pointModel,
  filterModel,
  onNewWaypointDestroy: handleNewWaypointFormClose});

const filterPresenter = new FilterPresenter({
  filterContainer: tripFilters,
  filterModel,
  waypointsModel: pointModel
});

const newWaypointButtonComponent = new NewEventButtonView({
  onClick: handleNewTaskButtonClick
});

function handleNewWaypointFormClose() {
  newWaypointButtonComponent.element.disabled = false;
}

function handleNewTaskButtonClick() {
  generalPresenter.createWaypoint();
  newWaypointButtonComponent.element.disabled = true;
}

filterPresenter.init();
generalPresenter.init();

oldButton.remove();
pointModel.init(optionsModel)
  .finally(() => {
    render(newWaypointButtonComponent, tripMainElement);
  });

