import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // 빌드 시 ESLint 에러를 경고로 처리
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 TypeScript 에러를 무시
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
