import Home from './components/Home' 
import AdminDashboard from './components/AdminDashboard'
import HeatMap from './components/HeatMap'
import Rescue from './components/Rescue'

const routes =  [ 
  {
    path: '/new',
    exact: true,
    component: Rescue,
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
    path: '/',  
    exact:true,
    component: Home,
  },
  {
    path: '/:label',  
    component: Home,
  },
];
 
export default routes;