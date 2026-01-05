// 1. 顶部大轮播图JS（优化宽度计算，匹配图片样式，确保比例稳定、切换精准）
const carousel = document.getElementById('myCarousel');
const carouselImgs = document.getElementById('carouselImgs');
const dots = document.querySelectorAll('.dot');
const imgCount = dots.length;
let carouselWidth = window.innerWidth; // 改为获取视口宽度，与图片的100vw对齐，确保宽度基准一致
let currentIndex = 0;
let timer = null;

// 初始化：设置轮播列表总宽度（适配视口宽度，避免比例失衡）
function initCarouselWidth() {
    carouselWidth = window.innerWidth;
    carouselImgs.style.width = `${carouselWidth * imgCount}px`;
}
// 首次初始化列表宽度
initCarouselWidth();

// 2. 更新轮播图显示（核心方法：偏移量与视口宽度对齐，确保切换后图片比例正常）
function updateCarousel() {
    carouselImgs.style.transform = `translateX(-${currentIndex * carouselWidth}px)`;
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// 3. 下一张图片
function nextImg() {
    currentIndex = (currentIndex + 1) % imgCount;
    updateCarousel();
}

// 4. 上一张图片
function prevImg() {
    currentIndex = (currentIndex - 1 + imgCount) % imgCount;
    updateCarousel();
}

// 5. 圆点点击切换
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        currentIndex = parseInt(dot.dataset.index);
        updateCarousel();
    });
});

// 6. 自动播放
function autoPlay() {
    timer = setInterval(nextImg, 3000);
}

// 7. 鼠标悬停暂停，离开继续播放
carousel.addEventListener('mouseenter', () => {
    clearInterval(timer);
});

carousel.addEventListener('mouseleave', () => {
    autoPlay();
});

// 8. 初始化：启动自动播放
autoPlay();

// 9. 窗口大小改变时自适应（重新计算宽度，保持比例稳定、无错位）
window.addEventListener('resize', () => {
    initCarouselWidth();
    updateCarousel();
});

// -------------- 优化：许职要闻小轮播图JS（保留原有修复，功能正常） --------------
const newsCarousel = document.getElementById('newsCarousel');
const newsCarouselList = document.getElementById('newsCarouselList');
const newsCarouselDots = document.querySelectorAll('.news-carousel-dot');
const newsItemCount = newsCarouselDots.length;
// 关键：使用容器宽度作为基准，避免图片尚未加载时读取到0或抛错
let newsItemWidth = 0;
let newsCurrentIndex = 0;
let newsTimer = null;

function updateNewsCarousel() {
    if (!newsCarouselList) return;
    newsCarouselList.style.transform = `translateX(-${newsCurrentIndex * newsItemWidth}px)`;
    newsCarouselDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === newsCurrentIndex);
    });
}

function initNewsCarouselWidth() {
    if (!newsCarousel || !newsCarouselList) return;
    newsItemWidth = newsCarousel.clientWidth || newsCarousel.offsetWidth || 0;

    if (newsItemCount > 0) {
        newsCarouselList.style.width = `${newsItemWidth * newsItemCount}px`;
        // 为每个 slide 显式设置宽度，避免子项大小不一致导致计算偏差
        const slides = newsCarouselList.children;
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.width = `${newsItemWidth}px`;
        }
    }
    updateNewsCarousel();
}

// 在 window load 时初始化一次，确保资源已解析
window.addEventListener('load', initNewsCarouselWidth);
initNewsCarouselWidth();

function nextNewsItem() {
    if (newsItemCount === 0) return;
    newsCurrentIndex = (newsCurrentIndex + 1) % newsItemCount;
    updateNewsCarousel();
}

// 指示器点击切换
if (newsCarouselDots && newsCarouselDots.length) {
    newsCarouselDots.forEach(dot => {
        dot.addEventListener('click', () => {
            newsCurrentIndex = parseInt(dot.dataset.index, 10);
            updateNewsCarousel();
        });
    });
}

function autoPlayNews() {
    if (newsItemCount === 0) return;
    clearInterval(newsTimer);
    newsTimer = setInterval(nextNewsItem, 4000);
}

if (newsCarousel) {
    newsCarousel.addEventListener('mouseenter', () => {
        clearInterval(newsTimer);
    });

    newsCarousel.addEventListener('mouseleave', () => {
        autoPlayNews();
    });
}

// 启动自动播放
autoPlayNews();

// 窗口大小改变时自适应
window.addEventListener('resize', () => {
    initNewsCarouselWidth();
    updateNewsCarousel();
});

