import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})

export class HighlightPipe implements PipeTransform {
  transform(value: string, args: string): string {
    if (!args) {return value;}
    args = args.trim();
    args = args.replace(/^[^\w]+/, "");
    args = args.replace(/[^\w]+$/, "");
    const re = new RegExp(args, 'gi');
    return value.replace(re, "<mark>$&</mark>");
  }
}