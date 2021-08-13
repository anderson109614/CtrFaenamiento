import { Component, Inject, OnInit } from '@angular/core';
//import { UrlSegment } from '@angular/router';
import {UsuariosService} from '../../servicios/usuarios.service';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import {EncriptadoService} from '../../servicios/encriptado.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService,private usrSer:UsuariosService,  public router: Router,private encriSer:EncriptadoService) { }

  ngOnInit(): void {
  }
  clickLogin(){
    var usuario =(<HTMLInputElement>(document.getElementById('txtUsuario'))).value;
    var contraseña =(<HTMLInputElement>(document.getElementById('txtPassword'))).value;
    var txtmensaje =(<HTMLDivElement>(document.getElementById('txtMensaje')));
    this.usrSer.login(usuario,contraseña).subscribe(
      async res => {
        if(res.estado){

          
          console.log('user decrip',this.encriSer.desencriptar(res.user,false));
          this.storage.set('Usuario',this.encriSer.desencriptar(res.user,false)[0]);
          
          this.router.navigateByUrl('/home');
        }else{
          txtmensaje.innerHTML=res.mensaje;
          //console.log('malll');
        }

      },
      err => {
        console.log('mal',err);
        txtmensaje.innerHTML="No se pudo ingresar!!!";
        
      }
    );
  }

}
