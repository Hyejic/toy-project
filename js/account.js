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
    
    // accout div
    for(let i = 0; i < accountArr.length; i++){
      const slideInner = document.querySelector('.slider-inner');
      const accountDivClone = document.querySelector('.account').cloneNode(true);
      // console.log(i)
      slideInner.appendChild(accountDivClone)
      document.querySelector('.account').hidden = false; 
      
      const accoutDiv = document.querySelectorAll('.account');
      const totalMoney = accountArr[i].accountMoney;
      const totalSpend = accountArr[i].totalSpend;
      const limit = accountArr[i].limit;
      const limitPer = totalSpend / limit * 100;
      const moneyLeft= limit - totalSpend;
      
      accoutDiv[i].querySelector('.account-nickname').textContent = accountArr[i].accountName;
      accoutDiv[i].querySelector('.account-num').textContent = accountArr[i].accountNumber;
      accoutDiv[i].querySelector('.account-money strong').textContent = priceToString(totalMoney);
      accoutDiv[i].querySelector('.progress').style.width = `${limitPer}%`;
      accoutDiv[i].querySelector('.progress').style.backgroundColor = accountArr[i].progressColor;
      accoutDiv[i].querySelector('.account-desc').textContent = `${date()}일 동안 ${priceToString(moneyLeft)}원 남음`;

      const saveList = accoutDiv[i].querySelector('.save-list');
      // const saveItem = document.querySelector('.save-bar').cloneNode(true);
      // document.querySelector('.save-bar').hidden
      // console.log(accountArr[i].saveList.length)
      for(let j = 0; j < accountArr[i].saveList.length; j++){
        console.log(accountArr[i].saveList[j].name)
        const saveItem = document.createElement('li');
        const saveProgress = document.createElement('div');
        const saveName = document.createElement('span');
        const saveMoney = document.createElement('span');

        saveItem.className = "save-bar";
        saveProgress.className = "save-progress";
        saveName.className = "save-name";
        saveName.textContent = accountArr[i].saveList[j].name;
        saveMoney.className = "save-money";
        saveName.textContent = accountArr[i].saveList[j].money;
        // saveList.appendChild(saveItem)
        console.log('@@@@@@@@@@@@@@@@@@@@@')
      }


      console.log('-------------------')

    }

  }
  accoutSet()
}
getData()

// window.addEventListener('load',function(){
  
//   const accountDiv = document.querySelector('#accountDiv')
//   console.log(accountDiv)

// })