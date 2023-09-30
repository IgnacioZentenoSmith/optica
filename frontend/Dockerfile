FROM node:16
# make the 'app' folder the current working directory
WORKDIR /frontend
# Copy the package.json and package-lock.json files from the frontend directory
COPY frontend/package*.json ./
# Copy the rest of the application files to the container
COPY . .
# Change dir into frontend
WORKDIR /frontend/frontend
# Install project dependencies
RUN npm install
# Build project
RUN npm run build
# Up the project
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
