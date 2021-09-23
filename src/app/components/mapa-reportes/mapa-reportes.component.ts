import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ReportesService } from "../../services/reportes/reportes.service";
import { Loader } from '@googlemaps/js-api-loader';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mapa-reportes',
  templateUrl: './mapa-reportes.component.html',
  styleUrls: ['./mapa-reportes.component.css']
})
export class MapaReportesComponent implements OnInit {

  @Input() span = 'Seleccionar archivo de imagen';

  @ViewChild('file', {
    read: ElementRef
  }) file?: ElementRef;

  selectedImage?: File;

  // VARIABLES PARA HACER TOGGLE DE CLASES
  toggleShowBotonReportar: boolean = false;
  toggleDesactivarMapa: boolean = false;
  toggleTipoProblema: boolean = false;
  toggleTipoAgua: boolean = false;
  toggleTipoObstruccion: boolean = false;
  toggleFormReporte: boolean = false;
  
  // COORDENADAS Y TIPO DEL NUEVO REPORTE
  nuevoLatLng: any;
  nuevoProblema: string = "";

  constructor(public reportesService: ReportesService) { }

  ngOnInit(): void {
    this.mapa();
  }

  onImageSelected(event: Event) {
    this.selectedImage = this.file?.nativeElement.files[0];

    if(this.selectedImage?.name) {
			this.span = this.selectedImage?.name;
    }
  }

  mapa() {
    let longitud: number;
    let latitud: number;

    // CONSEGUIR COORDENADAS
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;
      }, function(err){
        console.error(err);
      }, {enableHighAccuracy: true});
    }

    // DECLARAR LOADER DEL MAPA CON LA APIKEY
    let loader = new Loader({
      // apiKey: 'AIzaSyAYN-jmRSHPR78rT0l1na0XchXlJT7_sDw'
      apiKey: ''
    });

    // SE CARGA EL MAPA
    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById("mapa")!, {
        center: { lat: latitud, lng: longitud},
        disableDefaultUI: true,
        zoomControl: true,
        zoom: 12,
        styles: [
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ]
      });

      // ESTO ES PARA INTENTAR HACER EL BUSCADOR EN UN FUTURO
      // const buscador = <HTMLInputElement>document.getElementById("buscador")!;
      // const buscar = new google.maps.places.Autocomplete(buscador);
      // buscar.bindTo("bounds", map);

      

      this.addMarker(latitud, longitud, map);



      const markerDefault = "red"
      const markerColor1 = "#3FABCB";

      let newMarker: google.maps.Marker[] = [];

      google.maps.event.addListener(map, "click", (event: any) => {
        let boton = document.getElementById('boton')
        this.nuevoLatLng = event.latLng;
        
        if(newMarker.length > 0) {
          newMarker[0].setMap(null);
          newMarker = [];
        }

        const addMarker = new google.maps.Marker({
          position: this.nuevoLatLng,
          map,
          title: "New Marker!",
          optimized: true,
          icon: newMarkerIcon,
          draggable: true
        });

        newMarker.push(addMarker);

        setTimeout(() => {
          infoWindow.close();
          infoWindow.setContent(boton);
          this.toggleShowBotonReportar = true;
          infoWindow.open(newMarker[0].getMap(), newMarker[0]);
        }, 100);
        
        boton?.addEventListener('click', () => {
          this.tipoProblema();
        })
      })

      const newMarkerIcon = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: markerDefault,
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30)
      };

      const icon1 = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: markerColor1,
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30)
      };

      const marker1 = new google.maps.Marker({
        position: { lat: latitud, lng: longitud },
        map,
        title: "Marker 1!",
        optimized: true,
        icon: icon1,
        draggable: false
      });

      const infoWindow = new google.maps.InfoWindow();

      marker1.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(marker1.getTitle());
        infoWindow.open(marker1.getMap(), marker1);
      });

    });
  }




  // AGREGAR LOS MARCADORES DE LOS REPORTES EXISTENTES (PENDIENTE)
  addMarker(latitud: number, longitud: number, map: google.maps.Map) {
    new google.maps.Marker({
      position: { lat: latitud-.05, lng: longitud-.05 },
      map: map,
      title: "Marker",
      optimized: true,
      draggable: false
    });
  }




  // MOSTRAR LA VENTANA DE TIPO DE PROBLEMA
  tipoProblema() {
    this.toggleTipoProblema = true;
    this.toggleDesactivarMapa = true;
  }
  // MOSTRAR LA VENTANA DE TIPO DE PROBLEMA DE AGUA Y CERRAR LA GENERAL
  tipoAgua() {
    this.toggleTipoProblema = false
    this.toggleTipoAgua = true;
  }
  // MOSTRAR LA VENTANA DE TIPO DE PROBLEMA DE OBSTRUCCION Y CERRAR LA GENERAL
  tipoObstruccion() {
    this.toggleTipoProblema = false
    this.toggleTipoObstruccion = true;
  }
  
  


  formReporte(tipoProblema: string) {
    this.nuevoProblema = tipoProblema;
    this.toggleTipoProblema = false
    this.toggleTipoAgua = false;
    this.toggleTipoObstruccion = false;
    this.toggleFormReporte = true;
  }





  // ENVIAR REPORTE
  reportar(comentario: HTMLTextAreaElement, cronico: HTMLInputElement, riesgoVida: HTMLInputElement) {
    const latitud = this.nuevoLatLng.lat();
    const longitud = this.nuevoLatLng.lng();

    const formData = new FormData;
    formData.append('credibilidad', '5');
    formData.append('tipoProblema', this.nuevoProblema);
    formData.append('ubicacion.latitud', latitud);
    formData.append('ubicacion.longitud', longitud);
    // formData.append('comentario', comentario.value);
    // formData.append('cronico', cronico.value);
    // formData.append('riesgoVida', riesgoVida.value);
    // formData.append('imagen', this.file?.nativeElement.files[0]);

    this.reportesService.createReporte(formData).subscribe(
      res => {
        Swal.fire({
          title: 'Reporte enviado!',
          text: 'Hemos recibido tu reporte del problema',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
        
      },
      err => {
        Swal.fire({
          title: 'Oh no!',
          text: 'Ocurrio un problema enviando tu reporte',
          icon: 'error',
          confirmButtonText: 'Ok'
        });

        console.error(err);
      }
    );
   }
}
