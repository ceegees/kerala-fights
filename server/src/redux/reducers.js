function apps( state = {isFetching: false, apps: []}, action) {
  switch (action.type) {
    case "MESSAGE_STATUS":
        state = Object.assign({}, state, { appMessage: action.value });
        return state;
    case 'SEARCH_TEXT':
      state = Object.assign({},state,{searchText:action.value});
      return state;
    case 'MODAL_UPDATE':
      state = Object.assign({},state,{
        modalInfo:{
          name:action.name,
          data:action.data
        }
      });
      return state;

    case 'REQUEST_FILTER_STATS': 
      state = Object.assign({},state,{
        requestFilterStats:action.data
      }); 
      return state;
    default:
      return state
  }
}

export default apps
