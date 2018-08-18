

export const appMessage = (text,status = true) => {
    return showMessage(text,status?'success':'error');
}

export const respMessage = (resp)=>{
    return appMessage(resp.message,resp.success);
}

export const showMessage = (type, text) => {
    return {
        type: "MESSAGE_STATUS",
        key: 'appMessage',
        value: {
            cls : type == 'success'?'w3-green':'w3-red',
            text,
        },
    };
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
