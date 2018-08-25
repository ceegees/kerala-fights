function apps( state = {isFetching: false, apps: []}, changeAction) {
  switch (changeAction.type) {
    case "MESSAGE_STATUS":
        state = Object.assign({}, state, { appMessage: changeAction.value });
        return state;
    case 'SEARCH_TEXT':
    console.log('reducing actions',changeAction);
      state = Object.assign({},state,{searchText:changeAction.value});
    default:
      return state
  }
}

export default apps
