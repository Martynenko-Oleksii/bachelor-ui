import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'translateDate'
})
export class TranslateDatePipe implements PipeTransform {

  constructor(private translate: TranslateService) { }

  transform(value: Date, format = 'medium'): string | null {
    const lang = this.translate.currentLang || 'en-US';

    let date = new Date(value);
    let time = date.getTime();
    let timezoneOffset = new Date().getTimezoneOffset();
    let final = time + (-1) * (timezoneOffset * 60000);
    value = new Date(final);

    let datePipe: DatePipe;
    if (lang === 'uk-UA') {
      datePipe = new DatePipe('uk');
    } else {
      datePipe = new DatePipe(lang);
    }

    return datePipe.transform(value, format);
  }

}
