FROM mysql:8.4

# DB data backup, unpucks itself automaticly (https://docs.docker.com/engine/reference/builder/#add)
ADD entrypoint/* docker-entrypoint-initdb.d/

# Timezone settings
ENV TZ=Europe/Kyiv
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone