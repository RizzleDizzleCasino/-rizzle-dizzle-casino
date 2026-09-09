const symbols=["7️⃣","🍒","🔔","💎","🍋","⭐"];
let balance=Number(localStorage.getItem("rizzleBalance")||10000);
const bal=document.getElementById("balance"), status=document.getElementById("status");
function show(){bal.textContent=balance.toLocaleString();localStorage.setItem("rizzleBalance",balance)}
show();
document.getElementById("spin").addEventListener("click",()=>{
 const bet=Number(document.getElementById("bet").value);
 if(balance<bet){status.textContent="Not enough Rizzle Coins.";return}
 balance-=bet;
 let a=[0,0,0].map(()=>symbols[Math.floor(Math.random()*symbols.length)]);
 ["r1","r2","r3"].forEach((id,i)=>document.getElementById(id).textContent=a[i]);
 let mult=0;
 if(a[0]==="7️⃣"&&a.every(x=>x===a[0])) mult=20;
 else if(a.every(x=>x===a[0])) mult=8;
 else if(a[0]===a[1]||a[1]===a[2]||a[0]===a[2]) mult=2;
 let win=bet*mult; balance+=win;
 status.textContent=win?`RIZZLE WIN! +${win.toLocaleString()} coins 🎉`:`No win — spin again!`;
 show();
});