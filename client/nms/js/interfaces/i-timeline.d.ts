/**
 * and indivdual bar on the graph ( see cy-timeline.ts )
 */


interface timelineElement {
    text        : string;       // you fill in these members
    id          : string;
    cssclass    : string;
    start       : number;
    end         : number;
    cystart?    : any;          // these are used internally by the cy-timeline class.
    cyend?      : any;
    element?    : JQuery
}

/**
 * used to bind tick mark lines and labels together
 */
interface lineAndLabel {
    line: JQuery;
    label: JQuery;
}
