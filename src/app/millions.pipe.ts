import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millions',
})
export class MillionsPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value.replace(',', '.');
  }

}
