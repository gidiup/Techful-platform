import {Pipe,PipeTransform} from '@angular/core';
@Pipe({
  name:'displayDate'
})
export class DisplayDatePipe implements PipeTransform {
  transform(date:string):string{
    if(!date){
      return '0/0/0';
    }
    let _date_=Number(date);
    let date_=new Date(_date_);
    return date_.toLocaleDateString('en-US');
  }
}