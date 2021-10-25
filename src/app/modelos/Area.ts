import {Persona} from './Persona'; 
export interface Area {
    IdArea: string
    , Codigo: string
    , Provincia: string
    , Canton: string
    , Parroquia: string
    , Direccion: string
    , CodPredial: string
    , Descripcion: string
    ,IdPropietario:string
    ,Propietario:Persona
}
/*
Canton: "Tisaleo"
CodPredial: "ND"
Codigo: "24-0180-01177-00160292"
Descripcion: "Centro de Faenamiento N.T"
Direccion: "ND"
IdArea: 6
IdPropietario: 9
Parroquia: "Tisaleo"
Propietario:
Cedula: "1802130698"
IdPersona: 9
Nombres: "FAUSTO EDUARDO"
[[Prototype]]: Object
Provincia: "Tungurahua"


*/
