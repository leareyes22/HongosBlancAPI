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
