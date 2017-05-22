import {Pipe,PipeTransform} from '@angular/core';
import {Techs} from '../../../../both/collections/techs.collection';
@Pipe({
  name:'providerMarksPipe'
})
export class DisplayProviderMarksPipe implements PipeTransform{
  transform(id:string):number{
    if(!id){
      return 0
    }
    const found=Techs.findOne(id)
    if(found && found.marks){
      let sumOfMarks=0;
      found.marks.forEach((mark)=>{
        sumOfMarks=sumOfMarks+mark;
      })
      return sumOfMarks/found.marks.length
    }
    return 0;
  }
}