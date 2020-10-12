# Load the alpine base image
FROM alpine:3.7

# Install depedencies
RUN apk update && apk add -U nodejs=10.19.0-suffix yarn=1.22.0-suffix
RUN node --version
RUN yarn --version

# Create the working directory
RUN mkdir -p /var/www/api

# Copy project files into the working directory
COPY . /var/www/api/

# Run npm install to download all the project dependencies
RUN cd /var/www/api && yarn

# Set the working directory to the created directory
WORKDIR /var/www/api

# Expose a port and start the server (you may need to change the name here to match your server file)
EXPOSE 3000
CMD ["node", "server.js"]