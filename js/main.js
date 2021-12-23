'use strict';

let accountArr = [];
let newGroupArrays = [];

const MyAccountUrl = "https://gist.githubusercontent.com/himchan94/a539fd8c884477a314044e8b423b9653/raw/045a98969d43f50cacd168835d4b83b985658478/myAccount.json"
const GmAccountUrl = "https://gist.githubusercontent.com/himchan94/283d5837431bec8d5cb88a6e3525c35f/raw/12fda6b36c8dd6e29a9b878a236a363d4c85d561/grandmotherAccount.json"


const getData = async () => {
  await fetch(MyAccountUrl)
  .then((res) => res.json())
  .then((obj) => accountArr.push(obj));

  await fetch(GmAccountUrl)
  .then((res) => res.json())
  .then((obj) => accountArr.push(obj));

  // 드래그 방향 읽기
  let touchStartX = 0;
  let touchStartY = 0;
  const touchStart = (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }
  let moveX = 0;
  let moveY = 0;
  const touchMove = (e) => {
    const touch = e.touches[0];
    let presentX = touch.clientX;
    let presentY = touch.clientY;
    if(touchStartY !== null){
      moveX = touchStartX - presentX;
      moveY = touchStartY - presentY;
    }
  }
  // 일일내역 slideup
  const event = (() => {
    let targetCheck = false;

    document.addEventListener('touchstart', (e) => {
      if(e.target.className === 'dragbar'){
        targetCheck = true;
        touchStart(e)
      }
    })
    document.addEventListener('touchmove', (e) => {
      if(e.target.className === 'dragbar'){
        touchMove(e)
      }
    })
    document.addEventListener('touchend', (e) => {
      if(e.target.className === 'dragbar'){
        if(targetCheck === true){
          if(moveY > 0){
            e.target.parentNode.classList.add('open');
          }else{
            e.target.parentNode.classList.remove('open');
          }
          targetCheck = false
        }
      }
    })
  })()
  //날짜별 사용내역 배열 생성
  const daylistArrSet = (() => {
    for(let index = 0; index < accountArr.length; index++){
      const groupsList = accountArr[index].bankList.reduce((groups, dayList) => {
        const date = dayList.date;
        if(!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(dayList);
        return groups;
      }, {});
      const groupArrays = Object.keys(groupsList).map((date) => {
        return {
          date,
          dayLists: groupsList[date]
        };
      });
      newGroupArrays.push(groupArrays)
    }
  })()
  // 천단위 콤마
  const priceToString = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  // 날짜 계산
  const dateLeft = () => {
    const now = new Date(); // 현재 날짜
    const nowYear = now.getFullYear(); // 현재 년
    const nowMonth = now.getMonth() + 1; // 현재 월
    const nowDay = now.getDate(); // 현재 날짜
    const lastDate = new Date(nowYear, nowMonth, 0); //현재 날짜의 말일
    const setDayLeft = lastDate.getDate() - nowDay; // 남은 날짜 계산
    // console.log(dateLeft)

    return setDayLeft;
  }
  // 날짜 바꾸기 '오늘','어제'
  const dateReplace = (date) => {
    const nowDate = new Date(); // 현재 날짜
    const overDate = new Date(date); // 현재 날짜
    const nowYear = nowDate.getFullYear(); // 현재 년
    const nowMonth = nowDate.getMonth() + 1; // 현재 월
    const nowDay = nowDate.getDate(); // 현재 날짜
    const nowDateCombi = `${nowYear}-${nowMonth}-${nowDay}`
    const yesterdayDateCombi = `${nowYear}-${nowMonth}-${nowDay-1}`
    let setDate = date;
    if(nowDateCombi === date){
      setDate = "오늘";
    }else if(yesterdayDateCombi === date){
      setDate = "어제";
    }else if(nowDate < overDate){
      setDate = "미래";
    }
    return setDate;
  }
  //계좌 화면 출력
  const accoutSet = () => {
    const inner = document.querySelector('.slider-inner');

    accountArr.forEach((accountEl, index) => {
      const slideInner = document.querySelector('.slider-inner');
      const accountDivClone = document.querySelector('.account').cloneNode(true);
      slideInner.appendChild(accountDivClone)
      document.querySelector('.account').hidden = false; 
      
      const accoutDiv = document.querySelectorAll('.account');
      const totalMoney = accountArr[index].accountMoney;
      const totalSpend = accountArr[index].totalSpend;
      const limit = accountArr[index].limit;
      const limitPer = totalSpend / limit * 100;
      const moneyLeft= limit - totalSpend;
      
      accoutDiv[index].querySelector('.account-nickname').textContent = accountArr[index].accountName;
      accoutDiv[index].querySelector('.account-num').textContent = accountArr[index].accountNumber;
      accoutDiv[index].querySelector('.account-money strong').textContent = priceToString(totalMoney);
      accoutDiv[index].querySelector('.progress').style.width = `${limitPer}%`;
      accoutDiv[index].querySelector('.progress').style.backgroundColor = accountArr[index].progressColor;
      accoutDiv[index].querySelector('.account-desc').textContent = `${dateLeft()}일 동안 ${priceToString(moneyLeft)}원 남음`;

    })

    // 저금통
    const accountDivEls = inner.querySelectorAll('.account');
    accountDivEls.forEach((accountDivEl, index) => {
      const piggyBankDiv = accountDivEl.querySelector('.save-list');
      accountArr[index].saveList.forEach((saveListEl) => {
        const piggyBankProgress = saveListEl.money / saveListEl.target * 100;
        const backTickPiggyBank = 
          `<li class="save-bar">
            <div class="save-progress" style="background-color:${saveListEl.color}; width:${piggyBankProgress}%"></div>
            <span class="save-name">${saveListEl.name}</span>
            <span class="save-money">${priceToString(saveListEl.money)}</span>
          </li>`;
        piggyBankDiv.insertAdjacentHTML('beforeend',backTickPiggyBank);
      })
    })

    // 날짜 기준 array - 일일 사용 내역
    newGroupArrays.forEach((accoutEl, index) => {
      const accountDivEls = inner.querySelectorAll('.account');
      const dayContDiv = accountDivEls[index].querySelector('.day-cont');

      for(let index = 0; index < accoutEl.length; index++){
        const dayListWrap = 
          `<li class="day-list">
            <div class="day-summary">
              <strong class="day">${dateReplace(accoutEl[index].date)}</strong>
              <span class="total"></span>
            </div>
            <ul class="spend-cont">
            </ul>
          </li>`;
        dayContDiv.insertAdjacentHTML('beforeend',dayListWrap);

        const dayListDiv = dayContDiv.querySelectorAll('.day-list');
        const spendCont = dayListDiv[index].querySelector('.spend-cont');
        const daySpendTotal = dayListDiv[index].querySelector('.total');
        let daySpendMoney = 0;  
        accoutEl[index].dayLists.forEach((dayListEl) => {
          const depositValue = dayListEl.income === 'in' ? true : false;
          const depositClass = depositValue ? 'deposit' : 'spending';
          const depositText = depositValue ? '+' : '';
          const dayList = 
          `<li class="spend-list ${depositClass}">
            <span class="spend-title">${dayListEl.history}</span>
            <span class="spend-cost">${depositText}${priceToString(dayListEl.price)}</span>
          </li>`;
          spendCont.insertAdjacentHTML('beforeend',dayList);
          daySpendMoney += depositValue ? 0 : dayListEl.price;
        })
        daySpendTotal.textContent = priceToString(daySpendMoney);
      }
    })
    const dayTextWrapEls = document.querySelectorAll('.day');
    dayTextWrapEls.forEach((el) => {
      if(el.innerText === "미래") el.parentNode.parentNode.remove();
    })
  }
  accoutSet()

  //저금통 영역 swipe 중복 이벤트 막기
  const saveContBubbling = () => {
    const saveCont = document.querySelectorAll('.save-cont');
    saveCont.forEach((el) => {
      el.addEventListener('touchstart', (e) => {
        e.stopPropagation()
      })
      el.addEventListener('touchmove', (e) => {
         e.stopPropagation()
      })
      el.addEventListener('touchend', (e) => {
         e.stopPropagation()
      })
    })
  }
  saveContBubbling()

  //slider 구현
  const slider = () => {
    // slider
    const slider = document.querySelector('.slider');
    const sliderInner = document.querySelector('.slider-inner');
    const slideLis = sliderInner.querySelectorAll('.account');
    const arrowWrap = document.createElement('div');
    const arrowPrev = document.createElement('a');
    const arrowNext = document.createElement('a');
  
    slideLis.forEach(function(el) {
      el.classList.add('slider_item');
    })
  
    arrowWrap.className = 'arrow';
    arrowPrev.className = 'prev';
    arrowNext.className = 'next';
    arrowPrev.textContent = '이전';
    arrowNext.textContent = '다음';
    arrowPrev.setAttribute('href','#');
    arrowNext.setAttribute('href','#');
  
    slider.appendChild(arrowWrap);
    slider.querySelector('.arrow').appendChild(arrowPrev);
    slider.querySelector('.arrow').appendChild(arrowNext);
  
    // slider option
    const moveButton = slider.querySelector('.arrow');
    const liWidth = slideLis[0].clientWidth;
    let moveDist = -liWidth;
    let currentNum = 1;
    let speedTime = 500;
  
    // 클론만들기
    const cloneA = slideLis[0].cloneNode(true);
    const cloneC = slideLis[slideLis.length - 1].cloneNode(true);
    sliderInner.insertBefore(cloneC, slideLis[0]);
    sliderInner.appendChild(cloneA);
  
    const slideCloneLis = sliderInner.querySelectorAll('.slider-inner > *');
    const sliderWidth = liWidth * slideCloneLis.length;
    sliderInner.style.width = `${sliderWidth}px`;
    sliderInner.style.left = `${moveDist}px`;

    const removeOpen = () => {
      const spendSecLis = document.querySelectorAll('.spend-section');
      spendSecLis.forEach((el) => {
        el.classList.remove('open');
        setTimeout(() => {
          el.querySelector('.day-cont').scrollTop = 0;
          el.querySelector('.save-cont').scrollLeft = 0; 
        },500)
        
      })
    }
  
    const moveSlide = (e) => {
      const move = (direction) => {
        currentNum += (-1 * direction);
        moveDist += liWidth * direction;
        sliderInner.style.transition = `all ${speedTime}ms ease`;
        sliderInner.style.left = `${moveDist}px`;
      }
      if (moveX > 100 || e.target.className === 'next') {
      // if (e.target.className === 'next') {
        move(-1);
        if (currentNum === slideCloneLis.length - 1) {
          setTimeout(() => {
            sliderInner.style.transition = 'none';
            moveDist = -liWidth;
            sliderInner.style.left = `${-liWidth}px`;
            currentNum = 1;
          }, speedTime);
        }
        removeOpen()
      } else if(moveX < -100 || e.target.className === 'prev') {
      // } else {
        move(1);
        if (currentNum === 0) {
          setTimeout(() => {
            sliderInner.style.transition = 'none';
            moveDist = -liWidth * (slideCloneLis.length - 2)
            sliderInner.style.left = `${moveDist}px`;
            currentNum = slideCloneLis.length - 2;
          }, speedTime);
        } 
        removeOpen()
      }else {
        return false
      }
      moveX = 0;
      moveY = 0;
    }
    slider.addEventListener('touchstart', touchStart);
    slider.addEventListener('touchmove', touchMove);
    slider.addEventListener('touchend', moveSlide);
  }
  slider()
}
getData()
