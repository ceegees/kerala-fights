
function filterFromQuery(query,def={}){
    if (query.mode == 'refresh'){
        delete query.mode;
        clearCache();
    }
    const filter = Object.assign(def,{
        page:query.page ? query.page:1, 
        per_page:40
    });   
    for(var name in query){
        filter[name] = query[name];
    }
    return filter;
}

function jsonError(message = 'Error',data = null) {
    return {
        meta:{
            success:false,
            message:message,
        },
        data:data
    };
}

function jsonSuccess(data = null,message='Ok') {
    return {
        meta:{
            success:true,
            message:message,
        },
        data:data
    };
}

module.exports = {
    filterFromQuery:filterFromQuery,
    jsonError:jsonError,
    jsonSuccess:jsonSuccess
}