// -------------- 修复：专题网站+能工巧匠轮播JS（解决变量作用域，优化滚动逻辑：单次仅移动一张） --------------
const specialCarousel = document.getElementById('specialCarousel');
const specialTrack = document.getElementById('specialTrack');
const specialLeftBtn = document.getElementById('specialLeftBtn');
const specialRightBtn = document.getElementById('specialRightBtn');
const specialCards = document.querySelectorAll('.special-card');

// 能工巧匠轮播控制（手动箭头切换，无自动播放，单次移动一张）
const artisanCarousel = document.getElementById('artisanCarousel');
const artisanTrack = document.getElementById('artisanTrack');
const artisanLeftBtn = document.getElementById('artisanLeftBtn');
const artisanRightBtn = document.getElementById('artisanRightBtn');
const artisanCards = document.querySelectorAll('.artisan-card');

// 声明可变变量，解决作用域问题
let specialCardWidth = specialCards[0].offsetWidth + 20; // 20是卡片间距（gap）
let artisanCardWidth = artisanCards[0].offsetWidth + 20; // 单张卡片宽度+间距（步长改为单张）
let artisanStepWidth = artisanCardWidth; // 核心修改：从3倍改为1倍，单次移动一张卡片

// 专题网站左箭头点击事件：单次移动一张（保持单张步长，优化边界判断）
specialLeftBtn.addEventListener('click', () => {
    // 获取当前滚动偏移量
    const currentTransform = getComputedStyle(specialTrack).transform;
    const currentOffset = currentTransform === 'none' ? 0 : parseFloat(currentTransform.split(',')[4]);

    // 限制左滚边界（不能超过0，避免空白），每次右移（左箭头）单张卡片宽度
    const newOffset = Math.min(currentOffset + specialCardWidth, 0);
    specialTrack.style.transform = `translateX(${newOffset}px)`;
});

// 专题网站右箭头点击事件：单次移动一张
specialRightBtn.addEventListener('click', () => {
    const currentTransform = getComputedStyle(specialTrack).transform;
    const currentOffset = currentTransform === 'none' ? 0 : parseFloat(currentTransform.split(',')[4]);

    // 计算最大右滚偏移量（总长度 - 可视区域长度，避免空白）
    const totalWidth = specialTrack.scrollWidth;
    const viewportWidth = specialCarousel.offsetWidth;
    const maxOffset = -(totalWidth - viewportWidth);

    // 限制右滚边界，每次左移（右箭头）单张卡片宽度
    const newOffset = Math.max(currentOffset - specialCardWidth, maxOffset);
    specialTrack.style.transform = `translateX(${newOffset}px)`;
});

// 能工巧匠左箭头点击事件：单次移动一张（核心修改：步长为单张卡片宽度）
artisanLeftBtn.addEventListener('click', () => {
    const currentTransform = getComputedStyle(artisanTrack).transform;
    const currentOffset = currentTransform === 'none' ? 0 : parseFloat(currentTransform.split(',')[4]);

    // 限制左滚边界（不能超过0，避免空白），每次右移单张卡片
    const newOffset = Math.min(currentOffset + artisanStepWidth, 0);
    artisanTrack.style.transform = `translateX(${newOffset}px)`;
});

// 能工巧匠右箭头点击事件：单次移动一张（核心修改：步长为单张卡片宽度）
artisanRightBtn.addEventListener('click', () => {
    const currentTransform = getComputedStyle(artisanTrack).transform;
    const currentOffset = currentTransform === 'none' ? 0 : parseFloat(currentTransform.split(',')[4]);

    // 计算最大右滚偏移量（总长度 - 可视区域长度，避免空白）
    const totalWidth = artisanTrack.scrollWidth;
    const viewportWidth = artisanCarousel.offsetWidth;
    const maxOffset = -(totalWidth - viewportWidth);

    // 限制右滚边界，每次左移单张卡片
    const newOffset = Math.max(currentOffset - artisanStepWidth, maxOffset);
    artisanTrack.style.transform = `translateX(${newOffset}px)`;
});

// 窗口大小改变时，重新计算滚动参数（适配响应式，确保单张步长准确）
window.addEventListener('resize', () => {
    // 重新计算卡片宽度，更新可变变量
    specialCardWidth = specialCards[0].offsetWidth + 20;
    artisanCardWidth = artisanCards[0].offsetWidth + 20;
    artisanStepWidth = artisanCardWidth; // 窗口变化后，仍保持单张步长
});