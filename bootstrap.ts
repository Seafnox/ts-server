import { $log } from '@tsed/common';
import { PlatformExpress } from '@tsed/platform-express';
import { readFileSync } from 'fs';
import { ServerOptions } from 'https';
import * as path from 'path';
import { ImageHelper } from './helper/image/image.helper';
import { Server } from './server/server';

async function bootstrap(): Promise<void> {
    try {
        $log.debug('Start server...');
        const certPath = path.join(__dirname, 'server', 'certificates');
        const platform = await PlatformExpress.bootstrap(Server, {
            rootDir: __dirname,
            // httpPort: 'localhost:8080',
            httpsPort: 'localhost:8000',
            httpsOptions: {
                key: readFileSync(path.join(certPath, 'clientKey.pem')),
                cert: readFileSync(path.join(certPath, 'certificate.pem')),
            } as ServerOptions,
            uploadDir: `./uploads`,
            acceptMimes: ['application/json'],
            statics: {
                [ImageHelper.staticFilePath]: ImageHelper.relativeFilePath,
            },
            swagger: [{
                path: '/api-docs',
            }],
            typeorm: [{
                name: 'default',
                type: 'sqljs',
                autoSave: true,
                location: `./db/dump.sqlite`,
                entities: [`./models/**/*.ts`],
                synchronize: true,
            }],
        });

        await platform.listen();
        $log.debug('Server initialized');
    } catch (er) {
        $log.error(er);
    }
}

bootstrap();
