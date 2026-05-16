FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
ARG VITE_BACKEND_URL=http://192.168.0.104:5000
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npx", "vite", "--host"]
