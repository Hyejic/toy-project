let accountArr = [];

const MyAccountUrl = "https://gist.githubusercontent.com/himchan94/a539fd8c884477a314044e8b423b9653/raw/4703f3ad54d707c1baec154783d3f1f382671d5a/myAccount.json"
const GmAccountUrl = "https://gist.githubusercontent.com/himchan94/283d5837431bec8d5cb88a6e3525c35f/raw/c498bf3113a9f32c03c484aaaae6ade5f86b4eb7/grandmotherAccount.json"


const getData = async () => {
  await fetch(MyAccountUrl)
  .then((res) => res.json())
  .then((obj) => accountArr.push(obj));

  await fetch(GmAccountUrl)
  .then((res) => res.json())
  .then((obj) => accountArr.push(obj));

  console.log(accountArr)

  // 천단위 콤마
  function priceToString(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // 날짜 계산
  function date(){
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

  function accoutSet() {
    
    // 계좌
    for(let index = 0; index < accountArr.length; index++){
    // for(const index = 0; index < accountArr.length; index++){
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
    }

    // 저금통
    for(let index = 0; index < accountArr.length; index++){
      for(let saveListIndex = 0; saveListIndex < accountArr[index].saveList.length; saveListIndex++){
        const accoutDiv = document.querySelectorAll('.account');
        const saveListWrap = accoutDiv[index].querySelector('.save-list');
        const saveItem = document.querySelector('.save-bar').cloneNode(true);
        saveListWrap.appendChild(saveItem)
        accoutDiv[index].querySelector('.save-bar').hidden = false; 
        
        const saveBarEls = accoutDiv[index].querySelectorAll('.save-bar');
        saveBarEls[saveListIndex].querySelector('.save-progress').style.backgroundColor = accountArr[index].saveList[saveListIndex].color;
        saveBarEls[saveListIndex].querySelector('.save-name').textContent = accountArr[index].saveList[saveListIndex].name;
        saveBarEls[saveListIndex].querySelector('.save-money').textContent = accountArr[index].saveList[saveListIndex].money;
      }
    }

    // 전체 사용 내역
    for(let i = 0; i < accountArr.length; i++){
      
      const groupsList = accountArr[i].bankList.reduce((groups, dayList) => {
        const date = dayList.date;
        // console.log(date);
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
      console.log(groupArrays);
    }
  }
  accoutSet()
}
getData()
