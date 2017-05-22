import {Meteor} from 'meteor/meteor';
import {Techs} from '../../../both/collections/techs.collection';
Meteor.publish('techsLocation',function(){
  return Techs.find({},{fields:{location:1}});
});
Meteor.publish('providersSubscription',function(providers:string[]){
  return Techs.find({_id:{$in:providers}});
});
Meteor.publish('provider',function(providerId:string){
  return Techs.find(providerId);
});
