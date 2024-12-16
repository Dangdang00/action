# 프론트엔드 과제 - 채용 달력 만들기

## 실행 방법

1. 패키지 다운로드:
   ```bash
   yarn
   ```
2. 프로젝트 실행:
   ```bash
   yarn start
   ```

## 기술 스택

- React.js 18.2.0 - UI 구성 및 컴포넌트 개발
- Redux-Toolkit 1.9.1 - 전역 상태 관리
- Sass 1.82.0 - 스타일링 및 SCSS 기반의 CSS 관리

## 설계 방식

- **컴포넌트 기반 설계**
  - UI를 독립적인 컴포넌트로 분리하여 재사용성 및 유지보수성 강화
- **상태 중심 설계**
  - Redux-Toolkit을 사용하여 전역 상태 관리
  - 상태 변화에 따라 UI를 동적으로 업데이트
- **Sass를 활용한 스타일 설계**
  - 전역 스타일을 관리하여 일관된 UI 구성

## 주요 기능

1. 월 네비게이션 구현
2. 달력 구현
3. 직무 필터 구현
4. 채용 공고 상세보기 구현

## 프로젝트 구조

```
src/
├── actions/            # Redux 액션 파일
│   └── main.action.js
├── assets/             # 프로젝트에서 사용하는 정적 파일
│   └── base.scss       # 전역 스타일 정의
├── components/         # 재사용 가능한 컴포넌트
│   ├── Calendar/
│   ├── Checkbox/
│   ├── Icons/
│   └── Modal/
├── helpers/            # 유틸리티 함수 및 상태 관리 파일
│   ├── store.js
│   └── utils.js
├── pages/              # 페이지 단위 컴포넌트
│   └── Main/
│       ├── Main.scss
│       ├── MainView.js
│       └── SearchCondition.js
├── services/           # API 호출 및 서비스 관련 파일
│   ├── api.config.js
│   └── main.service.js
├── App.js              # 루트 컴포넌트
└── index.js            # 프로젝트 진입점
```

## 필요한 가정

- 채용 공고 상세 조회는 캘린더를 통해 접근하는 방식으로 처리됩니다.  
  (`/:id` 경로로 직접 접근하는 방식은 적용되지 않았습니다.)
