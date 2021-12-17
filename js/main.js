window.addEventListener('load', () => {
  
  const spendSec = document.querySelector('.spend-section');
  const dragBar = document.querySelector('.dragbar');
  let targetCheck = false;
  dragBar.addEventListener('touchstart', () => {
    targetCheck = true;
    // console.log('targetCheck',targetCheck)
  })

  let touchStartY = null;
  let moveY = null;
  function touchStart(e) {
    const touch = e.touches[0];
    touchStartY = touch.clientY;
    // console.log('touchStartY',touchStartY)
  }
  function touchMove(e) {
    const touch = e.touches[0];
    let presentY = touch.clientY;
    if(touchStartY !== null){
      moveY = touchStartY - presentY;
      // console.log('moveY',moveY)
    }
  }
  spendSec.addEventListener('touchstart', touchStart);
  spendSec.addEventListener('touchmove', touchMove);
  document.addEventListener('touchend', () => {
    if(targetCheck === true){
      if(moveY > 0){
        spendSec.classList.add('open');
        // console.log('open','targetCheck',targetCheck)
      }else{
        spendSec.classList.remove('open');
        // console.log('close','targetCheck',targetCheck)
      }
      targetCheck = false
    }
  })
})

