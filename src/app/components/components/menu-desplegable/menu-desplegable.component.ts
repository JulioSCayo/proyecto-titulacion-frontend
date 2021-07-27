import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-desplegable',
  templateUrl: './menu-desplegable.component.html',
  styleUrls: ['./menu-desplegable.component.css']
})
export class MenuDesplegableComponent implements OnInit {

  toggleClass: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
}
