const products=[
{name:"Custom Mug",cat:"Mugs",price:249,icon:"☕"},
{name:"Premium T-Shirt",cat:"T-Shirts",price:499,icon:"👕"},
{name:"Custom Keychain",cat:"Keychains",price:149,icon:"🔑"},
{name:"Printed Bottle",cat:"Bottles",price:349,icon:"🥤"},
{name:"Custom Pillow",cat:"Pillows",price:399,icon:"🛏️"},
{name:"Magic Cup",cat:"Magic Cups",price:449,icon:"☕"}
];
let cart=[];
function render(list=products){document.getElementById("productGrid").innerHTML=list.map((p,i)=>`<article class="card"><div class="pic">${p.icon}</div><div class="info"><h3>${p.name}</h3><small>${p.cat}</small><p class="price">₹${p.price}</p><button class="add" onclick="addToCart(${products.indexOf(p)})">ADD TO CART</button></div></article>`).join("")}
function filterProducts(cat){render(cat==="all"?products:products.filter(p=>p.cat===cat));document.getElementById("shop").scrollIntoView({behavior:"smooth"})}
function addToCart(i){cart.push(products[i]);document.getElementById("cartCount").textContent=cart.length;updateCart();openCart()}
function updateCart(){let total=cart.reduce((s,p)=>s+p.price,0);document.getElementById("cartTotal").textContent=total;document.getElementById("cartItems").innerHTML=cart.length?cart.map((p,i)=>`<div class="cartItem"><span>${p.name}</span><b>₹${p.price}</b></div>`).join(""):"<p>Your cart is empty.</p>"}
function openCart(){document.getElementById("cartPanel").style.display="flex";updateCart()}
function closeCart(){document.getElementById("cartPanel").style.display="none"}
function checkout(){if(!cart.length)return alert("Cart is empty");alert("Order system ready — connect your WhatsApp/payment link here.");}
function toggleMenu(){const n=document.getElementById("nav");n.style.display=n.style.display==="flex"?"none":"flex";n.style.position="absolute";n.style.top="72px";n.style.right="0";n.style.background="#111";n.style.padding="20px";n.style.flexDirection="column"}
render();