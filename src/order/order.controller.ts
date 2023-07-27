import {Body, Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import {OrderService} from "./order.service";
import {CreatePaymentDto} from "./dto/create-payment.dto";
import {AuthGuard} from "../auth/auth.guard";

@Controller('order')
export class OrderController {

  constructor(private orderService: OrderService) {
  }

  @Post('/create-payment')
  createPayment(@Body() dto: CreatePaymentDto) {
    return this.orderService.createPayment(dto)
  }

  @UseGuards(AuthGuard)
  @Get('/')
  getAll() {
    return this.orderService.getAll()
  }

  @UseGuards(AuthGuard)
  @Get('/by-id/:id')
  getOneById(@Param('id') id: number) {
    return this.orderService.getOneById(id)
  }

  @Get('/by-token/:token')
  getOneByToken(@Param('token') token: string) {
    return this.orderService.getOneByToken(token)
  }

  @Get('/by-number/:number')
  getOneByNumber(@Param('number') number: string) {
    return this.orderService.getOneByNumber(number)
  }

  @Get('/check-order-for-pay/:token')
  checkOrderForPay(@Param('token') token: string) {
    return this.orderService.checkOrderForPay(token)
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.orderService.delete(id)
  }
}
