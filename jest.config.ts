import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node", // بيئة تشغيل الاختبارات
  testMatch: ["**/test/**/*.test.ts"], // مسار ملفات الاختبارات
  clearMocks: true, // تنظيف Mocks بعد كل اختبار
  coverageDirectory: "coverage", // مسار ملفات التغطية
  collectCoverage: true, // تفعيل التغطية
  collectCoverageFrom: [
    "src/**/*.ts", // تغطية الملفات في src فقط
    "!src/**/*.d.ts", // استثناء ملفات التصريح
  ],
};

export default config;
