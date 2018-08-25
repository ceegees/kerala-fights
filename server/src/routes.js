import Home from './components/Home' 
import Dashboard from './components/Dashboard'
import ProviderList from './components/Provider/Lister'
import HeatMap from './components/HeatMap'
import AddRequestModal from './components/Request/AddModal'

const routes =  [ 
  {
    path: '/new',
    exact: true,
    component: AddRequestModal,
  }, 
  {
    path:'/heatmap/:status?',
    exact:true,
    component:HeatMap
  },
  {
    path: '/dashboard/:requestId?', 
    component: Dashboard,
  },
  {
    path: '/manage/:status?/:page?',
    exact: true,
    component: Dashboard,
  },
  {
    path: '/requests/:status?/:page?',
    exact: true,
    component: Dashboard,
  },
  {
    path: '/service-providers/:status?/:page?',
    exact: true,
    component: ProviderList,
  },
  {
    path: '/home/:label',  
    exact:true,
    component: Home,
  },
  {
    path: '/',  
    component: Home,
  },
];
 
export default routes;