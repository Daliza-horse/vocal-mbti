# 🎤 보컬 MBTI 진단 및 트레이너 매칭

음성 녹음을 통해 MBTI를 진단하고 맞춤형 보컬 트레이너와 매칭해주는 모바일 기반 웹 애플리케이션입니다.

## ✨ 주요 기능

- **음성 녹음 진단**: 간단한 문장을 읽어서 MBTI 성격 유형 진단
- **16가지 MBTI 유형**: 각 유형별 맞춤형 보컬 스타일 설명
- **트레이너 매칭**: 개인별 특성에 맞는 보컬 트레이너 추천
- **모바일 최적화**: 반응형 디자인으로 모든 기기에서 최적화된 사용자 경험
- **실시간 녹음**: Web Audio API를 활용한 고품질 음성 녹음

## 🚀 시작하기

### 요구사항

- 최신 웹 브라우저 (Chrome, Firefox, Safari, Edge)
- 마이크 접근 권한
- HTTPS 환경 (로컬 개발 시 localhost 허용)

### 설치 및 실행

1. 프로젝트 파일을 다운로드합니다.
2. 웹 서버를 통해 `index.html` 파일을 실행합니다.

```bash
# Python을 사용한 간단한 서버 실행
python -m http.server 8000

# Node.js를 사용한 경우
npx serve .

# 또는 Live Server 확장 프로그램 사용 (VS Code)
```

3. 브라우저에서 `http://localhost:8000`으로 접속합니다.

## 📱 사용법

1. **진단 시작**: "진단 시작하기" 버튼을 클릭합니다.
2. **음성 녹음**: 화면에 표시된 문장을 자연스럽게 읽어주세요.
3. **녹음 완료**: "녹음 중지" 버튼을 클릭하여 녹음을 완료합니다.
4. **결과 확인**: 분석이 완료되면 MBTI 유형과 맞춤 트레이너 정보를 확인할 수 있습니다.

## 🎯 MBTI 유형별 보컬 특성

### 분석가 (NT)
- **ENTP**: 창의적이고 혁신적인 보컬 스타일
- **INTP**: 분석적이고 독창적인 보컬 스타일
- **ENTJ**: 리더십 있고 목표 지향적인 보컬 스타일
- **INTJ**: 전략적이고 체계적인 보컬 스타일

### 외교관 (NF)
- **ENFJ**: 따뜻하고 표현력이 풍부한 보컬 스타일
- **INFJ**: 깊이 있고 의미 있는 보컬 스타일
- **ENFP**: 열정적이고 창의적인 보컬 스타일
- **INFP**: 감성적이고 개성적인 보컬 스타일

### 관리자 (SJ)
- **ESTJ**: 체계적이고 실용적인 보컬 스타일
- **ISTJ**: 신중하고 꼼꼼한 보컬 스타일
- **ESFJ**: 사교적이고 조화로운 보컬 스타일
- **ISFJ**: 안정적이고 신뢰할 수 있는 보컬 스타일

### 탐험가 (SP)
- **ESTP**: 활동적이고 즉흥적인 보컬 스타일
- **ISTP**: 독립적이고 실용적인 보컬 스타일
- **ESFP**: 자유롭고 표현력이 풍부한 보컬 스타일
- **ISFP**: 감성적이고 예술적인 보컬 스타일

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Audio**: Web Audio API, MediaRecorder API
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Icons**: Font Awesome
- **Fonts**: Noto Sans KR (Google Fonts)

## 📁 프로젝트 구조

```
vocal-mbti/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일시트
├── script.js           # JavaScript 로직
├── README.md           # 프로젝트 문서
└── character/          # MBTI 캐릭터 이미지
    ├── 1.estj/
    ├── 2.istj/
    ├── ...
    └── 16.infp/
```

## 🎨 디자인 특징

- **그라데이션 배경**: 보라색 계열의 모던한 그라데이션
- **글래스모피즘**: 반투명 효과와 블러 처리로 세련된 UI
- **애니메이션**: 부드러운 전환 효과와 호버 애니메이션
- **반응형 디자인**: 모바일 우선 설계로 모든 기기 지원

## 🔧 커스터마이징

### MBTI 유형 수정
`script.js` 파일의 `mbtiTypes` 배열에서 각 유형의 정보를 수정할 수 있습니다.

### 트레이너 정보 변경
`script.js` 파일의 `trainer` 객체에서 트레이너 정보를 수정할 수 있습니다.

### 스타일 변경
`styles.css` 파일에서 색상, 폰트, 레이아웃 등을 자유롭게 수정할 수 있습니다.

## 🌐 브라우저 지원

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 언제든지 연락해주세요.

---

**보컬 MBTI** - 당신의 목소리로 알아보는 성격 유형 진단

