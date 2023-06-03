# використання остінньої версії Node.js на етапі збірки
FROM node:latest as build
# указання робочої директорії у Linux контейнері
WORKDIR /usr/src/app
# копіювання файлів з описом залежностей проектку
COPY package.json package-lock.json ./
# встановлення залежностей у контейнері
RUN npm install
# копіювання похідних фалів у контейнер
COPY . .
# виконання команди збірки проекту
RUN npm run build
# використання Nginx для запуску веб-сереру
FROM nginx:latest
# копіювання файлу конфігурації веб-серверу до контейнеру
COPY nginx.conf /etc/nginx/nginx.conf
# копіювання збірки проекту у директорію зфалами веб-серверу
COPY --from=build /usr/src/app/dist/app-ui /usr/share/nginx/html