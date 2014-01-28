/**
 * used to persist the state of a nodegrid
 */
interface CyGridState {

    page        : number;
    pageSize    : number;
    sort?       : any;
    group?      : any;
    filter?     : any;
    columns     : any;
}