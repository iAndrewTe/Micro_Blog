FROM node:argon

RUN git clone https://github.com/iAndrewTe/Micro_Blog.git

WORKDIR Micro_Blog/app

RUN npm install -g bower
 
RUN bower install --allow-root

WORKDIR ..

RUN npm install

EXPOSE 4000

CMD ["npm", "start"]
