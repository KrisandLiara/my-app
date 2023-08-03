# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory in the Docker container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install the application dependencies inside the Docker container
RUN node -v && npm -v
RUN npm install
RUN npm run build
# Bundle the application source inside the Docker container
COPY . .

# Make port 80 available outside this Docker container
EXPOSE 80

# Run the application when the Docker container is started
CMD [ "npm", "start" ]
