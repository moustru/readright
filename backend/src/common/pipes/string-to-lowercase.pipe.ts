import { Injectable, type PipeTransform } from '@nestjs/common';

@Injectable()
export class StringToLowercasePipe implements PipeTransform {
  transform(value: string) {
    return value.toLowerCase();
  }
}
