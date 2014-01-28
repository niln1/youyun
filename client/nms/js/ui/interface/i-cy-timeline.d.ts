interface TimelineGraphMargin {
    left:number;
    right:number;
    top:number;
    bottom:number;
}

interface TimelineGraphDataItem {
    category:string;
    description:string;
    startingTime:number;
    endingTime:number;
}

interface TimelineGraphTypeItem {
    name:string;
    label:string;
    className:string;
}

interface TimelineGraphOptions {
    id?:number;
    margin?:TimelineGraphMargin;
    categories?:TimelineGraphTypeItem[];
    data?:TimelineGraphDataItem[];
    width?:number;
    height?:number;
    padding?:number;
    mouseover?:(element:any, x:number, y:number) => void;
    mouseout?:(element:any, x:number, y:number) => void;
    mousemove?:(element:any, x:number, y:number) => void;
    click?:(element:any, x:number, y:number) => void;
}