import {Meteor} from 'meteor/meteor';
import './imports/publications/images';
import './imports/publications/users';
import './imports/publications/techs';
import './imports/publications/orders';
import './imports/publications/stripes';
const twilio=require('twilio');
const client=new twilio("AC2eb5ba4f10766652254e98f39edfb94a","12d2a562e3086135de08a2708e81df15");
// sk_live_QaFnWv9hZusRdI4sNmb64jEb
const stripe=require('stripe')('sk_test_0jcDreMXhtK1jbt2X4Uvqa7q');
const Uber=require('node-uber');
// const uber=new Uber({
//   client_id:'qqJi5e4WM0_99YkW4upuKKwDwxpo6EAG',
//   client_secret:'JU9Ucre51yj4ALqPnE-Rv_m27UExqXFSPSND5ZQx',
//   server_token:'2QN-3VgyYA3NVhf8v2KouWxE7VPjb_11zk8hvf2b',
//   redirect_uri:'http://localhost:3000/app',
//   name:'Techful'
// });
Meteor.methods({
  uberUrl:function(locationhref){
    let uber=new Uber({
      client_id:'Z2teMsbDUtpbI-1cJjRBhQYonN-ymK9K',
      client_secret:'oo3vQ8XuHyy-2FM2RulQURVqkUSx28SdYG19U6l_',
      server_token:'5b5aS34pbq41yNDCDq_jvqFR3Cx9m4alqAeN35bw',
      redirect_uri:locationhref,
      name:'Techful'
    })
    return uber.getAuthorizeUrl(['request'])
  },
  uberAccessToken:function(code,locationhref){
    let uber=new Uber({
      client_id:'Z2teMsbDUtpbI-1cJjRBhQYonN-ymK9K',
      client_secret:'oo3vQ8XuHyy-2FM2RulQURVqkUSx28SdYG19U6l_',
      server_token:'5b5aS34pbq41yNDCDq_jvqFR3Cx9m4alqAeN35bw',
      redirect_uri:locationhref,
      name:'Techful'
    })
    let access_token_=uber.authorizationAsync({authorization_code:code}).then(function(access_token){
      return access_token
    }).error(function(err){
      throw new Meteor.Error("UberAPIFailure",err.message || err);
    })
    return access_token_
  },
  uberCreateRequest:function(parameters,locationhref){
    let uber=new Uber({
      client_id:'Z2teMsbDUtpbI-1cJjRBhQYonN-ymK9K',
      client_secret:'oo3vQ8XuHyy-2FM2RulQURVqkUSx28SdYG19U6l_',
      server_token:'5b5aS34pbq41yNDCDq_jvqFR3Cx9m4alqAeN35bw',
      redirect_uri:locationhref,
      name:'Techful',
      sandbox:true,
      access_token:parameters['access_token'],
      scope:['request']
    })
    let request_=uber.requests.createAsync(parameters).then(function(request){
      return request
    }).error(function(err){
      throw new Meteor.Error("UberAPIFailure",err.message || err);
    })
    return request_
  },
  uberMap:function(parameters,locationhref){
    let uber=new Uber({
      client_id:'Z2teMsbDUtpbI-1cJjRBhQYonN-ymK9K',
      client_secret:'oo3vQ8XuHyy-2FM2RulQURVqkUSx28SdYG19U6l_',
      server_token:'5b5aS34pbq41yNDCDq_jvqFR3Cx9m4alqAeN35bw',
      redirect_uri:locationhref,
      name:'Techful',
      sandbox:true,
      access_token:parameters['access_token']
    })
    let map_=uber.requests.getMapByIDAsync().then(function(map){
      return map
    }).error(function(err){
      throw new Meteor.Error("UberAPIFailure",err.message || err);
    })
    return map_
  },
  stripeCharge:function(tokenCustomer:string,totalSum:number){
      let charge_;
      if(tokenCustomer.indexOf("tok_")==-1){
        charge_=stripe.charges.create({
          amount:totalSum,
          currency:'usd',
          customer:tokenCustomer
        }).then(function(charge){
          return charge
        }).catch(function(err){
          throw new Meteor.Error("stripeAPIFailure",err.message || err);
        })
      }else{
        charge_=stripe.charges.create({
          amount:totalSum,
          currency:'usd',
          source:tokenCustomer
        }).then(function(charge){
          return charge
        }).catch(function(err){
          throw new Meteor.Error("stripeAPIFailure",err.message || err);
        })
      }
      return charge_
  },
  retrieveStripeCustomer:function(customer:string){
    let newCustomer_=stripe.customers.retrieve(customer).then(function(newCustomer){
      return newCustomer
    }).catch(function(err){
      throw new Meteor.Error("stripeAPIFailure",err.message || err);
    })
    return newCustomer_
  },
  firstStripeCustomer:function(token:string,email_:string){
    let customer_=stripe.customers.create({email:email_,source:token}).then(function(customer){
      return customer
    }).catch(function(err){
      throw new Meteor.Error("stripeAPIFailure",err.message || err);
    })
    return customer_
  },
  sendCode:function(sms,phoneN){
    let code=Math.round(Math.random()*1000);
    let answer=client.messages.create({
      body:sms+code,
      to:phoneN,
      from:SMS.twilio.FROM
    }).then((message)=>{
      return code
    }).catch(function(err){
      throw new Meteor.Error("twilioAPIFailure",err.message || err);
    })
    return answer
  }
})
Meteor.startup(()=>{
  process.env.MONGODB_URI='mongodb://heroku_plw4nr3k:vrbj5t6d70dvs63j9ce14e5f0f@ds113670.mlab.com:13670/heroku_plw4nr3k';
  process.env.MAIL_URL='smtp://goodkidsapp:zxcvbnm,@smtp.gmail.com:465';
  if(Meteor.settings){
    SMS.twilio=Meteor.settings['twilio'];
  }
})