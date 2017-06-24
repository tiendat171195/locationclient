import {createStore, applyMiddleware} from "redux";
import reducers from './reducers';
import thunk from 'redux-thunk';
export default store= createStore(
    reducers,
    applyMiddleware(thunk)
);
