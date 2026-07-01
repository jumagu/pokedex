import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { appConfig, validationSchema } from './config/app.config';

@Module({
  imports: [
    // ? https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig], validationSchema }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? ''),
    CommonModule,
    PokemonModule,
    SeedModule,
  ],
})
export class AppModule {}
