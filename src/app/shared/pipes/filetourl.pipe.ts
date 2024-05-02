import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filetourl'
})
export class FiletourlPipe implements PipeTransform {

  transform(file: File): unknown {
    return URL.createObjectURL(file);;
  }

}
