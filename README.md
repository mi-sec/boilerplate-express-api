# boilerplate-express-api

### `installation`

- Local setup:
    - NodeJS `v10.x`
    - PM2 `v3.x`

Run in development:

```
git clone https://github.com/Parellin-Technologies-LLC/boilerplate-express-api
cd boilerplate-express-api
npm i
npm run dev
```

Application should run on `localhost:3000` by default

Run in production with `elasticsearch` and `kibana` visualization:
```
git clone https://github.com/Parellin-Technologies-LLC/boilerplate-express-api
cd boilerplate-express-api
docker-compose up
```

Create SSL Certs for NGINX:
```
openssl genrsa -out server-key.pem 2048
openssl req -new -subj '/CN=localhost/O=LocalHost/C=US' -sha256 -days 365 -nodes -x509 -key server-key.pem -out server-csr.pem

openssl x509 -req -in server-csr.pem -signkey server-key.pem -out server-cert.pem

# Specify Diffie-Hellman Perfect Forward Secrecy
openssl dhparam -outform PEM -out dhparam.pem 2048

openssl pkcs12 -inkey server.key -in server.crt -export -out certificate.p12
```
