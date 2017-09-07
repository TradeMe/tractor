'use strict';

// Angular:
import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'tractor-nav',
  templateUrl: 'nav.component.html',
  styleUrls: ['nav.component.scss'],
  directives: [ROUTER_DIRECTIVES]
})
export class NavComponent { }
