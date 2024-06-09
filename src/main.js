import GeneralPresenter from './presenter/general-presenter.js';
import PointModel from './model/point-model.js';
// import OptionsModel from './model/options-model.js';

const pointModel = new PointModel();
// const optionsModel = new OptionsModel();
const generalPresenter = new GeneralPresenter(pointModel);

generalPresenter.init();
