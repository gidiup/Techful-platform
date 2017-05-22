import {Pipe,PipeTransform} from '@angular/core';
import {Techs} from '../../../../both/collections/techs.collection';
@Pipe({
  name:'providerName'
})
export class DisplayProviderNamePipe implements PipeTransform{
  transform(id:string):string{
    if(!id){
      return '';
    }
    const found=Techs.findOne(id);
    if(found){
      return found.firstName
    }
    return '';
  }
}