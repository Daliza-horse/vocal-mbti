// 전역 변수
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let audioBlob = null;
let mbtiDataReady = Promise.resolve();

// MBTI 유형 데이터
const mbtiTypes = [
    { 
        type: 'ESTJ', 
        name: '파워 퍼포머형', 
        description: '무대를 터뜨리는 에너지 보컬러',
        character: '1.estj', 
        images: ['KakaoTalk_20250915_104133904_07.png', 'KakaoTalk_20250915_104133904_26.png'],
        vocalFeatures: '강한 성량과 단단한 발성, 음정 정확, 박자를 밀어붙이는 직진 리듬감. 무대에서 폭발력 있는 스타일.',
        strengths: '에너지 과잉으로 전달력 떨어질 수 있음. 다이내믹 조절이 핵심',
        genres: '댄스팝, 락, EDM',
        songs: 'EXO - Power, Stray Kids - S-Class, BTS - Fire, ATEEZ - Guerrilla',
        artists: '백현(EXO), 정국(BTS), 태양(Bigbang), 방찬(Stray Kids)',
        trainingMethod: '퍼포먼스 중심 트레이너 / 무대 연출, 호흡 제어, 시선/표정 트레이닝',
        trainingDirection: '고음 체력 유지 훈련, 무대 동선 응용, 시선처리와 표정 제어, 발성 안전 벨팅 연습',
        balance: { vocal: 95, pitch: 85, rhythm: 80, pronunciation: 70, expression: 90 },
        trainerDescription: '와, 무대를 장악하는 에너지가 정말 인상적이에요! 고음에서 터지는 강한 발성과 퍼포먼스를 살려줄 수 있는 \'김대산\' 트레이너를 추천해 드려요. 트레이닝을 통해 강점을 극대화하고, 무대 위 완성도를 더욱 높일 수 있을 거예요.'
    },
    { 
        type: 'ISTJ', 
        name: '정밀 파워싱어형', 
        description: '콘서트보다 스튜디오에 강한 완벽주의자',
        character: '2.istj', 
        images: ['KakaoTalk_20250915_104133904_08.png', 'KakaoTalk_20250915_104133904_27.png'],
        vocalFeatures: '큰 성량과 정확한 음정, 직선적인 리듬감. 정교하고 안정된 창법.',
        strengths: '감정표현 부족하게 들릴 수 있음. 몰입도 낮을 수 있음.',
        genres: '발라드, 뮤지컬',
        songs: '거미 - 기억해줘요 내 모든 날과 그때를, 태연 - 사계, 정승환 - 이 바보야, 김재환 - 안녕하세요, 휘인 - water color',
        artists: '태연, 정승환, 김재환, 휘인(MAMAMOO)',
        trainingMethod: '정확도 중심 트레이너 / 감정전달, 미세 다이내믹 조절, 가사 해석 중심 트레이닝',
        trainingDirection: '가사 분석 + 감정 전환 연습, 강약 조절, 미세 다이내믹 제어 훈련',
        balance: { vocal: 90, pitch: 95, rhythm: 75, pronunciation: 85, expression: 70 },
        trainerDescription: '완벽한 음정과 밀도 있는 발성이 돋보입니다. 정교함과 안정감이 강점인 당신에게는 \'김대산\' 트레이너가 딱이에요! 가사와 감정의 미세한 조율을 통해 감정 전달력까지 함께 끌어올려 볼 수 있어요.'
    },
    { type: 'ENFJ', name: '주인공형', description: '따뜻하고 표현력이 풍부한 보컬 스타일을 가지고 있습니다. 감정 표현에 뛰어납니다.', character: '3.enfj', images: ['KakaoTalk_20250915_104133904_09.png', 'KakaoTalk_20250915_104133904_28.png'] },
    { type: 'INFJ', name: '옹호자형', description: '깊이 있고 의미 있는 보컬 스타일을 가지고 있습니다. 내면의 감정을 잘 표현합니다.', character: '4.infj', images: ['KakaoTalk_20250915_104133904_10.png', 'KakaoTalk_20250915_104133904_29.png'] },
    { type: 'ESFJ', name: '집정관형', description: '사교적이고 조화로운 보컬 스타일을 가지고 있습니다. 듣는 사람을 배려합니다.', character: '5.esfj', images: ['KakaoTalk_20250915_104133904_11.png', 'KakaoTalk_20250915_104135089.png'] },
    { type: 'ISFJ', name: '수호자형', description: '안정적이고 신뢰할 수 있는 보컬 스타일을 가지고 있습니다. 꾸준한 연습을 선호합니다.', character: '6.isfj', images: ['KakaoTalk_20250915_104133904_12.png', 'KakaoTalk_20250915_104135089_01.png'] },
    { type: 'ENFP', name: '활동가형', description: '열정적이고 창의적인 보컬 스타일을 가지고 있습니다. 자유로운 표현을 좋아합니다.', character: '7.enfp', images: ['KakaoTalk_20250915_104133904_13.png', 'KakaoTalk_20250915_104133904_16.png'] },
    { type: 'INFP', name: '중재자형', description: '감성적이고 개성적인 보컬 스타일을 가지고 있습니다. 자신만의 독특한 매력을 추구합니다.', character: '8.infp', images: ['KakaoTalk_20250915_104133904_14.png', 'KakaoTalk_20250915_104133904_17.png'] },
    { type: 'ESTP', name: '사업가형', description: '활동적이고 즉흥적인 보컬 스타일을 가지고 있습니다. 실전 경험을 중시합니다.', character: '9.estp', images: ['KakaoTalk_20250915_104133904_15.png', 'KakaoTalk_20250915_104133904_18.png'] },
    { type: 'ISTP', name: '만능재주꾼형', description: '독립적이고 실용적인 보컬 스타일을 가지고 있습니다. 효율적인 연습법을 선호합니다.', character: '10.istp', images: ['KakaoTalk_20250915_104133904_19.png', 'KakaoTalk_20250915_104133904.png'] },
    { type: 'ENTP', name: '토론가형', description: '창의적이고 혁신적인 보컬 스타일을 가지고 있습니다. 새로운 시도를 두려워하지 않습니다.', character: '11.entp', images: ['KakaoTalk_20250915_104133904_01.png', 'KakaoTalk_20250915_104133904_20.png'] },
    { type: 'INTP', name: '논리학자형', description: '분석적이고 독창적인 보컬 스타일을 가지고 있습니다. 기술적 완성도를 추구합니다.', character: '12.intp', images: ['KakaoTalk_20250915_104133904_02.png', 'KakaoTalk_20250915_104133904_21.png'] },
    { type: 'ESFP', name: '연예인형', description: '자유롭고 표현력이 풍부한 보컬 스타일을 가지고 있습니다. 무대에서 빛을 발합니다.', character: '13.esfp', images: ['KakaoTalk_20250915_104133904_03.png', 'KakaoTalk_20250915_104133904_22.png'] },
    { type: 'ISFP', name: '모험가형', description: '감성적이고 예술적인 보컬 스타일을 가지고 있습니다. 아름다운 음색을 추구합니다.', character: '14.isfp', images: ['KakaoTalk_20250915_104133904_04.png', 'KakaoTalk_20250915_104133904_23.png'] },
    { type: 'ENTJ', name: '통솔자형', description: '리더십 있고 목표 지향적인 보컬 스타일을 가지고 있습니다. 체계적인 훈련을 선호합니다.', character: '15.entj', images: ['KakaoTalk_20250915_104133904_05.png', 'KakaoTalk_20250915_104133904_24.png'] },
    { type: 'INFP', name: '중재자형', description: '감성적이고 개성적인 보컬 스타일을 가지고 있습니다. 자신만의 독특한 매력을 추구합니다.', character: '16.infp', images: ['KakaoTalk_20250915_104133904_06.png', 'KakaoTalk_20250915_104133904_25.png'] }
];

