const initialState = {
    timeStart: undefined,
    timeStop: undefined,
    tSecs: undefined
};

export default (state = initialState, action) =>
{
    console.log(action.type);
    switch (action.type)
    {
        case "RESET":
            return Object.assign({}, state, {
                tSecs: 0,
                timeStart: state.timeStart ? action.now : undefined,
                timeStop: state.timeStop ? action.now : undefined
            });
        case "START":
            console.log(state);
            return Object.assign({}, state, {
                tSecs: action.tSecs,
                timeStart: action.now,
                timeStop: undefined
            });
        case "STOP":
            return Object.assign({}, state, {
                timeStop: action.now
            });
        default:
            return state;
    }
};
