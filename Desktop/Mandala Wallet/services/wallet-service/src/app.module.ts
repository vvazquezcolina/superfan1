import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { BalanceModule } from './balance/balance.module';
import { PaymentModule } from './payment/payment.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    
    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100  // 100 requests per minute
    }]),
    
    // Scheduled tasks
    ScheduleModule.forRoot(),
    
    // Database
    DatabaseModule,
    
    // Authentication
    AuthModule,
    
    // Core modules
    WalletModule,
    TransactionModule,
    BalanceModule,
    PaymentModule
  ]
})
export class AppModule {} 