import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  /* eslint-disable */
  // @ts-ignore
  BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
  };

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  // process.env.PORT
}
bootstrap();
