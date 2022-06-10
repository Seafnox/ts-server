import { writeFileSync, mkdirSync, existsSync } from 'fs';
import * as path from 'path';
import { createCertificate, config } from 'pem';

config({
    pathOpenSSL: 'C:\\Program Files\\Git\\usr\\bin\\openssl.exe'
});

createCertificate({ selfSigned: true }, function (err, keys) {
    if (err) {
        throw err;
    }

    const { csr, clientKey, serviceKey, certificate } = keys;
    const certPath = path.join(__filename, '../certificates');

    console.log('GENERATED');
    console.log(__filename);
    console.log(certPath);

    if (!existsSync(certPath)) {
        mkdirSync(certPath);
    }
    writeFileSync(path.join(certPath, 'csr.pem'), csr);
    writeFileSync(path.join(certPath, 'clientKey.pem'), clientKey);
    writeFileSync(path.join(certPath, 'serviceKey.pem'), serviceKey);
    writeFileSync(path.join(certPath, 'certificate.pem'), certificate);
});
