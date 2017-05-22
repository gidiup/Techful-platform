import {Pipe,PipeTransform} from '@angular/core';
import {Techs} from '../../../../both/collections/techs.collection';
@Pipe({
  name:'providerPhoto'
})
export class DisplayProviderPhotoPipe implements PipeTransform{
  transform(id:string):string{
    if(!id){
      return ''
    }
    const found=Techs.findOne(id)
    if(found){
      return found.photo
    }
    return '';
  }
}