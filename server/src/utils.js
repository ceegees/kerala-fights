
import moment from 'moment'; 
import axios from 'axios';
import qs from 'querystring';
  
export function roundUpHour(secs){
    return secs + (3600 - secs %3600);
} 

export function getDiffClass(diff,vals=[30,20,10]){
    let cls = 'w3-green';
    if (diff >= vals[0]) {
        cls = 'w3-red';
    } else if (diff >= vals[1]){
        cls = 'w3-orange';
    } else if ( diff >= vals[2]) {
        cls = 'w3-yellow';
    }   
    return cls;
}
  

export function fetchData(url,params) {
    const query = qs.stringify(params);
    return axios.get(`${url}?${query}`);
}
 
export function hoursProgressed(startDt,endDt){
  const end = moment(); 
  const iter = moment(startDt);
  let hours = 0;
  const cap = moment(endDt+" 24:00:00");
  while(iter <= end && iter <= cap){

        iter.add(1,'hours');
        if (['Saturday','Sunday'].indexOf(iter.format('dddd')) >= 0){
            continue;
        }
        const hr = iter.hour();
        if (hr < 9 || hr > 18 || hr == 12 || hr == 13 ) {
            continue;
        }
        hours += 1;
  } 
  return hours;
}

 