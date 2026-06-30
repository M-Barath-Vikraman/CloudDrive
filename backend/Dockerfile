# Step 1: Use the official lightweight Node.js 22 Alpine LTS base image
FROM node:22-alpine

# Step 2: Set the execution environment to production
ENV NODE_ENV=production

# Step 3: Create and set the working directory inside the container
WORKDIR /usr/src/app

# Step 4: Copy package configurations first to maximize Docker layer caching
COPY package*.json ./

# Step 5: Install only production dependencies securely and cleanly
RUN npm ci --only=production && npm cache clean --force

# Step 6: Copy the remaining source files into the container
COPY . .

# Step 7: Expose port 5000 for the Express backend
EXPOSE 5000

# Step 8: Run the container process as the default non-root node user for security
USER node

# Step 9: Start the application directly using Node to avoid npm wrapper process overhead
CMD ["node", "server.js"]
