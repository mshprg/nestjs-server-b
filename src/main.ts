import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";


const start = async function() {
    try {
        const PORT = process.env.PORT || 5000
        const app = await NestFactory.create(AppModule)

        app.enableCors(
            {
                origin: true,
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
                credentials: true,
            }
        )

        await app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()