import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'short',
})
export class ShortPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    // console.log('args -> ', args);
    let maxLength = + args[0];
    if (value.length > maxLength) {
      return value.slice(0, maxLength);
    }
    return value;
  }

}
