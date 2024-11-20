FROM node:18-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    build-essential && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY front/package*.json ./

RUN npm install -g npm@10.9.0
RUN npm install

COPY front/ .

RUN npm run build

EXPOSE 5173

CMD ["npm", "start"]
