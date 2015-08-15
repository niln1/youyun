import React, { Component } from 'react';
import { Provider } from 'react-redux';
// import configureStore from './configureStore';
import Router from './Router';
import History from 'react-router/lib/HashHistory';

const history = new History;

export default class Root extends Component {
    render() {
        return (
            <Provider>
                {() => <Router history={history} />}
            </Provider>
        );
    }
}