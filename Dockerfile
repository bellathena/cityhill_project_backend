FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# ก็อปปี้ไฟล์ที่จำเป็นก่อน
COPY package*.json ./
COPY prisma ./prisma 

RUN npm install
# Generate Prisma Client ทันทีหลัง install dependencies
RUN npx prisma generate

COPY . .

EXPOSE 3000

# ถ้าโปรเจกต์คุณต้องมีการ migrate DB อัตโนมัติ อาจจะใช้คำสั่งนี้รันตอนเริ่ม
CMD ["npm",  "start"]