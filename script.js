"use strict";
const dessertList = document.querySelector(".dessertList");
const cartList = document.querySelector(".cartList");
const totalCart = document.querySelector(".totalCart");
const totalElement = document.querySelectorAll("#total");
// fetch data json
const fetchData = () => fetch("./data.json").then((res) => res.json());

let carts = [];
let isCheckout = false;

// render carts

const renderCarts = (carts) => {


  cartList.innerHTML = "";
  if (carts.length == 0) {
    totalCart.style.display = 'none'
    return cartList.innerHTML = ` <span>
                Your added items will appear here
              </span>`;
  };

  totalCart.style.display = 'block'
  let total = 0
  carts.forEach(({ name, qty, price }) => {
    if(qty == 0){
      totalCart.style.display = 'none'
      return cartList.innerHTML = ` <span>
                  Your added items will appear here
                </span>`;
    } 
    const totalPrice = (price * qty).toFixed(2);
    total += price * qty
    const divElement = document.createElement("div");
    divElement.className = "cartListItem";
    divElement.innerHTML = `
    <div class="contentItemCart">
      <span class="cartItemTitle">${name}</span>
        <div class="cartItemInfo">
        <span class="cartItemQty">${qty}x</span>
        <span class="cartItemPrice">$${price}</span>
        <span class="cartItemTotal">$${totalPrice}</span>
        </div> 
    </div>
    <span class="btnRemove"><i class="bi bi-x-circle"></i></span>
    `;
    divElement.querySelector(".btnRemove").addEventListener("click", () => {
      removeItemFromCart(name);
    });
  cartList.appendChild(divElement);
  });

  totalElement.forEach(e =>{
    e.textContent = `$${total.toFixed(2)}`
  })
  // totalElement.textContent = `$${total.toFixed(2)}`
  // totalCart.document.querySelector('.total').textContent = total
};

// Remove item from cart
const removeItemFromCart = (name) => {
  carts = carts.filter((item) => item.name !== name);
  renderCarts(carts); 
};

// render list data json
const listDataDesserts = async () => {
  
  const data = await fetchData();

  data.forEach(({ image, name, category, price }) => {
    const divElement = document.createElement("div");
    divElement.className = "dessertItem";

    divElement.innerHTML = `
      <img src="${image.desktop}" alt="${name}" />
      <button class='btnCustom btnAddToCart' data-name="${name}" data-price="${price}">
        <i class="bi bi-cart-plus"></i>
        <span>Add to Cart</span>
      </button>
      <div class='btnCustom btnUpdate' style="display: none;">
        <button class='btn btnCountMinus'><i class="bi bi-dash-circle"></i></button>
        <span class='itemCount'>1</span>
        <button class='btn btnCountAdd'><i class="bi bi-plus-circle"></i></button>
      </div>
      <div class='dessertItemInfo'>
        <span class='itemCate'>${category}</span>
        <h5 class='itemTitle'>${name}</h5>
        <span class='itemPrice'>$${price}</span>
      </div>
    `;

    dessertList.appendChild(divElement);
  });

  // Select all buttons and add event listeners
  dessertList.addEventListener("click", (e) => {
    if (e.target.closest(".btnAddToCart")) {
      const btn = e.target.closest(".btnAddToCart");
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      const imgSrc = btn.parentElement.querySelector('img').getAttribute('src')

      const existingItem = carts.find((item) => item.name === name);
      if (existingItem) {
        existingItem.qty += 1;
      } else {
        carts.push({ name, price, img : imgSrc , qty: 1 });
      }

      renderCarts(carts);

      const parentElement = btn.parentElement;
      const btnUpdate = parentElement.querySelector('.btnUpdate');
      const count = parentElement.querySelector('.itemCount');
      btnUpdate.style.display = 'flex';
      count.textContent = existingItem ? existingItem.qty : 1;
    }

    if (e.target.closest(".btnCountAdd")) {
      const btn = e.target.closest(".btnCountAdd");
      const parentElement = btn.parentElement.parentElement; // .btnUpdate's parent is .dessertItem
      const name = parentElement.querySelector(".btnAddToCart").dataset.name;
      const count = parentElement.querySelector(".itemCount");
      count.textContent = parseInt(count.textContent) + 1;

      const existingItem = carts.find((item) => item.name === name);
      existingItem.qty = parseInt(count.textContent);
      renderCarts(carts);
    }

    if (e.target.closest(".btnCountMinus")) {
      const btn = e.target.closest(".btnCountMinus");
      const parentElement = btn.parentElement.parentElement; // .btnUpdate's parent is .dessertItem
      const name = parentElement.querySelector(".btnAddToCart").dataset.name;
      const count = parentElement.querySelector(".itemCount");
      count.textContent = parseInt(count.textContent) - 1;

      const existingItem = carts.find((item) => item.name === name);
      existingItem.qty = parseInt(count.textContent);

      if (parseInt(count.textContent) <= 0) {
        const btnUpdate = parentElement.querySelector('.btnUpdate');
        btnUpdate.style.display = 'none';
        count.textContent = 0;
        removeItemFromCart(name);
      } else {
        renderCarts(carts);
      }
    }
  });

  // reset 


};


const checkoutBtn = document.querySelector('#checkoutBtn')
const modalListItem = document.querySelector('.modalListItem')

checkoutBtn.addEventListener('click', () => {
   modalListItem.innerHTML =''
  carts.forEach(item =>{
    const totalPrice = (item.price * item.qty).toFixed(2);
    const divElement = document.createElement('div')
    divElement.className ='modalItem' 
    divElement.innerHTML = `
      <div class="d-flex" style="gap:10px">
        <img src="${item.img}" alt="">
        <div class="d-flex flex-column" >
          <span class="cartItemTitle">${item.name}</span>
            <div class="">
              <span class="cartItemQty">${item.qty}x</span>
              <span class="cartItemPrice">$${item.price}</span>
             </div>
          </div>
       </div>
      <span class="cartItemTotal">$${totalPrice}</span>
    `
    modalListItem.appendChild(divElement)
  
  })
})

// btn order 
const btnOrder = document.querySelector('#btnOrder')

btnOrder.addEventListener('click' , ()=>{

  carts = []
  renderCarts(carts)
  listDataDesserts()
  isCheckout = true;

  const modalElement = document.querySelector('#checkoutModal'); 
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  modalInstance.hide(); 
})



renderCarts(carts)
listDataDesserts();
