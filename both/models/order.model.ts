import {CollectionObject} from './collection-object.model';
export interface Order extends CollectionObject{
    date:number;
    location?:Location;
    address1:string;
    address2:string;
    city:string;
    state:string;
    index:number;
    sum:string;
    description:string;
    images:string[];
    creator:string;
}
interface Location{
    lat:number;
    lng:number;
}