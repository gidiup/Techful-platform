import {CollectionObject} from './collection-object.model';
export interface Tech extends CollectionObject{
    uberAccessToken?:string;
    marks?:number[];
    email:string;
    photo:string;
    location?:Location;
    skills:string[];
    firstName:string;
    middleName:string;
    lastName:string;
    monthDate:number;
    dayDate:number;
    yearDate:number;
    address1:string;
    address2:string;
    city:string;
    state:string;
    zipCode:number;
    bio:string;
    phone:string;
}
interface Location{
    lat:number;
    lng:number;
}