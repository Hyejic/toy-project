window.addEventListener('load', () => {
  
  const spendSec = document.querySelector('.spend-section');
  
  spendSec.addEventListener('click', () => {
    if(spendSec.classList.contains('open')){
      spendSec.classList.remove('open')
    }else {
      spendSec.classList.add('open')
    }
  })
  
})

