import GeneralPresenter from './presenter/general-presenter.js';
import PointModel from './model/point-model.js';

const pointModel = new PointModel();
const generalPresenter = new GeneralPresenter(pointModel);

generalPresenter.init();
