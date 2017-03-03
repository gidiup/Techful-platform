import {CollectionObject} from './collection-object.model';
export interface Customer extends CollectionObject{
    location:Location;
}
interface Location{
    name?:string;
    lat:number;
    lng:number;
}