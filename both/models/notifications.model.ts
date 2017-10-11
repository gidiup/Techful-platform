import {CollectionObject} from './collection-object.model';
export interface Notification extends CollectionObject{
    orderId:string;
    forWhom?:string;
    myOrAvailable?:boolean;
    blackList?:string[];
}