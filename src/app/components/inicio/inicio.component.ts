import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http'
import { Router } from "@angular/router";
import { LoginService } from '../../services/login/login.service'
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  noCoinciden = false;

  constructor(private loginService: LoginService, private router: Router) { }

  usuario = {
    nombreUsuario: '',
    contrasena: '',
    tipoUsuario: ''
  }

  ngOnInit(): void {
    this.mapa();
  }

  login() {
    this.loginService.ingresar(this.usuario).subscribe(
      res => {
        console.log("usuario valido")
        console.log(res.token)
        console.log(this.usuario);
        localStorage.setItem('token',res.token); // cuando el usuario cierre su sesion debe borrarse esto del localStorage
        localStorage.setItem('tipoUsuario', res.tipoUsuario);

        this.router.navigate(['/mapa-reportes']) 
      },
      err => {
        console.log("usuario NO valido")
        console.error(err);
        this.noCoinciden = true;
      }
      );

  }

  mapa() {
    let latitud: number;
    let longitud: number;

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {

        latitud = position.coords.latitude;
        longitud = position.coords.longitude;
      });
    }

    let loader = new Loader({
      apiKey: ''
    });

    loader.load().then(() => {
      const map = new google.maps.Map(document.getElementById("mapa")!, {
        center: { lat: latitud, lng: longitud},
        zoom: 12,
        disableDefaultUI:true, 
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

      map.addListener("mousedown", () => {
        this.router.navigate(['/informacion/conoce-mas']) 
      });

    });
  }

}