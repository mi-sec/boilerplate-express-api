# boilerplate-express-api

### `installation`

- Local setup:
    - NodeJS `v8.8.1`
    - NPM `v5.5.1`
    - PM2 `v2.7.2`

```$xslt
git clone https://github.com/Parellin-Technologies-LLC/boilerplate-express-api
cd boilerplate-express-api
npm i
npm start
```

Application should run on `localhost:8080` by default

Additional commands:

- `npm start` - Starts `process.json` with PM2
- `npm stop` - Stops PM2 application
- `npm run reload` - Reloads code changes
- `npm run restart` - Restarts application and session data
- `npm run delete` - Deletes PM2 application


Create SSL Certs:
```
openssl genrsa -out server-key.pem 2048
openssl req -new -subj '/CN=localhost/O=LocalHost/C=US' -sha256 -days 365 -nodes -x509 -key server-key.pem -out server-csr.pem

openssl x509 -req -in server-csr.pem -signkey server-key.pem -out server-cert.pem

# Specify Diffie-Hellman Perfect Forward Secrecy
openssl dhparam -outform PEM -out dhparam.pem 2048

openssl pkcs12 -inkey server.key -in server.crt -export -out certificate.p12
```
