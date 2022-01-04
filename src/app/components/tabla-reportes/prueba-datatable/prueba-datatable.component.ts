import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-prueba-datatable',
  templateUrl: './prueba-datatable.component.html',
  styleUrls: ['./prueba-datatable.component.css']
})
export class PruebaDatatableComponent implements OnInit, OnDestroy {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  data: any;


  constructor(private http: HttpClient) { }
  
  
  ngOnInit(): void {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5,10],
      processing: true
    };
    // this.http.get('http://dummy.restapiexample.com/api/v1/employees')
    //   .subscribe((res:any) => {
    //     this.data =res.data;
    //     // console.log(res)
    //     // Calling the DT trigger to manually render the table
    //     this.dtTrigger.next();
    // });

    // this.http.get('http://dummy.restapiexample.com/api/v1/employees')
    //   .subscribe(console.log);
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


}
