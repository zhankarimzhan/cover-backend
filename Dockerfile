FROM node:18

WORKDIR /app

# Установим Nodemon глобально
RUN npm install -g nodemon ts-node typescript

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
