import { z } from "zod";

export const zCoordinate = z.object({
  x: z.number().int(),
  y: z.number().int(),
});

export const zCoordinateID =
  z.custom<`${TCoordinate["x"]}:${TCoordinate["y"]}`>(
    (val) => typeof val === "string" && /^-?\d+:-?\d+$/.test(val),
  );

export type TCoordinate = z.infer<typeof zCoordinate>;
export type TCoordinateID = z.infer<typeof zCoordinateID>;
