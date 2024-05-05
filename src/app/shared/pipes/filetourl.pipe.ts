import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filetourl'
})
export class FiletourlPipe implements PipeTransform {

  transform(file: File): string {
    return URL.createObjectURL(file);
  }

}
