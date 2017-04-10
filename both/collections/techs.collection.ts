import {MongoObservable} from 'meteor-rxjs';
import {Meteor} from 'meteor/meteor';
import {Tech} from '../models/tech.model';
export const Techs=new MongoObservable.Collection<Tech>("techs");
function loggedIn(){
    return !!Meteor.user();
}
Techs.allow({
    insert:loggedIn,
    update:loggedIn,
    remove:loggedIn
});