// mbti 폴더의 텍스트 파일을 읽어 MBTI 데이터에 반영
async function loadAllMbtiData() {
    const updatePromises = mbtiTypes.map(async (item) => {
        try {
            // character 값 예: '15.entj' → txt 경로: mbti/15.entj.txt
            const txtPath = `mbti/${item.character}.txt`;
            const res = await fetch(txtPath, { cache: 'no-cache' });
            if (!res.ok) return;
            const text = await res.text();
            const parsed = parseMbtiTextFile(text);
            // 파일의 타입명이 존재하면 UI에 노출되는 name/description/fields를 덮어씀
            Object.assign(item, parsed);
        } catch (e) {
            // 파일이 없거나 로드 실패 시 무시 (기본값 사용)
        }
    });
    await Promise.all(updatePromises);
}

// mbti 텍스트 파일 파서
function parseMbtiTextFile(content) {
    const lines = content.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    // 예시 형식 참고:
    // L1:15.entj
    // L2:재즈보컬형 (이름)
    // - 정의: ... (description)
    // - 보컬의 특징: ... (vocalFeatures)
    // - 주의/강점: ... (strengths)
    // - 추천 장르 및 곡: 장르 / 곡목록 (genres, songs)
    // - 유사 아티스트: ... (artists)
    // - 추천 트레이너 및 트레이닝 방법: ... (trainingMethod)
    // - 트레이닝 방향: ... (trainingDirection)
    // - 보컬 밸런스 지표: 발성 75 / 음정 80 / 리듬 95 / 발음 80 / 표현력 85 (balance)
    // 트레이너 추천 페이지 설명 (다음 줄에 상세 사유)

    const result = {};
    if (lines[1]) result.name = lines[1];

    const getAfter = (prefix) => {
        const row = lines.find(l => l.startsWith(prefix));
        return row ? row.replace(prefix, '').trim().replace(/^[-\s]+/, '') : undefined;
    };

    result.description = getAfter('- 정의') || getAfter('정의:') || result.description;
    result.vocalFeatures = getAfter('- 보컬의 특징') || result.vocalFeatures;
    result.strengths = getAfter('- 주의/강점') || result.strengths;

    const genreSongs = getAfter('- 추천 장르 및 곡');
    if (genreSongs) {
        const [genresPart, songsPart] = genreSongs.split('/').map(s => s && s.trim());
        if (genresPart) result.genres = genresPart;
        if (songsPart) result.songs = songsPart;
    }
    const artists = getAfter('- 유사 아티스트') || getAfter('- 유사 아티스트 :');
    if (artists) result.artists = artists;

    result.trainingMethod = getAfter('- 추천 트레이너 및 트레이닝 방법') || result.trainingMethod;
    result.trainingDirection = getAfter('- 트레이닝 방향') || result.trainingDirection;

    const balanceLine = getAfter('- 보컬 밸런스 지표') || getAfter('보컬 밸런스 지표:');
    if (balanceLine) {
        const parseNum = (label) => {
            const m = balanceLine.match(new RegExp(label + '\\s*(\\d+)'));
            return m ? Number(m[1]) : undefined;
        };
        const balance = {
            vocal: parseNum('발성'),
            pitch: parseNum('음정'),
            rhythm: parseNum('리듬'),
            pronunciation: parseNum('발음'),
            expression: parseNum('표현력')
        };
        // 유효 숫자만 있을 때만 설정
        if (Object.values(balance).some(v => typeof v === 'number' && !isNaN(v))) {
            result.balance = balance;
        }
    }

    const descIdx = lines.findIndex(l => l.includes('트레이너 추천 페이지 설명'));
    if (descIdx !== -1 && lines[descIdx + 1]) {
        result.trainerDescription = lines[descIdx + 1].replace(/^[-\s]+/, '');
    }

    return result;
}

