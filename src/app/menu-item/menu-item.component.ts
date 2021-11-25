import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit {
  @Input() items: any;
  @ViewChild('childMenu', { static: true }) public childMenu: any;

  constructor() {}

  ngOnInit() {}
}
