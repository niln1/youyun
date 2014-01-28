/**
 * represents a single header on the main horizontal nav bar
 */
interface ICyNavigationHeader {
    text            : string;
    id              : string;
    fragment?       : string;
    url?            : string;
    widget?         : JQuery;
}
