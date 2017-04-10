import {Meteor} from 'meteor/meteor';
import {Techs} from '../../../both/collections/techs.collection';
Meteor.publish('techsLocation',function(){
  return Techs.find({},{fields:{location:1}});
});
