FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --production

# Bundle app source
COPY . .

# Open port 3000
EXPOSE 3000

RUN npm install -g pm2

# Run command "npm start"
CMD [ "pm2-runtime", "start", "ecosystem.config.js", "--env", "production" ]