// 트레이너 정보
const trainer = {
    name: '김보컬 트레이너',
    specialty: '전문 보컬 코치',
    experience: '10년 경력',
    description: '다양한 성격 유형에 맞는 맞춤형 보컬 트레이닝을 제공합니다.'
};

// 페이지 전환 함수
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// 진단 시작
function startDiagnosis() {
    showPage('recording-page');
    initializeRecording();
}

// 뒤로 가기
function goBack() {
    showPage('landing-page');
}

// 녹음 초기화
async function initializeRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            } 
        });
        
        mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm;codecs=opus'
        });
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = document.getElementById('audio');
            audio.src = audioUrl;
            document.getElementById('audio-player').style.display = 'block';
            // 사용자가 재생을 확인한 뒤 수동으로 분석하도록 버튼 활성화
            const analyzeBtn = document.getElementById('analyze-btn');
            if (analyzeBtn) analyzeBtn.disabled = false;
            updateProgress(100);
        };
        
        console.log('녹음 초기화 완료');
    } catch (error) {
        console.error('녹음 초기화 실패:', error);
        alert('마이크 접근 권한이 필요합니다. 브라우저 설정을 확인해주세요.');
    }
}

// 녹음 토글
function toggleRecording() {
    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
}

// 녹음 시작
function startRecording() {
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
        audioChunks = [];
        mediaRecorder.start();
        isRecording = true;
        
        // UI 업데이트
        document.getElementById('record-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;
        document.getElementById('microphone').classList.add('recording');
        document.getElementById('recording-status').innerHTML = '<span class="status-text">녹음 중...</span>';
        document.getElementById('progress-fill').style.width = '0%';
        
        // 진행률 애니메이션
        let progress = 0;
        const progressInterval = setInterval(() => {
            if (isRecording && progress < 90) {
                progress += Math.random() * 10;
                updateProgress(progress);
            } else {
                clearInterval(progressInterval);
            }
        }, 200);
    }
}

