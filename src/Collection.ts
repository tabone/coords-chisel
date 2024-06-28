import { z } from "zod";
import {
  TCoordinate,
  TCoordinateID,
  zCoordinate,
  zCoordinateID,
} from "./types";
import { createCoordinateFromID, createCoordinateID } from "./utils";

const zCollectionProps = z.object({
  coordinates: z.union([z.array(zCoordinateID), z.array(zCoordinate)]),
});

const zCreateCircleProps = z.object({
  origin: zCoordinate,
  radius: z.number().int(),
});

const zCreateRectangleProps = z.object({
  origin: zCoordinate,
  offsetX: z.number().int(),
  offsetY: z.number().int(),
});

export type TCollectionProps = z.infer<typeof zCollectionProps>;
export type TCreateCircleProps = z.infer<typeof zCreateCircleProps>;
export type TCreateRectangleProps = z.infer<typeof zCreateRectangleProps>;

const isCoordinateID = (
  coordinates: TCollectionProps["coordinates"],
): coordinates is TCoordinateID[] => typeof coordinates[0] === "string";

export class Collection {
  private _coordinates: Set<TCoordinateID>;

  constructor(props: TCollectionProps) {
    const { coordinates } = zCollectionProps.parse(props);

    this._coordinates = new Set(
      isCoordinateID(coordinates)
        ? coordinates
        : coordinates.map(createCoordinateID),
    );
  }

  get coordinateIDs() {
    return [...this._coordinates];
  }

  get coordinates() {
    return this.coordinateIDs.map(createCoordinateFromID);
  }

  add(args: Collection | TCoordinate[] | TCoordinateID[]) {
    const coordinates =
      args instanceof Collection
        ? args.coordinateIDs
        : isCoordinateID(args)
          ? args
          : args.map(createCoordinateID);

    return new Collection({
      coordinates: [...this._coordinates, ...coordinates],
    });
  }

  minus(args: Collection | TCoordinate[] | TCoordinateID[]) {
    const coordinates =
      args instanceof Collection
        ? args.coordinateIDs
        : isCoordinateID(args)
          ? args
          : args.map(createCoordinateID);

    const newCoordinates = this._coordinates;

    coordinates.forEach((coordinate) => newCoordinates.delete(coordinate));

    return new Collection({ coordinates: [...newCoordinates] });
  }

  static createRectangle(props: TCreateRectangleProps) {
    const { origin, offsetX, offsetY } = zCreateRectangleProps.parse(props);

    const coordinateIDs: TCoordinateID[] = [];

    const minCoords = {
      x: origin.x - offsetX,
      y: origin.y - offsetY,
    };

    const maxCoords = {
      x: origin.x + offsetX,
      y: origin.y + offsetY,
    };

    for (let y = minCoords.y; y < maxCoords.y; y++) {
      for (let x = minCoords.x; x < maxCoords.x; x++) {
        coordinateIDs.push(`${x}:${y}`);
      }
    }

    return new Collection({ coordinates: coordinateIDs });
  }

  static createCircle(props: TCreateCircleProps) {
    const { origin, radius } = zCreateCircleProps.parse(props);

    const { coordinateIDs } = Collection.createRectangle({
      origin,
      offsetX: radius,
      offsetY: radius,
    });

    return new Collection({
      coordinates: coordinateIDs.filter((coordinateID) => {
        const { x, y } = createCoordinateFromID(coordinateID);

        return (
          Math.sqrt(Math.pow(x - origin.x, 2) + Math.pow(y - origin.y, 2)) <=
          radius
        );
      }),
    });
  }
}
