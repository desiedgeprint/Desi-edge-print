const PRODUCTS_KEY="dep_products_v2", ORDERS_KEY="dep_orders_v2";
const defaultProducts=[
{name:"Personalized Bottle",cat:"Bottles",price:349,desc:"Photo printed bottles.",image:"assets/bottles.jpg"},
{name:"Heart Photo Pillow",cat:"Pillows",price:499,desc:"Custom heart photo pillow.",image:"assets/heart-pillow.jpg"},
{name:"Photo Keychains",cat:"Keychains",price:149,desc:"Personalized photo keychains.",image:"assets/keychains.jpg"},
{name:"Custom Photo T-Shirt",cat:"T-Shirts",price:499,desc:"Your design on a T-shirt.",image:"assets/tshirt.jpg"},
{name:"Birthday Photo Mug",cat:"Mugs",price:249,desc:"Birthday photo printed mug.",image:"assets/birthday-mugs.jpg"},
{name:"Magic Photo Mug",cat:"Magic Cups",price:449,desc:"Custom reveal magic mug.",image:"assets/magic-mug.jpg"}];
let products=JSON.parse(localStorage.getItem(PRODUCTS_KEY)||"null")||defaultProducts;
let cart=[];
const $=id=>document.getElementById(id);

function renderProducts(list=products){
 $("products").innerHTML=list.map((p,i)=>`<article class="card"><img src="${p.image}" alt="${p.name}"><div class="cardBody"><h3>${p.name}</h3><p>${p.desc}</p><div class="price">₹${p.price}</div><button class="add" onclick="addToCart(${i})">ADD TO CART</button></div></article>`).join("");
}
function showAll(){renderProducts()}
function filterProducts(cat){renderProducts(products.filter(p=>p.cat===cat))}
function addToCart(i){cart.push(products[i]);renderCart();$("cartOverlay").style.display="flex"}
function removeCart(i){cart.splice(i,1);renderCart()}
function renderCart(){
 $("cartCount").textContent=cart.length;
 $("cartItems").innerHTML=cart.length?cart.map((p,i)=>`<div class="cartLine"><b>${p.name}</b> — ₹${p.price}<button onclick="removeCart(${i})">REMOVE</button></div>`).join(""):"<p class='muted'>Your cart is empty.</p>";
 $("cartTotal").textContent=cart.reduce((s,p)=>s+Number(p.price),0);
}
function openCart(){ $("cartOverlay").style.display="flex"; renderCart() }
function closeCart(){ $("cartOverlay").style.display="none" }

function collectOrder(){
 const o={name:$("customerName").value.trim(),phone:$("customerPhone").value.trim(),address:$("customerAddress").value.trim(),city:$("customerCity").value.trim(),pin:$("customerPin").value.trim(),payment:$("payment").value};
 if(!o.name||!o.phone||!o.address||!o.city||!o.pin){alert("Please fill Name, Mobile, Address, City and PIN Code.");return null}
 o.items=cart.map(p=>({name:p.name,price:p.price}));o.total=cart.reduce((s,p)=>s+Number(p.price),0);
 o.id="DEP"+Date.now().toString().slice(-8);o.date=new Date().toLocaleString();o.status="Pending";return o;
}
function placeOrder(){
 if(!cart.length)return alert("Cart is empty.");
 const o=collectOrder();if(!o)return;
 const orders=JSON.parse(localStorage.getItem(ORDERS_KEY)||"[]");orders.unshift(o);localStorage.setItem(ORDERS_KEY,JSON.stringify(orders));
 cart=[];renderCart();clearCheckout();alert("Order placed successfully! Your Order ID is "+o.id);closeCart();
}
function clearCheckout(){["customerName","customerPhone","customerAddress","customerCity","customerPin"].forEach(id=>$(id).value="")}
function orderOnWhatsApp(){
 if(!cart.length)return alert("Cart is empty.");
 const o=collectOrder();if(!o)return;
 const lines=o.items.map(x=>x.name+" - ₹"+x.price).join("%0A");
 const text=`Hello Desi Edge Print,%0AOrder: ${o.id}%0AName: ${encodeURIComponent(o.name)}%0AMobile: ${encodeURIComponent(o.phone)}%0AAddress: ${encodeURIComponent(o.address)}%0ACity: ${encodeURIComponent(o.city)}%0APIN: ${encodeURIComponent(o.pin)}%0APayment: ${encodeURIComponent(o.payment)}%0AItems:%0A${lines}%0ATotal: ₹${o.total}`;
 window.open("https://wa.me/916386953268?text="+text,"_blank");
}

function openAdmin(){ $("adminOverlay").style.display="flex" }
function closeAdmin(){ $("adminOverlay").style.display="none" }
function adminLogin(){
 if($("adminPassword").value==="desiedge"){
  $("adminLogin").classList.add("hidden");$("adminPanel").classList.remove("hidden");renderAdminProducts();
 }else alert("Wrong admin password.");
}
function adminTab(tab){
 $("productAdmin").classList.toggle("hidden",tab!=="products");
 $("orderAdmin").classList.toggle("hidden",tab!=="orders");
 if(tab==="orders")renderAdminOrders();
}
function addProduct(){
 const name=$("pName").value.trim(),cat=$("pCategory").value,price=Number($("pPrice").value),desc=$("pDescription").value.trim(),file=$("pImage").files[0];
 if(!name||!price)return alert("Enter product name and price.");
 const save=image=>{products.push({name,cat,price,desc:desc||"Custom printed product.",image:image||"assets/bottles.jpg"});localStorage.setItem(PRODUCTS_KEY,JSON.stringify(products));renderProducts();renderAdminProducts();$("pName").value="";$("pPrice").value="";$("pDescription").value="";$("pImage").value="";alert("Product added.");};
 if(file){const r=new FileReader();r.onload=()=>save(r.result);r.readAsDataURL(file)}else save("");
}
function deleteProduct(i){if(!confirm("Delete this product?"))return;products.splice(i,1);localStorage.setItem(PRODUCTS_KEY,JSON.stringify(products));renderProducts();renderAdminProducts()}
function renderAdminProducts(){
 $("adminProducts").innerHTML=products.map((p,i)=>`<div class="adminProduct"><img src="${p.image}"><div class="grow"><b>${p.name}</b><br>₹${p.price} • ${p.cat}</div><button class="danger" onclick="deleteProduct(${i})">DELETE</button></div>`).join("");
}
function renderAdminOrders(){
 const orders=JSON.parse(localStorage.getItem(ORDERS_KEY)||"[]");
 $("adminOrders").innerHTML=orders.length?orders.map((o,i)=>`<div class="orderCard"><b>Order ${o.id}</b><br><span class="muted">${o.date}</span><p><b>${o.name}</b> • ${o.phone}</p><p>${o.address}, ${o.city} - ${o.pin}</p><p>${o.items.map(x=>x.name+" — ₹"+x.price).join("<br>")}<br><b>Total ₹${o.total}</b></p><p>Payment: ${o.payment} • Status: ${o.status}</p><button class="gold" onclick="completeOrder(${i})">MARK COMPLETED</button></div>`).join(""):"<p class='muted'>No orders yet.</p>";
}
function completeOrder(i){const o=JSON.parse(localStorage.getItem(ORDERS_KEY)||"[]");o[i].status="Completed";localStorage.setItem(ORDERS_KEY,JSON.stringify(o));renderAdminOrders()}
renderProducts();renderCart();