// 녹음 중지
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        isRecording = false;
        
        // UI 업데이트
        document.getElementById('record-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        document.getElementById('microphone').classList.remove('recording');
        document.getElementById('recording-status').innerHTML = '<span class="status-text">녹음 완료</span>';
        
        // 자동 분석 제거: 사용자가 "분석 시작하기" 버튼으로 진행
    }
}

// 다시 녹음
function retryRecording() {
    document.getElementById('audio-player').style.display = 'none';
    document.getElementById('recording-status').innerHTML = '<span class="status-text">녹음 준비</span>';
    document.getElementById('progress-fill').style.width = '0%';
    audioBlob = null;
}

// 진행률 업데이트
function updateProgress(percentage) {
    document.getElementById('progress-fill').style.width = percentage + '%';
}

// 분석 시작
function startAnalysis() {
    showPage('analyzing-page');
    
    // 3초 후 결과 표시
    setTimeout(async () => {
        try { await mbtiDataReady; } catch (e) {}
        showResult();
    }, 3000);
}

// 결과 표시
function showResult() {
    // 랜덤 MBTI 선택
    const randomMbti = mbtiTypes[Math.floor(Math.random() * mbtiTypes.length)];
    
    // 결과 페이지 업데이트
    document.getElementById('mbti-type').querySelector('h2').textContent = randomMbti.type;
    document.getElementById('mbti-title').textContent = randomMbti.name;
    document.getElementById('mbti-detail').textContent = randomMbti.description;
    
    // 캐릭터 이미지 설정 (남녀 모두 표시)
    const characterPath = `character/${randomMbti.character}/`;
    const maleImg = document.getElementById('character-img-male');
    const femaleImg = document.getElementById('character-img-female');
    
    // 첫 번째 이미지는 남성, 두 번째 이미지는 여성으로 가정
    maleImg.src = characterPath + randomMbti.images[0];
    femaleImg.src = characterPath + randomMbti.images[1];
    maleImg.alt = `${randomMbti.type} 남성 캐릭터`;
    femaleImg.alt = `${randomMbti.type} 여성 캐릭터`;
    
    // 보컬 상세 정보 업데이트 (값이 없으면 기본값 적용)
    document.getElementById('vocal-features').textContent = randomMbti.vocalFeatures || '당신의 보컬 개성과 강점을 살릴 수 있는 트레이닝을 추천합니다.';
    document.getElementById('strengths').textContent = randomMbti.strengths || '강점을 극대화하고 약점을 보완하는 방향으로 진행합니다.';
    document.getElementById('genres').textContent = randomMbti.genres || '발라드, 팝, R&B';
    document.getElementById('songs').textContent = randomMbti.songs || '추천곡은 상담 후 맞춤 제공됩니다.';
    document.getElementById('artists').textContent = randomMbti.artists || '유사 아티스트는 추후 제안드립니다.';

    // 레이더 차트 업데이트 (없으면 기본 밸런스 적용)
    const defaultBalance = { vocal: 80, pitch: 80, rhythm: 80, pronunciation: 80, expression: 80 };
    updateRadarChart(Object.assign({}, defaultBalance, randomMbti.balance || {}));

    // 트레이너 데이터는 다음 페이지에서 표시 (상태만 저장)
    window.__trainerData = {
        name: '김대산 트레이너',
        specialty: '전문 보컬 코치',
        experience: '10년 경력',
        matchReason: randomMbti.trainerDescription || '당신의 성격과 보컬 스타일에 최적화된 트레이닝을 제공합니다.',
        method: randomMbti.trainingMethod || '퍼포먼스 중심 트레이너 / 무대 연출, 호흡 제어, 시선/표정 트레이닝',
        direction: randomMbti.trainingDirection || '고음 체력 유지 훈련, 무대 동선 응용, 시선처리와 표정 제어, 발성 안전 벨팅 연습'
    };
    
    // 매칭률 계산 (85-98% 사이 랜덤)
    const matchPercentage = Math.floor(Math.random() * 14) + 85;
    document.getElementById('match-percentage').textContent = matchPercentage + '%';
    
    showPage('result-page');
}

