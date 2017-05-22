import {Pipe,PipeTransform} from '@angular/core';
@Pipe({
  name:'displayTime'
})
export class DisplayTimePipe implements PipeTransform {
  transform(date:string):string{
    if(!date){
      return '00:00 AM';
    }
    let _date_=Number(date);
    let date_=new Date(_date_);
    return date_.toLocaleTimeString('en-US');
  }
}