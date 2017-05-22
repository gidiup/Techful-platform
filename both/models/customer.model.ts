import {CollectionObject} from './collection-object.model';
export interface Customer extends CollectionObject{
    favoriteCategories?:fCategories[];
    uberAccessToken?:string;
    lastStripeCustomer?:string;
    last4Numbers?:string;
    favorites?:string[];
	marks?:number[];
    addresses?:Location[];
    location?:Coordinates;
    email:string;
    photo:string;
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
interface fCategories{
    parentParentCategory:string;
    choosedPrice:string;
    choosedParentCategory:string;
    choosedCategory:string;
}
interface Coordinates{
    lat:number;
    lng:number;
}
interface Location{
    name:string;
    address1:string;
    address2?:string;
    city:string;
    state:string;
    zipCode:string;
}