let carousel = document.querySelector('.carousel');
const scene = document.querySelector('.scene');
const dataContainer = document.getElementById('data');
const dataItem = document.getElementById('content-container');
const cells = carousel.querySelectorAll('.carousel__cell');
const cellElements = Array.from(cells);
const cellCount = cellElements.length;
let selectedIndex = 0;
let isPlaying = false;
let rotationInterval;
let cellSize = 44; // Širina ili visina pojedinačnog elementa
const gapSize = 1.7; // Razmak između elemenata
const isHorizontal = true;
const rotateFn = isHorizontal ? 'rotateY' : 'rotateX';
let radius, theta;


document.addEventListener('DOMContentLoaded', function () {
    startRotation();
});


function rotateCarousel() {
    var angle = theta * (selectedIndex + 0.01) * -1;
    carousel.style.transform = 'translateZ(' + -radius + 'px) ' +
        rotateFn + '(' + angle + 'deg)';
}

function changeCarousel() {
    theta = 360 / cellCount;
    radius = Math.round((cellSize / 2 + gapSize) / Math.tan(Math.PI / cellCount));
    for (var i = 0; i < cellElements.length; i++) {
        var cell = cellElements[i];
        if (i < cellCount) {
            var cellAngle = theta * i;
            cell.style.transform = rotateFn + '(' + cellAngle + 'deg) translateZ(' + radius + 'vw)';
        }
    }
    rotateCarousel();
}

///////////////////////////////////////////////////////////////////
// pokreće automatsku rotaciju karusela
function startRotation() {
    isPlaying = true;
    // Odmah povećajte selectedIndex i ažurirajte karusel
    selectedIndex++;
    changeCarousel();
    stop.classList.remove('noneDisplay');
    play.classList.add('noneDisplay');
    rotationInterval = setInterval(function () {
        selectedIndex++;
        changeCarousel();
    }, 3000); // Rotacija svakih 3 sekunde
}

///////////////////////////////////////////////////////////////////
// zaustavlja automatsku rotaciju karusela
function stopRotation() {
    isPlaying = false;
    clearInterval(rotationInterval);
    stop.classList.add('noneDisplay');
    play.classList.remove('noneDisplay');
}


///////////////////////////////////////////////////////
// Rotacija pokretom ruke
let isDragging = false;
let startX, diffX, previousX, startTime;

// Determine the event names based on whether it's a carousel or not
const startEvent = carousel ? 'touchstart' : 'mousedown';
const moveEvent = carousel ? 'touchmove' : 'mousemove';
const endEvent = carousel ? 'touchend' : 'mouseup';

// Funkcija za postavljanje teksta u zavisnosti od jezika
function setLanguageText(language) {
    // ... (ostatak koda ostaje nepromenjen)
}

// Add event listener for the start event on carousel
carousel.addEventListener(startEvent, function (e) {
    isDragging = true;
    startX = carousel ? e.touches[0].clientX : e.clientX;
    previousX = startX;
});

// Add event listener for the move event on carousel
carousel.addEventListener(moveEvent, function (e) {
    if (isDragging) {
        const clientX = carousel ? e.changedTouches[0].clientX : e.clientX;
        diffX = clientX - startX;

        // Change selectedIndex based on mouse movement
        if (Math.abs(diffX) > cellSize / 2) {
            if (diffX < 0) {
                selectedIndex += 1;
            } else {
                selectedIndex -= 1;
            }
            startX = clientX;
            changeCarousel();
        }

        stopRotation();
    }
});

////////////////////////////////////////////////////////
// Dodajte event listenere za dataContainer
dataContainer.addEventListener(startEvent, function (e) {
    isDragging = true;
    startX = dataContainer ? e.touches[0].clientX : e.clientX;
    previousX = startX;
    startTime = Date.now(); // Postavite početno vreme povlačenja
});

// Postavljanje dodatnih pragova
const minDragDistance = 150; // Minimalna dužina povlačenja u pikselima
const minDragSpeed = 0.9; // Minimalna brzina povlačenja u pikselima po milisekundi

