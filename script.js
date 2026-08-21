const cats=["Mugs","T-Shirts","Keychains","Bottles","Pillows","Magic Cups"];
let products=JSON.parse(localStorage.getItem("dep_products")||"null")||[
{name:"Classic Custom Mug",cat:"Mugs",price:249,desc:"Personalized ceramic mug.",image:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=85"},
{name:"Premium Printed T-Shirt",cat:"T-Shirts",price:499,desc:"Custom printed T-shirt.",image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85"},
{name:"Custom Keychain",cat:"Keychains",price:149,desc:"Personalized keychain.",image:"https://images.unsplash.com/photo-1604328471151-b52226907017?auto=format&fit=crop&w=700&q=85"},
{name:"Printed Bottle",cat:"Bottles",price:349,desc:"Reusable custom bottle.",image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=85"},
{name:"Custom Pillow",cat:"Pillows",price:399,desc:"Soft custom pillow.",image:"https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=85"},
{name:"Magic Cup",cat:"Magic Cups",price:449,desc:"Heat reveal custom cup.",image:"https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=700&q=85"}];
let cart=[];

function renderCats(){catsDiv.innerHTML=cats.map(c=>`<button onclick="filterCat('${c}')"><img src="${products.find(p=>p.cat===c)?.image||''}"><span>${c.toUpperCase()}</span></button>`).join("");pc.innerHTML=cats.map(c=>`<option>${c}</option>`).join("")}
function renderProducts(list=products){document.getElementById("products").innerHTML=list.map((p,i)=>`<article class="card"><img src="${p.image}" alt=""><div class="info"><h3>${p.name}</h3><p>${p.desc}</p><div class="price">₹${p.price}</div><button class="add" onclick="add(${i})">ADD TO CART</button></div></article>`).join("")}
function filterCat(c){renderProducts(products.filter(p=>p.cat===c))}
function add(i){cart.push(products[i]);update();openCart()}
function update(){count.textContent=cart.length;items.innerHTML=cart.length?cart.map((p,i)=>`<div class="order"><b>${p.name}</b> — ₹${p.price}<button onclick="removeItem(${i})">×</button></div>`).join(""):"<p class='muted'>Cart is empty.</p>";total.textContent=cart.reduce((s,p)=>s+p.price,0)}
function removeItem(i){cart.splice(i,1);update()}
function openCart(){cart.style.display="flex"} function closeCart(){cartOverlay.style.display="none";document.getElementById("cart").style.display="none"}
function placeOrder(){if(!cart.length)return alert("Cart is empty");let data={id:"DEP"+Date.now().toString().slice(-7),name:name.value,phone:phone.value,address:address.value,city:city.value,pin:pin.value,payment:payment.value,items:cart.map(p=>p.name),total:cart.reduce((s,p)=>s+p.price,0),date:new Date().toLocaleString()};if(!data.name||!data.phone||!data.address||!data.city||!data.pin)return alert("Please fill all delivery details");let os=JSON.parse(localStorage.getItem("dep_orders")||"[]");os.unshift(data);localStorage.setItem("dep_orders",JSON.stringify(os));cart=[];update();alert("Order placed! Order ID: "+data.id);closeCart()}
function openAdmin(){admin.style.display="flex"} function closeAdmin(){admin.style.display="none"}
function login(){if(pass.value==="desiedge"){loginBox();}else alert("Wrong password")}
function loginBox(){document.getElementById("login").classList.add("hidden");dashboard.classList.remove("hidden");renderAdmin()}
function tab(t){productsTab.classList.toggle("hidden",t!=="products");ordersTab.classList.toggle("hidden",t!=="orders");if(t==="orders")renderOrders()}
function saveProduct(){let file=pi.files[0], finish=img=>{products.push({name:pn.value,cat:pc.value,price:Number(pp.value),desc:pd.value,image:img||pu.value});localStorage.setItem("dep_products",JSON.stringify(products));renderCats();renderProducts();renderAdmin();alert("Product saved")};if(file){let r=new FileReader();r.onload=()=>finish(r.result);r.readAsDataURL(file)}else finish("")}
function renderAdmin(){adminList.innerHTML=products.map((p,i)=>`<div class="adminItem"><img src="${p.image}"><div class="grow"><b>${p.name}</b><br>₹${p.price}</div><button onclick="del(${i})">DELETE</button></div>`).join("")}
function del(i){products.splice(i,1);localStorage.setItem("dep_products",JSON.stringify(products));renderCats();renderProducts();renderAdmin()}
function renderOrders(){let os=JSON.parse(localStorage.getItem("dep_orders")||"[]");orders.innerHTML=os.length?os.map(o=>`<div class="order"><b>Order ${o.id}</b><br>${o.name} • ${o.phone}<br>${o.address}, ${o.city} - ${o.pin}<br>${o.items.join(", ")}<br><b>Total ₹${o.total}</b><br><small>${o.date} • ${o.payment}</small></div>`).join(""):"<p class='muted'>No orders yet.</p>"}

const catsDiv=document.getElementById("cats");renderCats();renderProducts();update();