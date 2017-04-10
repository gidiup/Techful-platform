import {CollectionObject} from './collection-object.model';
export interface Tech extends CollectionObject{
    location:Location;
}
interface Location{
    name?:string;
    lat:number;
    lng:number;
}