import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {OrderService} from "./order.service";
import {CreateOrderDto} from "./dto/create-order.dto";
import {CreatePaymentDto} from "./dto/create-payment.dto";

@Controller('order')
export class OrderController {

  constructor(private orderService: OrderService) {
  }

  @Post('')
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto)
  }

  @Post('/create-payment')
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.orderService.createPayment(dto)
  }

  @Get('/page/:page')
  getAllPage(@Param('page') page: number) {
    return this.orderService.getAllPage(page)
  }

  @Get('/by-id/:id')
  getOneById(@Param('id') id: number) {
    return this.orderService.getOneById(id)
  }

  @Get('/by-token/:token')
  getOneByToken(@Param('token') token: string) {
    return this.orderService.getOneByToken(token)
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.orderService.delete(id)
  }
}
