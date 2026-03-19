# 2026-03-19 Cloudflare R2 마이그레이션 대응

## 작업 목표

- 백엔드 오브젝트 스토리지가 AWS S3에서 Cloudflare R2로 전환됨에 따라 프론트엔드 대응.
- Presigned URL API 응답 구조 변경(key, publicUrl 필드 추가)을 반영한다.
- S3 URL 특화 파싱 로직을 제거하고 범용적인 이미지 URL 처리로 교체한다.

---

## 변경 내역

### feat(product): Presigned URL 응답 구조 변경 대응 및 이미지 URL 처리 범용화

**`src/types/product.ts`**
- `PresignedUrlResponse`에 `key?`, `publicUrl?` 필드 추가

**`src/services/productService.ts`**
- `getPresignedUrl` 반환 타입을 `string`에서 `{ presignedUrl, key?, publicUrl? }` 객체로 변경
- 이미지 URL 정규화 시 S3 도메인 특화 로직 제거
  - 기존: `*.s3.*.amazonaws.com/products/` 패턴 직접 파싱
  - 변경: `products/` 경로를 포함하는 범용 key 추출로 교체
- 주석에서 "S3" 표현을 "오브젝트 스토리지"로 일반화

**`src/components/features/seller/ProductImageUploader.tsx`**
- presigned URL에서 key를 직접 파싱하던 방식 제거
- 백엔드 응답의 `publicUrl` → `key` 순으로 우선 적용
- 두 필드가 모두 없을 경우에만 presigned URL에서 key 추출 시도 (fallback)
