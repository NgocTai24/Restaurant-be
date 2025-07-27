import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TransformInterceptor } from './core/transform.interceptor';
import { RolesModule } from './modules/roles/roles.module';
import { TablesModule } from './modules/tables/tables.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { MenuItemsModule } from './modules/menu-items/menu-items.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { CustomersModule } from './modules/customers/customers.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { UsersModule } from '@/modules/users/users.module';
import { OrdersModule } from '@/modules/orders/orders.module';
import { SubcategoryModule } from './modules/subcategory/subcategory.module';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    UsersModule,
    MenuItemsModule,
    OrdersModule,
    RolesModule,
    TablesModule,
    CategoriesModule,
    OrderItemsModule,
    BookingsModule,
    CustomersModule,
    StatisticsModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          // ignoreTLS: true,
          // secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],

    }),
    SubcategoryModule,
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
})
export class AppModule { }
