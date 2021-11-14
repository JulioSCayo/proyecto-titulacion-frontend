import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ruta-automatica',
  templateUrl: './ruta-automatica.component.html',
  styleUrls: ['./ruta-automatica.component.css']
})
export class RutaAutomaticaComponent implements OnInit {

  toggleDesactivarMapa: boolean = true;
  toggleCrearRuta: boolean = true;
  toggleFormRuta: boolean = false;
  toggleBotonDetallesRuta: boolean = false;
  toggleBotonTerminarRuta: boolean = false;
  toggleDetallesRuta: boolean = false;
  toggleSaltarReporte: boolean = false;
  toggleTerminarRuta: boolean = false;
  toggleOtraInstitucion: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.mapa();
  }

  mapa() {
    // COORDENADAS DEL USUARIO PARA CENTRAR EL MAPA
    let longitud: number;
    let latitud: number;

    // CONSEGUIR COORDENADAS DEL USUARIO
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

    // SE CARGA EL MAPA CENTRADO EN LA UBICACION DEL USUARIO
    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById("mapa")!, {
        center: { lat: latitud, lng: longitud},
        disableDefaultUI: true,
        zoomControl: true,
        zoom: 15,
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
    });
  }

  formRuta() {
    this.toggleCrearRuta = false;
    this.toggleFormRuta = true;
  }

  crearRuta() {
    this.toggleFormRuta = false;
    this.toggleDesactivarMapa = false;
    this.toggleBotonDetallesRuta = true;
    this.toggleBotonTerminarRuta = true;
  }

  detallesRuta() {
    this.toggleBotonDetallesRuta = false;
    this.toggleBotonTerminarRuta = false;
    this.toggleDetallesRuta = true;
  }

  terminarRuta() {
    this.toggleDesactivarMapa = true;
    this.toggleBotonDetallesRuta = false;
    this.toggleBotonTerminarRuta = false;
    this.toggleTerminarRuta = true;
  }

  cambioSolucionado() {
    Swal.fire({
      title: 'Reporte solucionado?',
      text: "Se cambiará el estado del reporte a solucionado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    });
  }

  cambioDenegado() {
    Swal.fire({
      title: 'Reporte denegado?',
      text: "Se cambiará el estado del reporte a denegado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    });
  }

  refuerzos() {
    Swal.fire({
      title: 'Pedir refuerzos?',
      text: "Se solicitará la ayuda de otra cuadrilla",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'Cancelar'
    });
  }
}
