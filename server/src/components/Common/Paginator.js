import  React,{ Component } from 'react'; 
import {NavLink} from 'react-router-dom';

const Paginator = ({page,base,data}) => {
    page = page - 10;
    const pages = [];
    if(page < 1){
        page = 1;
    }
    const lastPage = data.page_max;
    for(var idx = page;idx < page + 18 && idx < lastPage;idx++){
        pages.push(idx);
    }

    if (data.total < data.per_page){
        return <div></div>
    }

    return <div className="w3-bar">
        <NavLink to={`${base}/1`} className="w3-button">&laquo;</NavLink> 
        {
            pages.map( page=> <NavLink key={`page_${page}`} to={`${base}/${page}`} 
                className="w3-button">{page}</NavLink> )
        }
        <NavLink to={`${base}/${lastPage}`} className="w3-button">&raquo;</NavLink>
    </div>
}

export default Paginator;