import {CollectionObject} from './collection-object.model';
export interface Order extends CollectionObject{
	now:boolean;
    date:number;
    location:Location;
    address1:string;
    address2:string;
    city:string;
    state:string;
    index:number;
    choreSum:string;
    disposalFee?:number;
    serviceFee?:number;
    tip?:number;
    description:string;
    images:string[];
    cardLast4:string;
	providerBeforeImgs?:string[];
	providerAfterImgs?:string[];
    creator:string;
    creatorName:string;
    creatorPhoto:string;
    providerId?:string;
    providerName?:string;
    name:string;
    parentName:string;
    categoryName:string;
    status_:string;
    providers?:Providers[];
}
interface Location{
    lng:number;
    lat:number;
}
interface Providers{
    id:string;
    bid?:number;
}