import {Meteor} from 'meteor/meteor';
import {Orders} from '../../../both/collections/orders.collection';
Meteor.publish('myOrders',function(owner:string){
  return Orders.find({creator:owner});
});
