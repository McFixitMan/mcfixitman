import { createTransform } from 'redux-persist';

export const dateTransform = createTransform(
    (inboundState, key): any => {
        // Function applied to the state when its being persisted

        // Stringify the state to persist
        return JSON.stringify(inboundState);
    },
    (outboundState, key) => {
        // Function applied to whatever object was persisted when it is on its way to being turned back into the state object

        // Parse our stringified state, and convert 
        return JSON.parse(outboundState, (pKey, pValue) => {
            return typeof pValue === 'string' && pValue.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
                ? new Date(pValue)
                : pValue;
        });
    },
);