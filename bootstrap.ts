import { $log } from '@tsed/common';
import { PlatformExpress } from '@tsed/platform-express';
import { ImageHelper } from './helper/image/image.helper';
import { Server } from './server/server';

async function bootstrap(): Promise<void> {
    try {
        $log.debug('Start server...');
        const platform = await PlatformExpress.bootstrap(Server, {
            rootDir: __dirname,
            httpPort: 'localhost:8080',
            httpsPort: 'localhost:8000',
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
