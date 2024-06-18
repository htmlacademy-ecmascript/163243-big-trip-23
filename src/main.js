import GeneralPresenter from './presenter/general-presenter.js';
import PointModel from './model/point-model.js';
// import OptionsModel from './model/options-model.js';
import FilterModel from './model/filter-model.js';
// import FiltersView from './view/filter-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { render } from './framework/render.js';
import NewEventButtonView from './view/new-event-button-view.js';


const tripMainElement = document.querySelector('.trip-main');
const tripFilters = document.querySelector('.trip-controls__filters');
const oldButton = document.querySelector('.trip-main__event-add-btn');
const pointModel = new PointModel();
// const optionsModel = new OptionsModel();
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

oldButton.remove();
render(newWaypointButtonComponent, tripMainElement);

filterPresenter.init();
generalPresenter.init();

