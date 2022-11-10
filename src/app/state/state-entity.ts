import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StateEntities<T> {
  [id: string]: T;
}

export interface EntityState<T> {
  ids: string[] | [];
  entities: StateEntities<T> | {};
}

interface Identifiable {
  id: string | number;
}

export function arrayToEntity<T extends Identifiable>() {
  return (source: Observable<T[]>) => {
    return source.pipe(
      map((array: T[]) => {
        const entities: any = {};
        const ids: any[] = [];
        array.forEach((item) => {
          entities[item.id] = item;
          ids.push(item.id);
        });
        return { ids, entities };
      }),
    );
  };
}

export function arrayToKeyValue(arr: any[], key: string) {
  const entities: any = {};
  arr.forEach((item) => {
    entities[item[key]] = item;
  });
  return entities;
}
