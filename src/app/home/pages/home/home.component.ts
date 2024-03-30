import { Component, OnInit, inject } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {


  private carritoService  = inject(CarritoService)


  constructor(
    private databaseService: DatabaseService
    ) { }

  ngOnInit() {
    // this.databaseService.getData()
    this.carritoService.getCarritoChanges().subscribe( changes => {
      console.log('getCarritoChanges en home -> ', changes);
    });
  }



}
