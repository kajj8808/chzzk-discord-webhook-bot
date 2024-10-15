# Chzzk Discord Webhook

치지직에서 방송 시작시 자동으로 Disocrd Webhook로 메세지를 보내주는 APP입니다.

## 설치

> Hono 4.6 버전으로 만들어진 프로젝트입니다.

```bash
npm install
npx prisma migrate dev --name init
npx prisma db push
npx prisma generate
```

## REST

- /channel
  - [post] /insert {channel_id: string}
  - [get] /:channelId/live

## ENV

- WEBHOOK_URL -> Discord Webhook url
- DATABASE_URL -> DB URL
