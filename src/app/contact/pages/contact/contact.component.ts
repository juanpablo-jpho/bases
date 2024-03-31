import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent  implements OnInit {

  title: string = 'Contact'
  desciption: string = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. At, mollitia. At consectetur aut voluptatum asperiores culpa perferendis quia. Officia quaerat rerum libero sapiente temporibus saepe corrupti. Eveniet deserunt animi ab.'


  constructor() { }

  ngOnInit() {}


  
}
