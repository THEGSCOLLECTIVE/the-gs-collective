const products = [
 {id:1,name:"Red Roses Bouquet",cat:"Flowers",price:120,emoji:"💐",tag:"Popular",rating:"4.8"},
 {id:2,name:"Premium Gift Hamper",cat:"Gifts",price:150,emoji:"🎁",tag:"Best Seller",rating:"4.9"},
 {id:3,name:"Family Grocery Package",cat:"Groceries",price:100,emoji:"🛒",tag:"Hot",rating:"4.7"},
 {id:4,name:"Smartphone",cat:"Electronics",price:2499,emoji:"📱",tag:"Featured",rating:"4.9"},
 {id:5,name:"Traditional Dress",cat:"Clothing",price:180,emoji:"👗",tag:"Popular",rating:"4.8"},
 {id:6,name:"Beauty & Skincare Set",cat:"Beauty",price:95,emoji:"🧴",tag:"New",rating:"4.6"},
 {id:7,name:"Home Essentials Box",cat:"Home & Living",price:220,emoji:"🏠",tag:"Popular",rating:"4.7"},
 {id:8,name:"Kids Toy Bundle",cat:"Toys",price:85,emoji:"🧸",tag:"New",rating:"4.8"}
];
let cart = JSON.parse(localStorage.getItem("gsCart") || "[]");
let activeCategory = "All";

function money(n){return "AED " + n.toLocaleString("en-AE",{minimumFractionDigits:2,maximumFractionDigits:2})}
function renderProducts(){
 const q=(document.getElementById("searchInput").value||"").toLowerCase();
 const list=products.filter(p=>(activeCategory==="All"||p.cat===activeCategory) && (!q||p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q)));
 document.getElementById("filterLabel").textContent=activeCategory+(q?` · “${q}”`:"");
 document.getElementById("products").innerHTML=list.length?list.map(p=>`
 <article class="product"><div class="product-img">${p.emoji}</div><div class="product-body">
 <div class="tag">${p.tag}</div><h3>${p.name}</h3><div class="cat">${p.cat} · Addis Ababa delivery</div>
 <div class="price">${money(p.price)}</div><div class="rating">★ ${p.rating} · UAE → Ethiopia</div>
 <button class="add" onclick="addToCart(${p.id})">🛒 Add to Cart</button></div></article>`).join(""):`<p>No products found.</p>`;
}
function filterCategory(cat){activeCategory=cat;renderProducts();document.getElementById("shop").scrollIntoView({behavior:"smooth"})}
function searchProducts(){renderProducts();document.getElementById("shop").scrollIntoView({behavior:"smooth"})}
function addToCart(id){const item=cart.find(x=>x.id===id); if(item)item.qty++; else cart.push({id,qty:1}); saveCart(); showMessage("Added to cart."); scrollToCart()}
function saveCart(){localStorage.setItem("gsCart",JSON.stringify(cart));document.getElementById("cartCount").textContent=cart.reduce((a,b)=>a+b.qty,0);renderCart()}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart()}
function renderCart(){
 const el=document.getElementById("cartContent");
 if(!cart.length){el.innerHTML="Your cart is empty. Add products above.";return}
 const total=cart.reduce((sum,i)=>sum+products.find(p=>p.id===i.id).price*i.qty,0), deposit=total/2;
 el.innerHTML=`${cart.map(i=>{const p=products.find(x=>x.id===i.id);return `<div class="cart-item"><div class="cart-item-info"><span class="cart-emoji">${p.emoji}</span><div><strong>${p.name}</strong><div class="cat">${money(p.price)} each</div></div></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button> <b>${i.qty}</b> <button onclick="changeQty(${p.id},1)">+</button></div></div>`}).join("")}
 <div class="cart-total">Total: <span>${money(total)}</span><br><small>50% deposit now: ${money(deposit)} · 50% on delivery: ${money(deposit)}</small></div>
 <div style="text-align:right;margin-top:15px"><button class="primary" onclick="document.getElementById('checkout').scrollIntoView({behavior:'smooth'})">Continue to Checkout →</button></div>`;
}
function scrollToCart(){document.getElementById("cart").scrollIntoView({behavior:"smooth"})}
function showMessage(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2800)}
function placeOrder(e){
 e.preventDefault();
 if(!cart.length){showMessage("Please add at least one product.");return}
 const data=Object.fromEntries(new FormData(e.target).entries());
 const total=cart.reduce((sum,i)=>sum+products.find(p=>p.id===i.id).price*i.qty,0);
 const orderId="GS"+Date.now().toString().slice(-7);
 const itemsText=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `${p.name} x${i.qty}`}).join(", ");
 const message=`Hello The GS Collective 👋%0A%0AI just placed order *${orderId}*.%0A%0A*Customer:* ${data.customer}%0A*WhatsApp:* ${data.customerPhone}%0A*Recipient:* ${data.recipient}%0A*Recipient phone:* ${data.recipientPhone||"Not provided"}%0A*Delivery:* Addis Ababa, Ethiopia%0A*Address:* ${data.address}%0A*Items:* ${itemsText}%0A*Total:* ${money(total)}%0A*50% deposit:* ${money(total/2)}%0A%0AI would like to confirm my order and arrange the 50% deposit.`;
 localStorage.setItem("lastOrder",JSON.stringify({orderId,...data,total,deposit:total/2,items:cart}));
 cart=[];saveCart();e.target.reset();
 document.getElementById("cartContent").innerHTML=`<div style="padding:20px 0"><h3>Order ${orderId} received ✓</h3><p>Your 50% deposit due is <strong>${money(total/2)}</strong>.</p><p>Please use one of the WhatsApp buttons below to confirm the order.</p><p>Recipient: ${data.recipient} · Addis Ababa</p></div>`;
 const box=document.getElementById("whatsappConfirm");
 box.hidden=false;
 document.getElementById("whatsappOrderText").textContent=`Order ${orderId} · 50% deposit ${money(total/2)}. Choose either WhatsApp number below.`;
 document.getElementById("waEth").href=`https://wa.me/251973143610?text=${message}`;
 showMessage("Order created. Please confirm on WhatsApp.");
 document.getElementById("whatsappConfirm").scrollIntoView({behavior:"smooth"});
}
