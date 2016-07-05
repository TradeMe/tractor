import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'tractor-nav',
  templateUrl: 'nav.component.html',
  styleUrls: ['nav.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
export class NavComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
