# Use Node base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose port from env or fallback
EXPOSE 3001

# Run app
CMD ["npm", "run", "dev"]
