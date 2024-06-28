import { TCoordinate, zCoordinateID } from "../../types";

export const createCoordinateFromID = <
  TX extends TCoordinate["x"],
  TY extends TCoordinate["y"],
>(
  coordinateID: `${TX}:${TY}`,
): { x: TX; y: TY } => {
  const [x, y] = zCoordinateID.parse(coordinateID).split(":").map(Number);
  return { x, y } as { x: TX; y: TY };
};
