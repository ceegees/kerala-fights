import Home from './components/Home' 
import AdminDashboard from './components/AdminDashboard'
import ServiceProviderList from './components/Provider/Lister'
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
    path: '/dashboard', 
    component: AdminDashboard,
  },
  {
    path: '/manage/:status?/:page?',
    exact: true,
    component: AdminDashboard,
  },
  {
    path: '/requests/:status?/:page?',
    exact: true,
    component: AdminDashboard,
  },
  {
    path: '/service-providers/:status?/:page?',
    exact: true,
    component: ServiceProviderList,
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