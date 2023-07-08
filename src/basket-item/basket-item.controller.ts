import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {CreateBasketItemDto} from "./dto/create-basket-item.dto";
import {BasketItemService} from "./basket-item.service";

@Controller('basket-item')
export class BasketItemController {

  constructor(private basketItemService: BasketItemService) {
  }

  @Post('')
  create(@Body() dto: CreateBasketItemDto) {
    return this.basketItemService.create(dto)
  }

  @Get('/by-basket-token/:token')
  getAllByBasketToken(@Param('token') token: string) {
    return this.basketItemService.getAllByBasketToken(token)
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.basketItemService.delete(id)
  }
}
