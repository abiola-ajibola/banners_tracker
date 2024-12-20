# Use the official Node.js node:22-alpine image as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy the application code
COPY . . 

# Command to run the application
CMD ["node", "backend/app/bundle.js"]