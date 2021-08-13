import {Detalle} from './Detalle';
import {Area} from './Area';
import {Persona} from './Persona';
import {Vehiculo} from './Vehiculo';
import {Usuario} from './Usuario';
import {Fecha} from './fecha';
export interface Guia {
    IdGia:string
    ,Numero: string
    ,TipoEmision: string
    ,FechaEmision: Fecha
    ,FechaInicio: Fecha
    ,FechaFinaliza: Fecha
    ,Ruta: string
    ,AreaOrigen: Area
    ,AreaDestino: Area
    ,LugarOrigen: string
    ,PersonaAutorizada: Persona
    ,TotalProductos: number    
    ,Vehiculo: Vehiculo
    ,listaDetalles:Detalle[]
    ,Usuario:Usuario
    
    
}