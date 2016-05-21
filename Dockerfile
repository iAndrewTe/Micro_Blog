FROM node:argon

RUN git clone https://github.com/iAndrewTe/Micro_Blog.git

WORKDIR /Micro_Blog

ADD package.json /Micro_Blog/package.json

RUN npm install

EXPOSE 4000

CMD ["npm", "start"]
