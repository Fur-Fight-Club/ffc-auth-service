import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from "express";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Fur Fight Club — Authentication service")
    .setDescription("Swagger of the authentication service of Fur Fight Club")
    .setVersion("1.0")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      name: "x-service-auth",
      description: "Bearer authorization token for service authentication",
      in: "header",
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>("app_port");

  app.use(express.json());

  await app.listen(port);

  console.log(
    `Application ${configService.get<string>(
      "service"
    )} is running on: ${await app.getUrl()}`
  );
}

bootstrap();
