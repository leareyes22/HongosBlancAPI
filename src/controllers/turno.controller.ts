import TurnoDTO from "../dtos/turno-dto";
import Turno from "../models/turno";

export const turnos = function (req: any, res: any) {
  return Turno.findAll()
    .then((turnos) => {
      res.status(200).send(
        JSON.stringify(
          turnos.map(
            (turno: any) =>
              ({
                id: turno.id,
                nombre: turno.nombre,
                descripcion: turno.descripcion,
              } as TurnoDTO)
          )
        )
      );
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};
