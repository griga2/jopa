import { Body, Controller, Get, Post,
  UploadedFile,
  UseInterceptors, } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { json } from 'express';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("/jopacontr")
  Jopa(@Body() Body) {
    // const Bodytest = `{"RecordSet":[{}]}`;
    return this.appService.AddCont(Body)
  }

  @Post("/jopabarcode")
  arcodeJo(@Body() Body) {
    const Bodytest = `{"RecordSet":[{}]}`;
    return this.appService.AddBarcode(Body)
  }

  @Post("/jopaplu")
  arcodeJopa(@Body() Body) {
    const Bodytest = `{"RecordSet":[{}]}`;
    return this.appService.AddPlu(Body);
  }

  @Post('/repiatjson')
  @UseInterceptors(FileInterceptor('file'))
  JsonRebuld( @UploadedFile() file: any) {
    let str:string = file.buffer.toString('utf8');
    const isNumeric = n => !isNaN(n);
    
    let  a = JSON.parse(str.replace(str.charAt(0),''));
    console.log(str);
    for (let i = 1; i < str.length-1; i++) {
      if (isNumeric(str.charAt(i--)) && isNumeric(str.charAt(i++))) {
        str.replace(str.charAt(i--) + ','+ isNumeric(str.charAt(i++)),str.charAt(i--) + '.'+ isNumeric(str.charAt(i++)))
        console.log(str.substring(i--,i++));
      }
      console.log(i);
    } 
  }
}
