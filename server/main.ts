import {Meteor} from 'meteor/meteor';
import './imports/publications/images';
import './imports/publications/users';
import './imports/publications/techs';
import './imports/publications/orders';
import './imports/publications/stripes';
import './imports/publications/notifications';
import {Orders} from '../both/collections/orders.collection';
import {Customers} from '../both/collections/customers.collection';
const twilio=require('twilio');
const client=new twilio("AC2eb5ba4f10766652254e98f39edfb94a","12d2a562e3086135de08a2708e81df15");
//sk_live_DTUVpBy5ZJlLhCMpyrkafuYx
const stripe=require('stripe')('sk_test_cFbM4dJXHKw33TbfjcfBtavO');
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
      throw new Meteor.Error("stripeAPIFailureServer",err.message || err);
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
    let code:any="";
    if(sms=='Welcome your invitation code is: '){
      code=Math.round(Math.random()*1000);
    }
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
  },
  serverTime:function(){
    return Date.now()
  }
})
Meteor.startup(()=>{
  process.env.MAIL_URL='smtp://goodkidsapp:zxcvbnm,@smtp.gmail.com:465';
  if(Meteor.settings){
    SMS.twilio=Meteor.settings['twilio'];
  }
  Meteor.setInterval(()=>{
    let orders=Orders.find({status_:'Looking For Providers',date:{$lt:Date.now()-180000}},{fields:{creator:1}}).fetch()
    let orderIds=[];
    let usersArray=[];
    orders.forEach((order)=>{
      usersArray.push(order.creator);
      orderIds.push(order._id)
    })
    let customers=Customers.find({_id:{$in:usersArray}},{fields:{phone:1}}).fetch()
    customers.forEach((customer)=>{
      client.messages.create({
        body:"Counterbidding enabled. It's been 30 minutes and no provider has taken your job. We're going to open it up to counter bidding and see if that helps",
        to:customer.phone,
        from:SMS.twilio.FROM
      }).then((message)=>{
        console.log(message)
      }).catch(function(err){
        console.error(err.message || err)
      })
    })
    Orders.update({_id:{$in:orderIds}},{
      $set:{
        status_:"Counter-bidding"
      }
    })
  },99999)
})