# Load the alpine base image
FROM node:alpine

# Set the working directory to the created directory
WORKDIR /var/www/api

COPY package.json .
COPY package-lock.json .
# Install depedencies
RUN npm install

COPY . .


# Expose a port and start the server (you may need to change the name here to match your server file)
EXPOSE 3000
CMD ["node", "server.js"]