import {Meteor} from 'meteor/meteor';
import './imports/publications/images';
import './imports/publications/users';
Meteor.startup(()=>{
  process.env.MONGODB_URI='mongodb://heroku_plw4nr3k:vrbj5t6d70dvs63j9ce14e5f0f@ds113670.mlab.com:13670/heroku_plw4nr3k';
  process.env.MAIL_URL='smtp://goodkidsapp:zxcvbnm,@smtp.gmail.com:465';
});
