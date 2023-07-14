import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import {FileFieldsInterceptor, FileInterceptor} from "@nestjs/platform-express";
import { ChangeBookDto } from "./dto/change-book.dto";
import { GetBookFiltersDto } from "./dto/get-book-filters.dto";
import {Response} from "express";

@Controller('book')
export class BookController {

  constructor(private bookService: BookService) {
  }

  @Post('/')
  @UseInterceptors(FileFieldsInterceptor([
    { name: "image", maxCount: 1 },
    { name: "file_pdf", maxCount: 1 },
    { name: "file_epb", maxCount: 1 },
  ]))
  create(@UploadedFiles() files, @Body() dto: CreateBookDto) {
    const {image, file_pdf, file_epb} = files
    return this.bookService.create(dto, image[0], file_pdf[0], file_epb[0])
  }

  @Post('/change-book')
  @UseInterceptors(FileInterceptor, FileInterceptor, FileInterceptor)
  changeBook(@UploadedFile() image, @UploadedFile() file_pdf,
         @UploadedFile() file_epb, @Body() dto: ChangeBookDto) {
    return this.bookService.changeBook(dto, image[0], file_pdf[0], file_epb[0])
  }

  @Get('/by-token/:token')
  getBookById(@Param('token') token: string) {
    return this.bookService.getOne(token)
  }

  @Get('/all-books')
  getAllBooks() {
    return this.bookService.getAll()
  }

  @Get('/prices')
  getPrices() {
    return this.bookService.getPrices()
  }

  @Get('/last-book')
  getLastBook() {
    return this.bookService.getLastBook()
  }

  @Get('/by-ids-array/:array')
  getBookByIds(@Param('array') array: string) {
    return this.bookService.getBookByIds(array)
  }

  @Get('/by-order-id/:id')
  getBooksByOrderId(@Param('id') id: number) {
    return this.bookService.getBookByOrderId(id)
  }

  @Get('/download-book/')
  downloadBook(@Query('filename') name: string, @Query('type') type: string, @Res() res: Response) {
    return this.bookService.downloadBookFile(name, type, res)
  }

  @Post('/by-filter')
  getBookByFilter(@Body() dto: GetBookFiltersDto) {
    return this.bookService.getAllByFilterPage(dto)
  }

  @Post('/delete/:id')
  deleteBook(@Param('id') id: number) {
    return this.bookService.deleteBook(id)
  }
}
