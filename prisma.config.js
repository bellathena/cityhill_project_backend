import { defineConfig } from "prisma/config";
import { env } from "process";
export default defineConfig({
    schema: "./prisma/schema.prisma",
    out: "./src/generated/prisma",
    datasource: {
        url : env("DATABASE_URL")
    }
})