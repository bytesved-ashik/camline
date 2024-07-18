# Base image
FROM node:18.14.2-alpine

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

#Restore mongo backup
#RUN unzip mongobackup.zip
#RUN mongorestore --host=mongo --port=27017 -u admin -p passwordstrong1 ./dump/

# Install app dependencies
RUN yarn install

CMD [ "yarn", "dev" ]