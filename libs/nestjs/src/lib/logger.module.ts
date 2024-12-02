import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {LoggerModule as PinoLoggerModule} from 'nestjs-pino';   

@Module({
    imports: [
        PinoLoggerModule.forRootAsync({
            inject: [ConfigService],
           useFactory: (configService: ConfigService)=>{
            const isProduction = configService.get('NODE_ENV') === 'production';

            return {
                pinoHttp: {
                    transport: isProduction ? undefined : {
                        target: 'pino-pretty',
                        options: {
                            singleLine: 1
                        }
                    },
                    level: isProduction ? 'info' : 'debug',
                    redact: {
                        paths: ['req.headers.authorization']
                    }
            },
           }
        }})
    ],
    providers: [],
    exports: []
})
export class LoggerModule{

}