import {Component,OnInit} from '@angular/core';
import template from './landing.component.html';
import style from './landing.component.scss';
@Component({
  selector:'landing',
  template,
  styles:[style]
})
export class LandingComponent implements OnInit{
  opacity1:number=1;
  opacity2:number=0.5;
  opacity3:number=0.5;
  ngOnInit(){}
  techie(){
    location.href='https://murmuring-harbor-70757.herokuapp.com'
  }
}