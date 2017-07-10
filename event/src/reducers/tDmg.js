const initialState = 0;

export default (state = initialState, action) =>
{
    switch (action.type)
    {
        case 'INCREMENT_TDMG':
            return state + (action.payload ? action.payload : 0);
    default:
      return state;
    }
};
