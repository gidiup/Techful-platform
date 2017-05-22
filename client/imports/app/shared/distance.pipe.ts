import {Pipe,PipeTransform} from '@angular/core';
@Pipe({
  name:'distance'
})
export class DisplayDistancePipe implements PipeTransform{
  transform(coords:{lat:number,lng:number},orderCoords:{lat:number,lng:number}):number{
    if(!coords || coords=={} || !orderCoords || orderCoords=={}){
      return 0;
    }
    // let R=6371;//kilometres
    let R=3958.756;//miles
    let latRadians1=this.deg2rad(orderCoords.lat);
    let latRadians2=this.deg2rad(coords.lat);
    // let latRadians2=this.deg2rad(51.673858);
    let latRadians=this.deg2rad(coords.lat-orderCoords.lat);
    // let latRadians=this.deg2rad(51.673858-orderCoords.lat);
    let lngRadians=this.deg2rad(coords.lng-orderCoords.lng);
    // let lngRadians=this.deg2rad(7.815982-orderCoords.lng);
    let a=Math.sin(latRadians/2) * Math.sin(latRadians/2) +
        Math.cos(latRadians1) * Math.cos(latRadians2) *
        Math.sin(lngRadians/2) * Math.sin(lngRadians/2);
    let c=2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    return Number((R * c).toFixed(2));
  }
  deg2rad(deg){
    return deg * (Math.PI/180)
  }
}