// 결과 공유하기
function shareResult() {
    const title = document.getElementById('mbti-type').querySelector('h2').textContent;
    const text = `${title} 유형 결과가 나왔어요! 보컬 MBTI로 나의 보컬 성격을 확인해보세요.`;
    const url = location.href;
    if (navigator.share) {
        navigator.share({ title: '보컬 MBTI 결과', text, url }).catch(() => {});
    } else {
        navigator.clipboard.writeText(`${text}\n${url}`);
        alert('결과 링크가 클립보드에 복사되었습니다.');
    }
}

// 트레이너 추천 페이지로 이동
function goToTrainerPage() {
    const data = window.__trainerData || {};
    const reasonEl = document.getElementById('recommendation-reason');
    const methodEl = document.getElementById('training-method');
    const directionEl = document.getElementById('training-direction');
    if (reasonEl) reasonEl.textContent = data.matchReason || '';
    if (methodEl) methodEl.textContent = data.method || '';
    if (directionEl) directionEl.textContent = data.direction || '';
    showPage('trainer-page');
}

// 레이더 차트 초기화 함수
function initializeRadarChart() {
    const centerX = 150;
    const centerY = 150;
    const maxRadius = 100;
    
    // 오각형의 각 꼭짓점 각도 (시계방향, 12시부터 시작)
    const angles = [
        -Math.PI / 2,                    // 발성 (위쪽)
        -Math.PI / 2 + (2 * Math.PI / 5), // 음정 (오른쪽 위)
        -Math.PI / 2 + (4 * Math.PI / 5), // 리듬 (오른쪽 아래)
        -Math.PI / 2 + (6 * Math.PI / 5), // 발음 (왼쪽 아래)
        -Math.PI / 2 + (8 * Math.PI / 5)  // 표현력 (왼쪽 위)
    ];
    
    // 그리드 생성 (20%, 40%, 60%, 80%, 100%)
    const gridLevels = [20, 40, 60, 80, 100];
    gridLevels.forEach((level, index) => {
        const gridId = `grid-${level}`;
        const gridElement = document.getElementById(gridId);
        if (gridElement) {
            const points = angles.map(angle => {
                const x = centerX + Math.cos(angle) * (level / 100) * maxRadius;
                const y = centerY + Math.sin(angle) * (level / 100) * maxRadius;
                return `${x},${y}`;
            }).join(' ');
            gridElement.setAttribute('points', points);
        }
    });
    
    // 축 라인 생성
    angles.forEach((angle, index) => {
        const axisId = `axis-${['vocal', 'pitch', 'rhythm', 'pronunciation', 'expression'][index]}`;
        const axisElement = document.getElementById(axisId);
        if (axisElement) {
            const endX = centerX + Math.cos(angle) * maxRadius;
            const endY = centerY + Math.sin(angle) * maxRadius;
            axisElement.setAttribute('x1', centerX);
            axisElement.setAttribute('y1', centerY);
            axisElement.setAttribute('x2', endX);
            axisElement.setAttribute('y2', endY);
        }
    });
    
    // 라벨 위치 설정
    angles.forEach((angle, index) => {
        const labelId = `label-${['vocal', 'pitch', 'rhythm', 'pronunciation', 'expression'][index]}`;
        const labelElement = document.getElementById(labelId);
        if (labelElement) {
            const x = centerX + Math.cos(angle) * (maxRadius + 20);
            const y = centerY + Math.sin(angle) * (maxRadius + 20);
            labelElement.setAttribute('x', x);
            labelElement.setAttribute('y', y);
        }
    });
}

