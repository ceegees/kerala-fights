function apps( state = {isFetching: false, apps: []}, changeAction) {
  switch (changeAction.type) {
    case "MESSAGE_STATUS":
        state = Object.assign({}, state, { appMessage: changeAction.value });
        return state;

    default:
      return state
  }
}

export default apps
