import { flatten } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-mapa-reportes',
  templateUrl: './mapa-reportes.component.html',
  styleUrls: ['./mapa-reportes.component.css']
})
export class MapaReportesComponent implements OnInit {

  toggleReportar: boolean = false;
  toggleDesactivarMapa: boolean = false;
  toggleShowBotonReportar: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.mapa();
  }

  mapa() {
    let longitud: number;
    let latitud: number;

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;
      }, function(err){
        console.error(err);
      }, {enableHighAccuracy: true});
    }

    let loader = new Loader({
      // apiKey: 'AIzaSyAYN-jmRSHPR78rT0l1na0XchXlJT7_sDw'
      apiKey: ''
    });

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

      // const buscador = <HTMLInputElement>document.getElementById("buscador")!;
      // const buscar = new google.maps.places.Autocomplete(buscador);
      // buscar.bindTo("bounds", map);

      

      const markerDefault = "red"
      const markerColor1 = "#3FABCB";
      const markerColor2 = "#75441D";
      const markerColor3 = "#ADD82B";
      const markerColor4 = "#FF6A14";
      const markerColor5 = "#FFF62B";

      let newMarker: google.maps.Marker[] = [];





      google.maps.event.addListener(map, "click", (event: any) => {
        let boton = document.getElementById('boton')
        
        if(newMarker.length > 0) {
          newMarker[0].setMap(null);
          newMarker = [];
        }

        const addMarker = new google.maps.Marker({
          position: event.latLng,
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
          this.reportar();
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

      const icon2 = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: markerColor2,
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30)
      };

      const icon3 = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: markerColor3,
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30)
      };

      const icon4 = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: markerColor4,
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30)
      };

      const icon5 = {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: markerColor5,
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 0,
        scale: 2,
        anchor: new google.maps.Point(15, 30)
      };





      const marker1 = new google.maps.Marker({
        position: { lat: latitud, lng: longitud},
        map,
        title: "Marker 1!",
        optimized: true,
        icon: icon1,
        draggable: true
      });

      const marker2 = new google.maps.Marker({
        position: { lat: latitud + .05, lng: longitud},
        map,
        title: "Marker 2!",
        optimized: true,
        icon: icon2
      });

      const marker3 = new google.maps.Marker({
        position: { lat: latitud - .05, lng: longitud},
        map,
        title: "Marker 3!",
        optimized: true,
        icon: icon3
      });

      const marker4 = new google.maps.Marker({
        position: { lat: latitud, lng: longitud + .05},
        map,
        title: "Marker 4!",
        optimized: true,
        icon: icon4
      });

      const marker5 = new google.maps.Marker({
        position: { lat: latitud, lng: longitud - .05},
        map,
        title: "Marker 5!",
        optimized: true,
        icon: icon5
      });





      const infoWindow = new google.maps.InfoWindow();

      marker1.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(marker1.getTitle());
        infoWindow.open(marker1.getMap(), marker1);
      });

      marker2.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(marker2.getTitle());
        infoWindow.open(marker2.getMap(), marker2);
      });

      marker3.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(marker3.getTitle());
        infoWindow.open(marker3.getMap(), marker3);
      });

      marker4.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(marker4.getTitle());
        infoWindow.open(marker4.getMap(), marker4);
      });

      marker5.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(marker5.getTitle());
        infoWindow.open(marker5.getMap(), marker5);
      });

    });
  }

  reportar() {
    this.toggleReportar = true;
    this.toggleDesactivarMapa = true;
  }
}
