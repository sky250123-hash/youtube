<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🎬 Viral Script Cloner

바이럴 유튜브 스크립트를 분석하고 새로운 주제로 스크립트를 생성하는 AI 기반 도구입니다.

## 🚀 빠른 시작

### 사전 요구사항
- Node.js 18+ 
- Gemini API Key ([여기서 발급](https://ai.google.dev/gemini-api/docs/api-key))

### 설치 및 실행

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **환경 변수 설정**
   
   프로젝트 루트에 `.env` 파일을 생성하고 API 키를 추가하세요:
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   
   또는 `.env.example` 파일을 복사하여 사용:
   ```bash
   cp .env.example .env
   ```
   그 다음 `.env` 파일을 열어 실제 API 키로 수정하세요.

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   
   브라우저에서 http://localhost:3000 을 열어주세요.

## ⚠️ 문제 해결

### "API Key must be set" 오류가 발생하는 경우:
1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. `GEMINI_API_KEY=` 형식이 올바른지 확인 (따옴표 없이)
3. 개발 서버를 재시작 (`Ctrl+C` 후 `npm run dev`)

### Tailwind CSS 경고가 발생하는 경우:
- 개발 환경에서는 CDN 사용이 정상이며, 프로덕션 빌드 시 자동으로 처리됩니다.

## 📦 프로덕션 빌드

```bash
npm run build
npm run preview
```
