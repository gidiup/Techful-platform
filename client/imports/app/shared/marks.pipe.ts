import {Pipe,PipeTransform} from '@angular/core';
@Pipe({
  name:'marksPipe'
})
export class DisplayMarksPipe implements PipeTransform{
  transform(marks:number[]):number{
    if(!marks || marks==[]){
      return 0;
    }
    let sumOfMarks=0;
    marks.forEach((mark)=>{
      sumOfMarks=sumOfMarks+mark;
    })
    return sumOfMarks/marks.length;
  }
}