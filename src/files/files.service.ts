import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from "path"
import * as fs from "fs"
import * as uuid from "uuid"

export enum TypeFile {
  IMAGE = "image",
  BOOK = "book"
}

@Injectable()
export class FilesService {

  async createImageFile(file): Promise<string> {
    const extname = file.originalname.split('.').pop()
    switch (extname) {
      case "jpg":case "png":case "jpeg":case "webp":
        break
      default:
        throw new HttpException('Неверный формат изображения: доступные форматы .jpg, .jpeg, .png, .webp',
          HttpStatus.FORBIDDEN)
    }
    try {
      const fileName = uuid.v4() + '.' + extname
      const filePath = path.resolve(__dirname, '..', 'static', 'image')
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, {recursive: true})
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer)
      return fileName;
    } catch (e) {
      throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async createBookFiles(file_pdf, file_epb): Promise<string> {
    const uid = uuid.v4()
    FilesService.writeBookFile(uid, file_pdf)
    FilesService.writeBookFile(uid, file_epb)
    return uid
  }

  async removeFile(name: string, type: TypeFile) {
    try {
      const filePath = path.resolve(__dirname, '..', 'static', type)
      fs.unlinkSync(path.join(filePath, name))
      return name
    } catch (e) {
      console.log(e)
    }
  }

  async pathForDownloadFile() {
    return path.resolve(__dirname, '..', 'static', TypeFile.BOOK)
  }

  private static writeBookFile(uid, file) {
    const extname = file.originalname.split('.').pop()
    switch (extname) {
      case "epub":
      case "pdf":
        break
      default:
        throw new HttpException('Неверный формат изображения: доступные форматы .epub .pdf',
          HttpStatus.FORBIDDEN)
    }
    const fileName = uid + '.' + extname
    try {
      const filePath = path.resolve(__dirname, '..', 'static', 'book')
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, {recursive: true})
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer)
    } catch (e) {
      console.log(e)
      throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
