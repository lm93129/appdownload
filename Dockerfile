FROM dockerhub.azk8s.cn/library/node:10.15 AS builder
WORKDIR /app
COPY . /app
RUN npm config set registry https://registry.npm.taobao.org && npm --verbose install
RUN cd /app && npm run build:prod

FROM dockerhub.azk8s.cn/library/nginx:1.17.0-alpine-perl
RUN rm /etc/nginx/conf.d/default.conf
ADD default.conf /etc/nginx/conf.d/
COPY --from=builder /app/dist/ /usr/share/nginx/html/
