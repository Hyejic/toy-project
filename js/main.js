window.addEventListener('load', () => {
  
  const spendSecLis = document.querySelectorAll('.spend-section');
  const dragBarLis = document.querySelectorAll('.dragbar');
  let targetCheck = false;

  // 드래그 방향 읽기
  let touchStartX = null;
  let touchStartY = null;
  let moveX = null;
  let moveY = null;

  function touchStart(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    console.log('ss')
  }
  function touchMove(e) {
    const touch = e.touches[0];
    let presentX = touch.clientX;
    let presentY = touch.clientY;
    if(touchStartY !== null){
      moveX = touchStartX - presentX;
      moveY = touchStartY - presentY;
    }
  }
  // document.addEventListener('touchstart', (e) => {
  //   console.log(e.target)
  // })
  // 사용내역 리스트 slide up,down
  dragBarLis.forEach((el) => {
    el.addEventListener('touchstart', () => {
      targetCheck = true;
    })
    el.addEventListener('touchstart', touchStart);
    el.addEventListener('touchmove', touchMove);
    el.addEventListener('touchend', () => {
      if(targetCheck === true){
        if(moveY > 0){
          el.parentNode.classList.add('open');
        }else{
          el.parentNode.classList.remove('open');
        }
        targetCheck = false
      }
    })
  })
  

  // // slider
  // const slider = document.querySelector('.slider');
  // const sliderInner = document.querySelector('.slider-inner');
  // const slideLis = sliderInner.querySelectorAll('.slider-inner > *');
  // const arrowWrap = document.createElement('div');
  // const arrowPrev = document.createElement('a');
  // const arrowNext = document.createElement('a');
  // slideLis.forEach(function(el) {
  //   el.classList.add('slider_item');
  // })

  // arrowWrap.className = 'arrow';
  // arrowPrev.className = 'prev';
  // arrowNext.className = 'next';
  // arrowPrev.textContent = '이전';
  // arrowNext.textContent = '다음';
  // arrowPrev.setAttribute('href','#');
  // arrowNext.setAttribute('href','#');

  // slider.appendChild(arrowWrap);
  // slider.querySelector('.arrow').appendChild(arrowPrev);
  // slider.querySelector('.arrow').appendChild(arrowNext);

  // // slider option
  // const moveButton = slider.querySelector('.arrow');
  // const liWidth = slideLis[0].clientWidth;
  // let moveDist = -liWidth;
  // let currentNum = 1;
  // let speedTime = 500;

  // // 클론만들기
  // const cloneA = slideLis[0].cloneNode(true);
  // const cloneC = slideLis[slideLis.length - 1].cloneNode(true);
  // sliderInner.insertBefore(cloneC, slideLis[0]);
  // sliderInner.appendChild(cloneA);

  // const slideCloneLis = sliderInner.querySelectorAll('.slider-inner > *');
  // const sliderWidth = liWidth * slideCloneLis.length;
  // sliderInner.style.width = `${sliderWidth}px`;
  // sliderInner.style.left = `${moveDist}px`;

  // slider.addEventListener('touchstart', touchStart );
  // slider.addEventListener('touchmove', touchMove);
  // slider.addEventListener('touchend', (e) => {
  //   // saveContSwipe = false
  //   moveSlide()
  // })

  // moveButton.addEventListener('click', moveSlide);

  // function moveSlide(e) {
  //   spendSecLis.forEach((el) => {
  //     el.classList.remove('open')
  //   })
  //   // if (moveX > 50) {
  //   if (e.target.className === 'next') {
  //       move(-1);
  //       if (currentNum === slideCloneLis.length - 1) {
  //         setTimeout(() => {
  //           sliderInner.style.transition = 'none';
  //           moveDist = -liWidth;
  //           sliderInner.style.left = `${-liWidth}px`;
  //           currentNum = 1;
  //         }, speedTime);
  //       }
  //   // } else if(moveX < -50) {
  //   } else {
  //       move(1);
  //       if (currentNum === 0) {
  //         setTimeout(() => {
  //           sliderInner.style.transition = 'none';
  //           moveDist = -liWidth * (slideCloneLis.length - 2)
  //           sliderInner.style.left = `${moveDist}px`;
  //           currentNum = slideCloneLis.length - 2;
  //         }, speedTime);
  //       } 
  //   }
  //   function move(direction) {
  //     currentNum += (-1 * direction);
  //     moveDist += liWidth * direction;
  //     sliderInner.style.transition = `all ${speedTime}ms ease`;
  //     sliderInner.style.left = `${moveDist}px`;
  //     // console.log('next',currentNum)
  //     // console.log('liWidth',moveDist)
  //   }
  // } // 메인
})

