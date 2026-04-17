FROM node:20-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm@10.33.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/
COPY packages/db/package.json packages/db/
COPY packages/shared/package.json packages/shared/

RUN pnpm install --frozen-lockfile

COPY . .

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

RUN pnpm --dir packages/db exec prisma generate --schema prisma/schema.prisma

RUN pnpm --filter @final/db build  
RUN pnpm --filter @final/shared build
RUN pnpm --filter @final/backend build

WORKDIR /usr/src/app/apps/backend

EXPOSE 3030

CMD ["sh", "-c", "pnpm --dir ../../packages/db exec prisma migrate deploy --schema prisma/schema.prisma && node dist/app.js"]