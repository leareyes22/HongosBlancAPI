export default interface CreateCosechaDTO {
  fecha_cosechada: Date;
  id_producto: number;
  kg_cosechados: number;
  observaciones: string;
  id_sala: number;
  id_personal: number;
  id_turno: number;
}

export default interface CosechaDTO {
  id: number;
  fecha_cosechada: Date;
  producto: string;
  kg_cosechados: number;
  observaciones: string;
  sala: string;
  personal: string;
  turno: string;
}

export interface GroupCantCosechasDTO {
  turnos: Array<string>;
  cant_cosechas: Array<number>;
}

export interface GroupCosechasPorProductoDTO {
  productos: Array<string>;
  porcentajes: Array<number>;
}

export interface GroupCosechasKgDTO {
  meses: Array<string>;
  totales_kg: Array<number>;
}
