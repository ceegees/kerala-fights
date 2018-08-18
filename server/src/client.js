import React from 'react'
import {hydrate} from 'react-dom'
import {Provider} from 'react-redux'
import configureStore from './redux/configureStore'; 
import routes  from './routes';

import {BrowserRouter,Router,Redirect,Route,Switch} from 'react-router-dom'

import createBrowserHistory from 'history/createBrowserHistory'
const history = createBrowserHistory()

const state = window.__STATE__;
delete window.__STATE__;
const store = configureStore(state)
window.gAppStore = store;

hydrate(
  <Provider store={store} > 
        <BrowserRouter  >
            <Switch>
                {
                    routes.map((r,idx) => <Route exact={r.exact} key={`route_${idx}`}
                            path={r.path} component={r.component} />)
                }
            </Switch>
        </BrowserRouter>
  </Provider>,
  document.querySelector('#app')
)
