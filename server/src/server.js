import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import configureStore from './redux/configureStore';
import  routes from './routes';
import { StaticRouter,Switch,Route } from 'react-router';

module.exports = function(req,context,initialState) { 
  const store = configureStore(initialState)
  let content = renderToString(
        <Provider store={store} >
            <StaticRouter location={req.url} context={context}>
                <Switch>
                    {
                        routes.map((r,idx) => <Route exact={r.exact} 
                            key={`route_${idx}`}
                            path={r.path} component={r.component} /> )
                    }
                </Switch>
            </StaticRouter>
        </Provider>
  );
  const preloadedState = store.getState()
  return {content, preloadedState};
} 

