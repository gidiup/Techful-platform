import {Meteor} from 'meteor/meteor';
import {Notifications} from '../../../both/collections/notifications.collection';
Meteor.publish('notifications',function(customer:string){
  return Notifications.find({forWhom:customer})
});