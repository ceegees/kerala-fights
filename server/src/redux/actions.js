

export const appMessage = (text,status = true) => {
    return showMessage(text,status?'success':'error');
}

export const respMessage = (resp)=>{
    return appMessage(resp.message,resp.success);
}

export const showMessage = (type, text,stay=0) => {
    return {
        type: "MESSAGE_STATUS",
        key: 'appMessage',
        value: {
            stay:stay,
            cls : type == 'success'?'w3-green':'w3-red',
            text,
        },
    };
}

export const getLatLng = (item) => {
    let lat = null;
    let lng = null;
     if (item.json && item.json.location){
        lat = parseFloat(""+item.json.location.lat);
        lng = parseFloat(""+item.json.location.lon);
    } else if(item.latLng && item.latLng.coordinates && item.latLng.coordinates.length == 2) {
        lat = item.latLng.coordinates[0], 
        lng = item.latLng.coordinates[1]
    } 
    return {
        lat:lat,
        lng:lng
    }
}
export const hideMessage = () => {
    return {
        type: "MESSAGE_STATUS",
        key: 'appMessage',
        value: {
            cls: '',
            text: '',
        },
    };
};
