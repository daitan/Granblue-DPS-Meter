import {combineReducers} from 'redux';

import tDmg from './tDmg';
import timer from './timer';

export default combineReducers({
    tDmg,
    timer
});
