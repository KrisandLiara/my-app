# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory in the Docker container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install the application dependencies inside the Docker container
RUN node -v && npm -v
RUN npm install

# Copy the 'public' and 'src' directories into the Docker image
COPY public ./public
COPY src ./src

# Build the application
RUN npm run build

# Copy the remaining files into the Docker image
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80

# Make port 80 available outside this Docker container
EXPOSE 80

# Run the application when the Docker container is started
CMD [ "npm", "start" ]
