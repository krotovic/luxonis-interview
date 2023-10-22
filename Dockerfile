FROM node:21 as builder

WORKDIR /app

ENV PORT=80 \
    RESULTS_COUNT=100 \
    RESULTS_PER_PAGE=10 \
    DB_HOST=localhost \
    DB_PORT=5432 \
    DB_NAME=postgres \
    DB_USER=postgres \
    DB_PASSWORD=postgres

RUN apt update && \
    apt install -y chromium nginx

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
#RUN apt-get update \
#    && apt-get install -y wget gnupg \
#    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
#    && apt-get update \
#    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
#                          nginx \
#                          --no-install-recommends

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE $PORT

COPY nginx.conf /etc/nginx/sites-enabled/default
COPY entrypoint.sh /usr/local/bin/

ENTRYPOINT ["entrypoint.sh"]
