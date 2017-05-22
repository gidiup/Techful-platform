import {Meteor} from 'meteor/meteor';
import {Stripes} from '../../../both/collections/stripes.collection';
const stripe=require('stripe')('sk_live_QaFnWv9hZusRdI4sNmb64jEb');
Meteor.publish('stripeCustomerId',function(orderId:string){
  return Stripes.find({orderId:orderId});
})