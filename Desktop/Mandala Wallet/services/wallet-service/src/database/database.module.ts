import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    PrismaService,
    DatabaseService,
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        // Database connection will be handled by Prisma
        return {
          url: configService.get<string>('DATABASE_URL'),
          ssl: configService.get<string>('NODE_ENV') === 'production'
        };
      },
      inject: [ConfigService]
    }
  ],
  exports: [PrismaService, DatabaseService]
})
export class DatabaseModule {} 