dataContainer.addEventListener(moveEvent, function (e) {
    if (isDragging) {
        const clientX = dataContainer ? e.changedTouches[0].clientX : e.clientX;
        diffX = clientX - startX;
        const dragSpeed = Math.abs(diffX) / (Date.now() - startTime);

        // Provera dodatnih pragova za brzinu i dužinu povlačenja
        if (Math.abs(diffX) > minDragDistance && dragSpeed > minDragSpeed) {


            // Simuliraj klik na prethodnu ili sledeću ćeliju u zavisnosti od pokreta prsta
            if (diffX < 0) {
                selectNextCell();
            } else {
                selectPreviousCell();
            }
            startX = clientX;
        }
    }
});

// Funkcija za simulaciju klika na prethodnu ćeliju
function selectPreviousCell() {
    const previousIndex = (selectedIndex - 1 + cells.length) % cells.length;
    if (cells[previousIndex]) {
        cells[previousIndex].click();
    }
}

// Funkcija za simulaciju klika na sledeću ćeliju
function selectNextCell() {
    const nextIndex = (selectedIndex + 1) % cells.length;
    cells[nextIndex].click();
}

// Dodajte event listener za završetak povlačenja
dataContainer.addEventListener(endEvent, function () {
    if (isDragging) {
        // Resetujte opacity na 1 kada se završi povlačenje
        dataContainer.style.opacity = 1;
        isDragging = false;
    }
});



//////////////////////////////////////////////////////
// Pokreni rotaciju
const play = document.querySelector('.play');
play.addEventListener('click', () => {
    startRotation();
});


//////////////////////////////////////////////////////
// Stopiraj rotaciju
const stop = document.querySelector('.stop');
stop.addEventListener('click', () => {
    stopRotation();
});


//////////////////////////////////////////////////////
// Dodajte klik događaj za dugme za prethodnu ćeliju
const prevButton = document.querySelector('.previous-button');
prevButton.addEventListener('click', () => {
    selectPreviousCell();
});

// Dodajte event listenere za touchstart i touchend događaje
prevButton.addEventListener('touchstart', () => {
    // Funkcija koja se poziva kada se touchstart događa
    touchInterval = setInterval(() => {
        selectedIndex--;
        changeCarousel();
        stopRotation();
    }, 1000); // Promenite vreme intervala prema vašim potrebama
});

prevButton.addEventListener('touchend', () => {
    // Funkcija koja se poziva kada se touchend događa
    clearInterval(touchInterval);
});

//////////////////////////////////////////////////////
// Dodajte klik događaj za dugme za sledeću ćeliju
const nextButton = document.querySelector('.next-button');
nextButton.addEventListener('click', () => {
    selectNextCell();
});

// Dodajte event listenere za touchstart i touchend događaje
nextButton.addEventListener('touchstart', () => {
    // Funkcija koja se poziva kada se touchstart događa
    touchInterval = setInterval(function () {
        selectedIndex++;
        changeCarousel();
        stopRotation();
    }, 1000); // Promenite vreme intervala prema vašim potrebama
});

nextButton.addEventListener('touchend', () => {
    // Funkcija koja se poziva kada se touchend događa
    clearInterval(touchInterval);
});


///////////////////////////////////////////////////
// const languageSetting = document.querySelector('.languageBox');
const darkOpen = document.querySelector('.dark')

darkOpen.addEventListener('click', () => {
    darkOpen.classList.add('noneDisplay');
    languageBox.classList.remove("translateX");
    switcher.classList.remove('translateX');
    checkbox_1.checked = false;
    checkbox_2.checked = false;
});


///////////////////////////////////////////////////////
//
const headerLogo = document.querySelector('.headerLogo');
const description_content = document.querySelector('.description_content');
const categoy_description_box = document.querySelector('.categoy_description_box');
const call_us = document.querySelector('.call_us');

headerLogo.addEventListener('click', function () {
    cells.forEach(function (cell) {
        cell.classList.remove('active');
    });

    const infoDiv = document.querySelector('.info');
    infoDiv.classList.remove('noneDisplay');

    darkOpen.classList.add('noneDisplay');
    setTimeout(function () {
        dataContainer.scrollTop = 0;
    }, 10);

    // call_us.classList.add('noneDisplay');
    categoy_description_box.classList.remove('noneDisplay');
    languageBox.classList.remove('translateX');
    switcher.classList.remove('translateX');
    checkbox_1.checked = false;
    checkbox_2.checked = false;
});

