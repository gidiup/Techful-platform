import {Meteor} from 'meteor/meteor';
import {Customers} from '../../../both/collections/customers.collection';
Meteor.publish('techs',function(tech:string){
  return Customers.find(tech);
});
