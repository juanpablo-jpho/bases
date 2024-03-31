import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'short'
})
export class ShortPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    console.log('args -> ', args);
    return null;
  }

}
