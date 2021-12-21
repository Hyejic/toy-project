let accountArr = [];
let newGroupArrays = [];

const MyAccountUrl = "https://gist.githubusercontent.com/himchan94/a539fd8c884477a314044e8b423b9653/raw/4703f3ad54d707c1baec154783d3f1f382671d5a/myAccount.json"
const GmAccountUrl = "https://gist.githubusercontent.com/himchan94/283d5837431bec8d5cb88a6e3525c35f/raw/c498bf3113a9f32c03c484aaaae6ade5f86b4eb7/grandmotherAccount.json"


const getData = async () => {
  await fetch(MyAccountUrl)
  .then((res) => res.json())
  .then((obj) => accountArr.push(obj));

  await fetch(GmAccountUrl)
  .then((res) => res.json())
  .then((obj) => accountArr.push(obj));

  //날짜별 사용내역 배열 생성
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

  // 천단위 콤마
  const priceToString = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // 날짜 계산
  const date = () => {
    const now = new Date(); // 현재 날짜
    const nowYear = now.getFullYear(); // 현재 년
    const nowMonth = now.getMonth() + 1; // 현재 월
    const nowDate = now.getDate(); // 현재 날짜
    const lastDate = new Date(nowYear, nowMonth, 0); //현재 날짜의 말일
    const dateLeft = lastDate.getDate() - nowDate; // 남은 날짜 계산
    // console.log(dateLeft)

    return dateLeft;
  }
  date()

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
      accoutDiv[index].querySelector('.account-desc').textContent = `${date()}일 동안 ${priceToString(moneyLeft)}원 남음`;

      // 저금통
      const accountDivEls = inner.querySelectorAll('.account');
      accountEl.saveList.forEach((saveListEl) => {
        const piggyBankDiv = accountDivEls[index].querySelector('.save-list');
        const backTickPiggyBank = 
        `
          <li class="save-bar">
            <div class="save-progress" style="background-color:${saveListEl.color}"></div>
            <span class="save-name">${saveListEl.name}</span>
            <span class="save-money">${priceToString(saveListEl.money)}</span>
          </li>
        `
        piggyBankDiv.insertAdjacentHTML('beforeend',backTickPiggyBank);
      })
    })

    // 날짜 기준 array - 일일 사용 내역
    newGroupArrays.forEach((accoutEl, index) => {
      // console.log(accoutEl)
      const accountDivEls = inner.querySelectorAll('.account');
      const dayContDiv = accountDivEls[index].querySelector('.day-cont');
      
      for(let index = 0; index < accoutEl.length; index++){
        const dayListWrap = 
        `
          <li class="day-list">
            <div class="day-summary">
              <strong class="day">${accoutEl[index].date}</strong>
              <span class="total"></span>
            </div>
            <ul class="spend-cont">
            </ul>
          </li>
        `
        dayContDiv.insertAdjacentHTML('beforeend',dayListWrap);
        const dayListDiv = dayContDiv.querySelectorAll('.day-list');
        const spendCont = dayListDiv[index].querySelector('.spend-cont');
        accoutEl[index].dayLists.forEach((el) => {
          const dayList = 
          `
            <li class="spend-list">
              <span class="spend-title">${el.history}</span>
              <span class="spend-cost">${priceToString(el.price)}</span>
            </li>
          `
          spendCont.insertAdjacentHTML('beforeend',dayList)
        })
      }
    })
  }
  accoutSet()
}
getData()
