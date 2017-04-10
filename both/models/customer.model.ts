import {CollectionObject} from './collection-object.model';
export interface Customer extends CollectionObject{
    addresses?:Location[];
    homeLocation?:Location;
}
interface Location{
    name:string;
    address1:string;
    address2?:string;
    city:string;
    state:string;
    index_:string;
    lat?:number;
    lng?:number;
}