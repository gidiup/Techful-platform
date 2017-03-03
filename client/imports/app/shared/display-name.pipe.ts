import {Pipe,PipeTransform} from '@angular/core';
import {User} from '../../../../both/models/user.model';
@Pipe({
  name:'displayName'
})
export class DisplayNamePipe implements PipeTransform {
  transform(user:User):string{
    if(!user){
      return '';
    }
    if(user.profile){
      return user.profile.name;
    }
    if(user.username){
      return user.username;
    }
    if(user.emails){
      return user.emails[0].address;
    }
    return '';
  }
}