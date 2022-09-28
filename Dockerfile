FROM node:18

ENV DATABASE_URL="mysql://root@localhost:3306/adminportal"
ENV secretOrKey="asdfasdf"

WORKDIR /usr/app/client/

COPY ./package.json .

RUN npm install

COPY . .

RUN npx prisma generate 

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]