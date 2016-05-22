FROM node:argon

RUN git clone https://github.com/iAndrewTe/Micro_Blog.git

RUN cat Micro_Blog/server.js

RUN cat Micro_Blog/package.json

WORKDIR Micro_Blog/app

RUN ls . 

RUN npm install -g bower
 
RUN bower install --allow-root

WORKDIR ..

RUN npm install

EXPOSE 4000

CMD ["npm", "start"]
