import Home from './components/Home' 
import AdminDashboard from './components/AdminDashboard'
import ServiceProviderList from './components/ServiceProviderList'
import HeatMap from './components/HeatMap'

const routes =  [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/home',
    exact: true,
    component: Home,
  },
  {
    path:'/heatmap/:status?',
    exact:true,
    component:HeatMap
  },
  {
    path: '/manage/:status?/:page?',
    exact: true,
    component: AdminDashboard,
  },
  {
    path: '/service-providers/:page?',
    exact: true,
    component: ServiceProviderList,
  }
];
 
export default routes;