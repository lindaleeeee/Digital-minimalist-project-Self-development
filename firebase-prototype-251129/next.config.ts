/**
 * @file next.config.ts
 * @description Next.js configuration + early localStorage polyfill for SSR
 */

// SSR 환경에서 localStorage.getItem 관련 에러 방지 (최우선 실행)
if (typeof globalThis !== 'undefined' && (typeof (globalThis as any).localStorage === 'undefined' || typeof (globalThis as any).localStorage.getItem !== 'function')) {
  const store = new Map<string, string>();
  (globalThis as any).localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    length: 0,
    key: (index: number) => null,
  };
}

import type { NextConfig } from 'next';

/**
 * 백엔드 API 서버 URL
 * - 개발: 환경변수 미설정 시 localhost:8080 사용
 * - 배포: BACKEND_URL 환경변수로 설정
 */
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 백엔드 API 프록시 설정 (CORS 문제 방지, 개발 환경용)
  // 배포 시 NEXT_PUBLIC_API_BASE_URL을 설정하면 프록시 대신 직접 호출
  async rewrites() {
    // NEXT_PUBLIC_API_BASE_URL이 설정되어 있으면 프록시 비활성화
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      return [];
    }
    // 개발 환경: 프록시 활성화
    return [
      {
        source: '/api/v1/:path*',
        destination: `${BACKEND_URL}/api/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
