import { TCoordinate, zCoordinate } from "../../types";

export const createCoordinateID = <
  TX extends TCoordinate["x"],
  TY extends TCoordinate["y"],
>(coordinate: {
  x: TX;
  y: TY;
}): `${TX}:${TY}` => {
  const { x, y } = zCoordinate.parse(coordinate);
  return `${x}:${y}` as `${TX}:${TY}`;
};
