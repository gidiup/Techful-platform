import {Meteor} from 'meteor/meteor';
import {Customers} from '../../../both/collections/customers.collection';
Meteor.publish('user',function(user:string){
  return Customers.find(user);
});
