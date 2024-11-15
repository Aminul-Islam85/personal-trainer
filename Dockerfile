# Stage 1: Build the Vite application
FROM node:18.16.1 as build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the application with a static server
FROM node:18.16.1

WORKDIR /usr/src/app

RUN npm install -g serve

# Update the copy path to match Vite's output directory
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
