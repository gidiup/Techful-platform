import {MongoObservable} from 'meteor-rxjs';
import {Meteor} from 'meteor/meteor';
import {Customer} from '../models/customer.model';
export const Customers=new MongoObservable.Collection<Customer>("clients");
function loggedIn(){
    return !!Meteor.user();
}
Customers.allow({
    insert:loggedIn,
    update:loggedIn,
    remove:loggedIn
});
