interface ICyWindowConfiguration {
    width?      : number;
    height?     : number;
    minWidth?   : number;
    minHeight?  : number;
    maxWidth?   : number;
    maxHeight?  : number;
    resizable?  : boolean;
    modal?      : boolean;
    title?      : string;
    showTitle?  : boolean;
}

/**
 * each window instance should return some information that can be used to uniquely identify itself in the UI
 * and also indicate the type of information is displays
 */
interface ICyWindowInfo {
    displayName : string;
    windowType  : string;
}