import TareaDTO from "../dtos/tarea-dto";
import Tarea from "../models/tarea";

export const tareas = function (req: any, res: any) {
  return Tarea.findAll()
    .then((tareas) => {
      res.status(200).send(
        JSON.stringify(
          tareas.map(
            (tarea: any) =>
              ({
                id: tarea.id,
                fecha_generada: tarea.fecha_generada,
                descripcion: tarea.descripcion,
                realizada: tarea.realizada,
                fecha_planificada: tarea.fecha_planificada,
                id_sala: tarea.id_sala,
                id_personal: tarea.id_personal,
              } as TareaDTO)
          )
        )
      );
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};