// 레이더 차트 업데이트 함수
function updateRadarChart(balance) {
    const centerX = 150;
    const centerY = 150;
    const maxRadius = 100;
    
    // 오각형의 각 꼭짓점 각도 (시계방향, 12시부터 시작)
    const angles = [
        -Math.PI / 2,                    // 발성 (위쪽)
        -Math.PI / 2 + (2 * Math.PI / 5), // 음정 (오른쪽 위)
        -Math.PI / 2 + (4 * Math.PI / 5), // 리듬 (오른쪽 아래)
        -Math.PI / 2 + (6 * Math.PI / 5), // 발음 (왼쪽 아래)
        -Math.PI / 2 + (8 * Math.PI / 5)  // 표현력 (왼쪽 위)
    ];
    
    // 각 항목의 좌표 계산
    const vocalX = centerX + Math.cos(angles[0]) * (balance.vocal / 100) * maxRadius;
    const vocalY = centerY + Math.sin(angles[0]) * (balance.vocal / 100) * maxRadius;
    
    const pitchX = centerX + Math.cos(angles[1]) * (balance.pitch / 100) * maxRadius;
    const pitchY = centerY + Math.sin(angles[1]) * (balance.pitch / 100) * maxRadius;
    
    const rhythmX = centerX + Math.cos(angles[2]) * (balance.rhythm / 100) * maxRadius;
    const rhythmY = centerY + Math.sin(angles[2]) * (balance.rhythm / 100) * maxRadius;
    
    const pronunciationX = centerX + Math.cos(angles[3]) * (balance.pronunciation / 100) * maxRadius;
    const pronunciationY = centerY + Math.sin(angles[3]) * (balance.pronunciation / 100) * maxRadius;
    
    const expressionX = centerX + Math.cos(angles[4]) * (balance.expression / 100) * maxRadius;
    const expressionY = centerY + Math.sin(angles[4]) * (balance.expression / 100) * maxRadius;
    
    // 데이터 폴리곤 업데이트 (시계방향으로 연결)
    const polygon = document.getElementById('data-polygon');
    polygon.setAttribute('points', 
        `${vocalX},${vocalY} ${pitchX},${pitchY} ${rhythmX},${rhythmY} ${pronunciationX},${pronunciationY} ${expressionX},${expressionY}`
    );
    
    // 데이터 포인트 업데이트
    document.getElementById('vocal-point').setAttribute('cx', vocalX);
    document.getElementById('vocal-point').setAttribute('cy', vocalY);
    
    document.getElementById('pitch-point').setAttribute('cx', pitchX);
    document.getElementById('pitch-point').setAttribute('cy', pitchY);
    
    document.getElementById('rhythm-point').setAttribute('cx', rhythmX);
    document.getElementById('rhythm-point').setAttribute('cy', rhythmY);
    
    document.getElementById('pronunciation-point').setAttribute('cx', pronunciationX);
    document.getElementById('pronunciation-point').setAttribute('cy', pronunciationY);
    
    document.getElementById('expression-point').setAttribute('cx', expressionX);
    document.getElementById('expression-point').setAttribute('cy', expressionY);
    
    // 값 텍스트 업데이트
    document.getElementById('vocal-value').textContent = balance.vocal;
    document.getElementById('pitch-value').textContent = balance.pitch;
    document.getElementById('rhythm-value').textContent = balance.rhythm;
    document.getElementById('pronunciation-value').textContent = balance.pronunciation;
    document.getElementById('expression-value').textContent = balance.expression;
    
    // 값 텍스트 위치 업데이트 (각 방향에 맞게 조정)
    document.getElementById('vocal-value').setAttribute('x', vocalX);
    document.getElementById('vocal-value').setAttribute('y', vocalY - 15);
    
    document.getElementById('pitch-value').setAttribute('x', pitchX + 15);
    document.getElementById('pitch-value').setAttribute('y', pitchY - 5);
    
    document.getElementById('rhythm-value').setAttribute('x', rhythmX + 15);
    document.getElementById('rhythm-value').setAttribute('y', rhythmY + 5);
    
    document.getElementById('pronunciation-value').setAttribute('x', pronunciationX - 15);
    document.getElementById('pronunciation-value').setAttribute('y', pronunciationY + 5);
    
    document.getElementById('expression-value').setAttribute('x', expressionX - 15);
    document.getElementById('expression-value').setAttribute('y', expressionY - 5);
}

