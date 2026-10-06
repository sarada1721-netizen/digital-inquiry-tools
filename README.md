# 디지털 탐구 도구 (Digital Inquiry Tools)

> **고등학교 2학년 과학탐구 수업을 위한 인터랙티브 MBL 가상 센서 교구 & 시뮬레이션 플랫폼**

---

## 🔬 주요 특징 및 센서 시뮬레이션

1. **PASCO 무선 pH 센서 (Wireless pH Sensor)**
   - 탄산음료와 치아 법랑질 부식 탐구 (콜라, 오렌지주스, 탄산수, 우유, 생수 등 pH 및 부식 위험도 분석)
   - 0.1M HCl + 0.1M NaOH 강산-강염기 중화 적정 곡선 (pH S-커브 및 페놀프탈레인 변색)
   - 위산과 제산제(CaCO3, Mg(OH)2, NaHCO3) 중화 반응 속도 모델링

2. **PASCO 무선 고정밀 온도 센서 (Wireless Temp Sensor)**
   - 발열 반응(염화칼슘 핫팩) vs 흡열 반응(질산암모늄 쿨팩) 화학 반응열(Q = mcΔT) 측정
   - 온실기체(CO2)와 대기 복사 평형 온도 변화 모델링
   - 물과 에탄올의 비열 및 증발열 비교 실험

3. **PASCO 무선 절대 기압 센서 (Wireless Pressure Sensor)**
   - 60mL 주사기 피스톤을 이용한 보일의 법칙(P·V = k) 실시간 쌍곡선 및 P vs 1/V 검증
   - 과산화수소(H2O2)의 이산화망가니즈(MnO2) 촉매 분해와 산소 기체 발생에 따른 기압 상승률(dP/dt) 관측

4. **PASCO 무선 전기전도도 센서 (Wireless Conductivity Sensor)**
   - 증류수, 설탕물, 수돗물, 식초, 이온음료, 소금물의 전해질/비전해질 전리도(μS/cm) 및 탐구 전구 밝기 시각화

5. **PASCO 무선 스마트 카트 & 힘 센서 (Wireless Smart Cart)**
   - 질량(m) 및 외력(F) 조절을 통한 뉴턴 제2법칙 (F = m · a) 실시간 가속도 검증

---

## 🎨 디자인 시스템

- **클레이모피즘 (Claymorphism)**: 3D 둥근 볼륨감과 소프트 파스텔 팔레트
- **오로라 메쉬 그라디언트 (Aurora / Mesh Gradient)**: 배경의 유려한 블러 그라디언트
- **뉴모피즘 (Neumorphism / Soft UI)**: 부드러운 양각/음각 섀도우 미학
- **미니멀 스위스 스타일 (Swiss Typography)**: 명료한 산세리프 타이포그래피와 산뜻한 여백
- **네오 브루탈리즘 (Neo-Brutalism)**: 3px 검은 외곽선, 하드 오프셋 그림자(`shadow-brutal`), 비비드 팝 컬러

---

## ⚡ 서울(Seoul) 리전 통일 최적화

- **Vercel Serverless Function Region**: `icn1` (Seoul, South Korea) via `vercel.json`
- **Supabase Database Region**: `ap-northeast-2` (Seoul, South Korea)
- **지연시간(RTT)**: 동일 서울 IDC 배치로 극단적인 5ms 이하 초저지연 RTT 달성

---

## 🚀 로컬 실행 방법

```bash
npm install
npm run build
npm run dev
```
브라우저에서 `http://localhost:3000` 접속
