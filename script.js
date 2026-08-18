const d = window.STORE_DATA;
const $ = id => document.getElementById(id);

function e(s) {
  return String(s ?? "").replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
function render() {
  const logo = document.querySelector(".logo");
  if (logo) logo.innerHTML = e(d.brand).replace("EDGE", "<span>EDGE</span>");
  const list = $("productList"), sel = $("sel");
  list.innerHTML = ""; sel.innerHTML = "";
  d.products.forEach((p,i) => {
    const imgs = p.imgs || [], first = imgs[0] || "";
    list.innerHTML += `<article class="card"><div class="gallery">${first ? `<img id="im${i}" src="${e(first)}" alt="${e(p.name)}">` : `<div style="height:100%;display:flex;align-items:center;justify-content:center;font-size:80px">🛍️</div>`}<div class="dots">${imgs.map((x,j)=>`<span class="dot ${j===0?'active':''}" onclick="slide(${i},${j})"></span>`).join("")}</div></div><h3>${e(p.name)}</h3><div class="desc">${e(p.desc)}</div><div class="row"><span class="price">₹${Number(p.price||0)}</span><span class="badge">CUSTOM</span></div><button class="btn sm" style="width:100%" onclick="pick(${i})">Order →</button></article>`;
    sel.innerHTML += `<option value="${i}">${e(p.name)} — ₹${Number(p.price||0)}</option>`;
  });
  calc();
}
function slide(i,j) {
  const p=d.products[i], el=$("im"+i);
  if (el && p.imgs && p.imgs[j]) el.src=p.imgs[j];
}
function pick(i) { $("sel").value=i; calc(); location.hash="order"; }
function calc() {
  const p=d.products[Number($("sel").value)||0];
  if (p) $("total").textContent="₹"+(Number(p.price||0)*Number($("qty").value||1));
}
$("sel").onchange=calc; $("qty").oninput=calc;
function sendOrder() {
  const p=d.products[Number($("sel").value)], q=$("qty").value, n=$("name").value.trim(), m=$("mobile").value.trim(), a=$("address").value.trim(), note=$("note").value.trim();
  if(!n||!m||!a){alert("Please fill in your name, mobile number and full address.");return;}
  const msg=`Namaste Desi Edge Print!\n\nProduct: ${p.name}\nQuantity: ${q}\nEstimated Total: ₹${Number(p.price)*Number(q)}\nName: ${n}\nMobile: ${m}\nAddress: ${a}\nDesign/Note: ${note||"N/A"}`;
  window.open("https://wa.me/916386953268?text="+encodeURIComponent(msg),"_blank");
}

// Optional local editor for testing. It does NOT publish changes to GitHub.
function openAdmin(){
  alert("Future product changes are easiest in products.js. Upload the new image, then edit products.js and Commit changes on GitHub.");
}
render();
