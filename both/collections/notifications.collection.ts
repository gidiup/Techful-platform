import {MongoObservable} from 'meteor-rxjs';
import {Meteor} from 'meteor/meteor';
import {Notification} from '../models/notifications.model';
export const Notifications=new MongoObservable.Collection<Notification>("notifications");
function loggedIn(){
    return !!Meteor.user();
}
Notifications.allow({
    insert:loggedIn,
    update:loggedIn,
    remove:loggedIn
});
