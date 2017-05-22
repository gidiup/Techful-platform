import {MongoObservable} from 'meteor-rxjs';
import {Meteor} from 'meteor/meteor';
import {Stripe} from '../models/stripe.model';
export const Stripes=new MongoObservable.Collection<Stripe>("stripes");
function loggedIn(){
    return !!Meteor.user();
}
Stripes.allow({
    insert:loggedIn,
    update:loggedIn,
    remove:loggedIn
});
