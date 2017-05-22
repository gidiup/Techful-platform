import {CollectionObject} from './collection-object.model';
export interface Stripe extends CollectionObject{
    orderId:string;
    customer:string;
    usePrevious:boolean;
}