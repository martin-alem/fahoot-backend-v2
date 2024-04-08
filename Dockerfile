# Use an official Node.js runtime as a parent image
FROM node:20.11.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) into the working directory
COPY package*.json ./

# Install any dependencies
RUN npm install

# If you are building your code for production
RUN npm ci --only=production

# Bundle app source inside the Docker image
COPY . .

# Build the application
RUN npm run build

# Your application binds to port 3000 by default, expose it
EXPOSE 8080

# Define the command to run your app using CMD which defines your runtime
CMD ["node", "dist/main"]
