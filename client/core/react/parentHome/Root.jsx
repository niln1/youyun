import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Router from './Router';
import History from 'react-router/lib/HashHistory';
import * as reducers from './reducers';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

const history = new History;

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                {() => <Router history={history} />}
            </Provider>
        );
    }
}