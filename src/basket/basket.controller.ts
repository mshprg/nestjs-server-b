import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {BasketService} from "./basket.service";

@Controller('basket')
export class BasketController {

  constructor(private basketService: BasketService) {
  }

  @Post('')
  create(@Body() data: any) {
    return this.basketService.create(data.token)
  }

  @Delete('')
  deleteOldBasket() {
    return this.basketService.deleteOld()
  }

  @Get('/by-token/:token')
  getOneByToken(@Param('token') token: string) {
    return this.basketService.getOneByToken(token)
  }
}