// 트레이너 연락
function contactTrainer() {
    // 카카오 오픈채팅으로 연결
    window.open('https://open.kakao.com/o/srW3XcSh', '_blank');
}

// 진단 다시 시작
function restartDiagnosis() {
    // 모든 상태 초기화
    audioChunks = [];
    audioBlob = null;
    isRecording = false;
    
    // UI 초기화
    document.getElementById('audio-player').style.display = 'none';
    document.getElementById('recording-status').innerHTML = '<span class="status-text">녹음 준비</span>';
    document.getElementById('progress-fill').style.width = '0%';
    document.getElementById('record-btn').disabled = false;
    document.getElementById('stop-btn').disabled = true;
    document.getElementById('microphone').classList.remove('recording');
    
    showPage('landing-page');
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 브라우저 호환성 확인
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('이 브라우저는 음성 녹음 기능을 지원하지 않습니다. 최신 브라우저를 사용해주세요.');
    }
    
    // 초기 페이지 설정
    showPage('landing-page');
    
    // 레이더 차트 초기화
    initializeRadarChart();

    // MBTI 텍스트 파일 로딩 (결과 반영용)
    mbtiDataReady = loadAllMbtiData();
    
    // 스크롤 부드럽게
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // 터치 이벤트 최적화
    document.addEventListener('touchstart', function() {}, {passive: true});
    document.addEventListener('touchmove', function() {}, {passive: true});
});

// 키보드 접근성
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'BUTTON') {
            event.preventDefault();
            activeElement.click();
        }
    }
});

// 오프라인 지원
window.addEventListener('online', function() {
    console.log('온라인 상태로 복구되었습니다.');
});

window.addEventListener('offline', function() {
    console.log('오프라인 상태입니다.');
});

// 성능 모니터링
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('페이지 로드 시간:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}
