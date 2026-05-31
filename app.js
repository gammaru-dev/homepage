/* ==========================================================================
   GAMMARU JAVASCRIPT ENGINE - INTERACTIVE RETRO-OS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize systems
    initBackgroundCanvas();
    initProjectFilters();
    initQuiz();
    initScrollReveal();
    initMobileMenu();
});



/* ==========================================================================
   2. Floating Node / Grid Canvas Background
   ========================================================================== */
function initBackgroundCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouseX = width / 2;
    let mouseY = height / 2;

    const particles = [];
    const particleCount = 70;

    // Node particle class definition
    class NodeParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.hue = Math.random() < 0.5 ? 190 : 270; // Cyan vs Purple Hues
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Slowly warp towards mouse cursor direction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 300) {
                this.x += (dx / dist) * 0.05;
                this.y += (dy / dist) * 0.05;
            }

            // Boundary wrapping
            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.5)`;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset
        }
    }

    // Populate particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new NodeParticle());
    }

    // Event hooks
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Render loop
    function draw() {
        ctx.fillStyle = 'rgba(7, 9, 19, 0.15)';
        ctx.fillRect(0, 0, width, height);

        // Draw retro background tech grid lines
        ctx.strokeStyle = 'rgba(79, 172, 254, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        
        ctx.beginPath();
        for (let x = 0; x < width; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Update & Render nodes
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Dynamic coordinate tracer at mouse location
        ctx.font = '9px Orbitron';
        ctx.fillStyle = 'rgba(0, 242, 254, 0.3)';
        ctx.fillText(`SYS_X: ${Math.floor(mouseX)} | SYS_Y: ${Math.floor(mouseY)}`, mouseX + 15, mouseY + 15);
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
        ctx.stroke();

        requestAnimationFrame(draw);
    }

    draw();
}



/* ==========================================================================
   5. Interactive Portfolios & Modal Details
   ========================================================================== */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalContent = document.getElementById('modal-body-content');

    // Filter Trigger
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterVal === 'all' || filterVal === category) {
                    card.style.display = 'flex';
                    // Retrigger entrance animation smoothly
                    setTimeout(() => card.classList.add('revealed'), 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Project Details Data Map
    const projectData = {
        ssuquest: {
            title: "SSU Quest: 형남공학관의 비밀",
            tech: "UNITY 2D • C#",
            desc: "형남공학관의 수상한 엘리베이터 지하에서 연구 실험 중이던 괴물들이 대탈출했습니다! 주인공은 숭실대 컴퓨터학부 복학생으로, 강의실 기믹을 활용해 학점을 사수하고 동기들을 구출하며 보스를 격파하는 판타지 개그 RPG입니다. 2D 쿼터뷰 도트 그래픽과 재치 있는 스토리라인으로 2025 SIGN 연합 전시회에서 대호평을 받았습니다.",
            role: "기획 2명, 클라개발 3명, 아트 2명, 사운드 1명",
            engine: "Unity 2022.3 LTS",
            period: "2024.09 ~ 2025.02 (6개월)",
            quote: "\"숭실대생이라면 공감할 수밖에 없는 수많은 랜드마크 밈(Meme)과 학점 몬스터들의 등장이 압권! 세심한 기믹 설계가 매우 뛰어난 게임입니다.\""
        },
        pixelevader: {
            title: "Pixel Evader",
            tech: "HTML5 CANVAS • JAVASCRIPT",
            desc: "클래식 오락실 정취를 극대화한 하이퍼 캐주얼 탄막 피하기 생존 게임입니다. 브라우저 로딩 없이 단 50KB의 바닐라 JS 코드로 동작하며, 난이도 변화에 따른 속도 변속과 화려한 픽셀 터치 셰이딩이 특징입니다. 겜마루 아케이드 룸 캐비닛을 통해 바로 조작하고 랭킹을 기록하는 전용 빌드 게임입니다.",
            role: "1인 개발 (바닐라 JS 독립 토이프로젝트)",
            engine: "Vanilla HTML5 Canvas API",
            period: "2026.04 ~ 2026.05 (1개월)",
            quote: "\"코딩 최적화의 극치. 프레임 드랍 없이 부드럽게 흐르는 우주 미니어처 픽셀과 오리지널 오실레이터 비프음이 완벽한 시너지를 이룹니다.\""
        },
        gravityrush: {
            title: "Gravity Rush",
            tech: "UNREAL ENGINE 5 • C++",
            desc: "시간과 중력이 기하학적으로 왜곡되는 고차원 미궁 공간을 배경으로 한 3D 퍼즐 액션 플랫폼 게임입니다. 플레이어는 임의의 벽면을 바닥으로 선언하여 중력을 반전시킬 수 있으며, Nanite와 Lumen 기술을 활용한 리얼타임 레이트레이싱으로 경이로운 우주 성운 그래픽을 연출했습니다.",
            role: "기획 1명, C++ 프로그래머 2명, 3D 그래픽 3명",
            engine: "Unreal Engine 5.3",
            period: "2023.11 ~ 2024.06 (8개월)",
            quote: "\"벽을 딛고 서는 순간 전체 맵이 뒤바뀌며 회전하는 입체적 쾌감! 대학생 레벨을 넘어선 수려한 인바이런먼트 아트가 시선을 빼앗습니다.\""
        },
        rhythmstar: {
            title: "Rhythm Star: 소리마루",
            tech: "UNITY 3D • C#",
            desc: "겜마루 사운드 디자인 부서가 전곡을 직접 작곡 및 프로듀싱한 모바일 원터치 리듬 레이싱 액션 게임입니다. 아름다운 한국의 정취를 담은 국악 퓨전 칩튠 음악에 맞춰, 궤도 위를 달리는 정령의 코스를 도약하고 꼬리깃을 회전시키며 콤보 점수를 획득합니다.",
            role: "사운드 작곡 3명, 클라 2명, UI 디자인 1명",
            engine: "Unity 3D",
            period: "2024.03 ~ 2024.09 (6개월)",
            quote: "\"귀가 먼저 호강하는 다이나믹 리듬 시퀀싱. 퓨전 국악과 8-비트 신디사이저가 매끄럽게 연결되어 플레이 내내 전율을 돋게 합니다.\""
        },
        echovoid: {
            title: "Echoes of the Void",
            tech: "UNITY 3D • C#",
            desc: "소리의 파동을 시각화한 파티클 시스템을 단서로 하여, 한 치 앞도 보이지 않는 어두운 보이드 공간을 탈출해야 하는 스릴러 미스터리 퍼즐 어드벤처입니다. 마이크 인풋 음량에 반응하는 실시간 월드 변형 쉐이더 기술을 삽입하여, 실제 게이머가 내뱉는 한숨이나 말소리가 게임 속 시야가 됩니다.",
            role: "기획 2명, 프로그래밍 2명, 사운드 엔지니어 1명",
            engine: "Unity 3D URP",
            period: "2025.01 ~ 2025.05 (5개월)",
            quote: "\"숨조차 쉬기 어려운 압도적 오감 자극. 소리의 진동으로 형체를 파악하고 장애물을 가로지르는 극강의 참신함이 돋보입니다.\""
        },
        roguecell: {
            title: "Rogue Cell",
            tech: "HTML5 CANVAS • JAVASCRIPT",
            desc: "신체 면역 세포들을 파괴하고 흡수하며 스스로 진화해나가는 외계 촉수 생명체의 성장을 그린 탑다운 로그라이크 액션 게임입니다. 다양한 유전자 카드를 조합하여 탄막 발사, 산성 독성, 범위 재생 등 강력한 빌드를 빌딩하는 깊이 있는 게임 플레이 루프가 매력입니다.",
            role: "개발 1명, 2D 도트 그래픽 1명",
            engine: "HTML5 Canvas (Web-Arcade API)",
            period: "2025.07 ~ 2025.09 (2개월)",
            quote: "\"촉수가 꿈틀대는 디테일한 무브먼트 알고리즘과 유연한 성장 덱 빌딩. 중독적인 탄막 액션을 훌륭하게 구현했습니다.\""
        }
    };

    // Modal Trigger click listeners
    document.querySelectorAll('.view-detail-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const projId = btn.getAttribute('data-project');
            const data = projectData[projId];
            if (!data) return;

            // Render modal body dynamically
            modalContent.innerHTML = `
                <div class="modal-head">
                    <span class="modal-tech">${data.tech}</span>
                    <h2>${data.title}</h2>
                </div>
                <p class="modal-summary">${data.desc}</p>
                
                <span class="modal-section-title">PROJECT SPECIFICATIONS</span>
                <div class="modal-meta-grid">
                    <div class="modal-meta-item">
                        <strong>DEVELOPERS</strong>
                        <span>${data.role}</span>
                    </div>
                    <div class="modal-meta-item">
                        <strong>ENGINE / TOOL</strong>
                        <span>${data.engine}</span>
                    </div>
                    <div class="modal-meta-item">
                        <strong>DEV PERIOD</strong>
                        <span>${data.period}</span>
                    </div>
                    <div class="modal-meta-item">
                        <strong>STATUS</strong>
                        <span>Completed & Playable</span>
                    </div>
                </div>

                <div class="modal-quote">
                    ${data.quote}
                </div>
            `;

            modal.classList.remove('hidden');
        });
    });

    // Close Modal handles
    modalClose.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

/* ==========================================================================
   6. Interactive Gamer Quiz (Class selector card generator)
   ========================================================================== */
function initQuiz() {
    const startBtn = document.getElementById('start-quiz-btn');
    const restartBtn = document.getElementById('restart-quiz-btn');
    const introBox = document.getElementById('quiz-intro');
    const questionBox = document.getElementById('quiz-question-box');
    const resultBox = document.getElementById('quiz-result');
    
    const questionNum = document.getElementById('quiz-current-num');
    const questionText = document.getElementById('quiz-question-text');
    const optionsContainer = document.getElementById('quiz-options');
    
    const resClassBadge = document.getElementById('result-class-badge');
    const resClassTitle = document.getElementById('result-class-title');
    const resClassDesc = document.getElementById('result-class-desc');

    let currentQuestionIdx = 0;
    // Score counters for each position: Planning (P), Code (C), Art (A), Sound (S)
    const scores = { P: 0, C: 0, A: 0, S: 0 };

    const questions = [
        {
            text: "새로운 게임을 기획하거나 시작할 때, 가장 흥미가 가는 일은 무엇인가요?",
            options: [
                { text: "세계관 스토리라인을 쓰고 독창적인 게임 룰과 규칙을 디자인하기", type: "P" },
                { text: "조작 방식과 캐릭터 스피드, 탄막 물리 엔진 로직을 구상하기", type: "C" },
                { text: "캐릭터 원화를 그리고 맵의 색조와 타일셋 등 도트 아트를 구상하기", type: "A" },
                { text: "배경에 깔릴 레트로 칩튠 루프 음원과 타격감 있는 효과음 연출하기", type: "S" }
            ]
        },
        {
            text: "우연히 명작 게임을 플레이할 때, 가장 먼저 감탄하는 요소는?",
            options: [
                { text: "퍼즐의 배치 난이도나 세밀한 미션 내러티브 구조", type: "P" },
                { text: "정밀하고 렉이 하나도 없는 완벽한 조작 반응성", type: "C" },
                { text: "숨이 막힐 정도로 유려한 그래픽 비주얼과 이펙트 아우라", type: "A" },
                { text: "게임 상황에 따라 웅장하게 고조되는 고해상도 BGM 멜로디", type: "S" }
            ]
        },
        {
            text: "프로젝트 진행 중 큰 난관이나 버그(Bug)에 가로막혔을 때 나의 성향은?",
            options: [
                { text: "근본적인 기획 방향을 유연하게 선회하여 우회로를 찾는다", type: "P" },
                { text: "디버깅 로그를 추적하며 한 줄씩 뜯어고치는 과정 자체가 쾌감이다", type: "C" },
                { text: "디테일을 수정해 그래픽의 레이아웃 완성도를 더 높여 극복한다", type: "A" },
                { text: "청각적 타격 이펙트를 가공해 버그의 밋밋한 틈새를 채워 메운다", type: "S" }
            ]
        },
        {
            text: "게임 개발 동아리에 들어와서 동료들과 어떤 추억을 쌓고 싶나요?",
            options: [
                { text: "밤샘 회의를 진행하며 멋진 GDD(기획서)를 통과시켜 팀을 이끌기", type: "P" },
                { text: "깃허브(GitHub) 브랜치를 합치며 완벽한 패키지 릴리즈 배포하기", type: "C" },
                { text: "서로 피드백을 주며 포트폴리오를 멋지게 장식할 아트 갤러리 빌딩", type: "A" },
                { text: "오디오 소스를 풍성하게 뽑아내어 게임에 생명력을 불어넣기", type: "S" }
            ]
        }
    ];

    startBtn.addEventListener('click', () => {
        introBox.classList.add('hidden');
        questionBox.classList.remove('hidden');
        currentQuestionIdx = 0;
        // Reset scores
        scores.P = 0; scores.C = 0; scores.A = 0; scores.S = 0;
        showQuestion();
    });

    restartBtn.addEventListener('click', () => {
        resultBox.classList.add('hidden');
        introBox.classList.remove('hidden');
    });

    function showQuestion() {
        const q = questions[currentQuestionIdx];
        questionNum.textContent = currentQuestionIdx + 1;
        questionText.textContent = q.text;
        
        optionsContainer.innerHTML = '';
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn sound-btn';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => {
                scores[opt.type]++;
                nextQuestion();
            });
            optionsContainer.appendChild(btn);
        });
    }

    function nextQuestion() {
        currentQuestionIdx++;
        if (currentQuestionIdx < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }

    function showResult() {
        questionBox.classList.add('hidden');
        resultBox.classList.remove('hidden');

        // Find position with highest score
        let maxPos = 'C';
        let maxVal = -1;
        for (const [pos, val] of Object.entries(scores)) {
            if (val > maxVal) {
                maxVal = val;
                maxPos = pos;
            }
        }

        const classMap = {
            P: {
                badge: "CLASS: SYSTEM DESIGNER",
                title: "설계의 신 (Game Planner)",
                desc: "당신은 무에서 유를 창조하는 아키텍트입니다! 거대한 세계관 설계, 몬스터 스킬 수치 밸런싱, 유저의 몰입 유도를 조율하는 게임 기획 부서에 완벽히 들어맞습니다."
            },
            C: {
                badge: "CLASS: MASTER PROGRAMMER",
                title: "코드 마스터 (Programmer)",
                desc: "당신은 기계를 춤추게 만드는 논리술사입니다! 게임 속 정교한 물리 충돌, 몬스터의 인공지능, UI 연결을 완성도 있게 구현해내는 핵심 코더 포지션에 강력 추천합니다."
            },
            A: {
                badge: "CLASS: DYNAMIC ARTIST",
                title: "도트 대마법사 (Game Artist)",
                desc: "당신은 평면의 픽셀에 숨결을 넣는 아티스트입니다! 게임의 심장과도 같은 인상적인 비주얼, 2D/3D 배경 모델링, 생동감 있는 그래픽을 완성하는 비주얼 기둥에 완벽히 어울립니다."
            },
            S: {
                badge: "CLASS: SOUND MAESTRO",
                title: "사운드 지휘자 (Sound Engineer)",
                desc: "당신은 유저의 뇌리를 뒤흔드는 감각의 예술가입니다! 고요한 정적 속 효과음의 타격감, 게임 장면에 흐르는 감미로운 배경음악을 장식할 사운드 마에스트로 포지션에 적임자입니다."
            }
        };

        const res = classMap[maxPos];
        resClassBadge.textContent = res.badge;
        resClassTitle.textContent = res.title;
        resClassDesc.textContent = res.desc;
    }
}

/* ==========================================================================
   7. General Utilities: Scroll Reveal & Mobile Menu Toggle
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    function checkReveal() {
        const triggerBottom = window.innerHeight * 0.88;

        revealElements.forEach(el => {
            const top = el.getBoundingClientRect().top;
            
            // Add custom delay if defined
            const delay = el.getAttribute('data-delay') || 0;

            if (top < triggerBottom) {
                setTimeout(() => {
                    el.classList.add('revealed');
                }, delay);
            }
        });
    }

    window.addEventListener('scroll', checkReveal);
    // Trigger once on startup to check immediate viewport contents
    checkReveal();
}

function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    toggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        toggleBtn.classList.toggle('active');
    });

    // Close mobile panel on link selection
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            toggleBtn.classList.remove('active');
        });
    });
}
