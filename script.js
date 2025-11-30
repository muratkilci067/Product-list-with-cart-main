    let cartItems = [];
    const container = document.getElementById("container");

    fetch("data.json")
    .then((response)=>response.json())
    .then((data)=>{
      data.forEach((item, index)=>{
        const dessert = document.createElement("div");
        dessert.classList.add("dessert-div");

        const picture = document.createElement("picture");

        const sourceDesktop = document.createElement("source");
        sourceDesktop.media = "(min-width: 1024px)";
        sourceDesktop.srcset = item.image.desktop;

        const sourceTablet = document.createElement("source");
        sourceTablet.media = "(min-width: 768px)";
        sourceTablet.srcset = item.image.tablet;

        const sourceMobile = document.createElement("source");
        sourceMobile.media = "(max-width: 767px)"
        sourceMobile.srcset = item.image.mobile;

        const img = document.createElement("img");
        img.src = item.image.thumbnail;
        img.alt = item.name;
        img.classList.add("imageSize");

        picture.appendChild(sourceDesktop);
        picture.appendChild(sourceTablet);
        picture.appendChild(sourceMobile);
        picture.appendChild(img);

        const name = document.createElement("h3");
        name.textContent = item.name;
        name.classList.add("name");

        const category = document.createElement("p");
        category.textContent = item.category;
        category.classList.add("category");

        const price = document.createElement("p");
        price.textContent = `$${item.price.toFixed(2)}`;
        price.classList.add("price");

        const button = document.createElement("button");
        button.textContent = `Add to Cart`;
        button.classList.add("add-btn");

        button.addEventListener("click", ()=>{
          
          const counterDiv = document.createElement("div");
          counterDiv.classList.add("counter");

          const minusBtn = document.createElement("button");
          minusBtn.textContent="-";
          minusBtn.classList.add("counter-btn");

          const plusBtn = document.createElement("button");
          plusBtn.textContent="+";
          plusBtn.classList.add("counter-btn");

          const quantity = document.createElement("span");
          quantity.textContent = "1";
          quantity.classList.add("quantity-number");

          counterDiv.appendChild(minusBtn);
          counterDiv.appendChild(quantity);
          counterDiv.appendChild(plusBtn);

          dessert.replaceChild(counterDiv,button);

          img.classList.add("selected");


          const existingItem = cartItems.find(ci => ci.id === index);
          if(existingItem){
            existingItem.quantity += 1;
          } else {
            cartItems.push({
              id: index,
              name: item.name,
              price: item.price,
              quantity: 1,
              img: item.image.thumbnail
            });
          }
          updateCartUI();

          plusBtn.addEventListener("click", ()=>{
            const currentItem = cartItems.find(ci => ci.id === index);
            currentItem.quantity +=1;
            quantity.textContent = currentItem.quantity;
            updateCartUI();
          });

          minusBtn.addEventListener("click", ()=>{
            const currentItem = cartItems.find(ci => ci.id === index);
            if(currentItem.quantity>1){
              currentItem.quantity -=1;
              quantity.textContent = currentItem.quantity;
              updateCartUI();
            }else{
              dessert.replaceChild(button,counterDiv);
              img.classList.remove("selected");
              cartItems = cartItems.filter(ci => ci.id !== index);
              updateCartUI();
            }
          })
        })
       
        dessert.appendChild(picture);
        dessert.appendChild(button);
        dessert.appendChild(category);
        dessert.appendChild(name);
        dessert.appendChild(price);
        
        container.appendChild(dessert);
      })
    })
    
    function updateCartUI(){
      const cartContainer = document.querySelector(".quantity");
      cartContainer.innerHTML = "";

      const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
      cartContainer.innerHTML = `<h2>Your Cart (${totalQuantity})</h2>`;

      if(cartItems.length === 0){
        cartContainer.innerHTML = `
        <h2>Your Cart</h2>
        <img src="assets/images/illustration-empty-cart.svg" alt="">
        <p>Your added items will appear here</p>
        `;
        return;
      }
      
      let totalPrice = 0;

      cartItems.forEach(item => {
        totalPrice += item.price * item.quantity;

        const cartItemDiv = document.createElement("div");
        cartItemDiv.classList.add("cart-item");
        const removeIconPath = "assets/images/icon-remove-item.svg";

        cartItemDiv.innerHTML= `
        <div class="cart-info">
         <div class="cart-info-sub"><p>${item.name}</p>
         <p class="item-inf"><span class="item-inf-1">${item.quantity}x</span><span class="item-inf-2">@$${item.price.toFixed(2)}</span><span class="item-inf-3">$${(item.price*item.quantity).toFixed(2)}</span></p></div>
         </div>
         <img src="${removeIconPath}" alt="remove" class="remove-img">
        `;

        cartContainer.appendChild(cartItemDiv);

        cartItemDiv.querySelector(".remove-img").addEventListener("click", ()=>{
          cartItems = cartItems.filter(ci => ci.name !== item.name);

          const dessertDiv = Array.from(container.children).find(div =>
            div.querySelector(".name").textContent === item.name
          );

          if(!dessertDiv){
            return;
          }

          const button = document.createElement("button");
          button.textContent = "Add to Cart";
          button.classList.add("add-btn");

          const img = dessertDiv.querySelector("img");
          img.classList.remove("selected");

          const counterDiv = dessertDiv.querySelector(".counter");
          if(counterDiv){
            dessertDiv.replaceChild(button, counterDiv);
          }
          /*after remove btn- refreshing counter btns*/
          button.addEventListener("click", ()=>{
          const counterDiv = document.createElement("div");
          counterDiv.classList.add("counter");

          const minusBtn = document.createElement("button");
          minusBtn.textContent="-";
          minusBtn.classList.add("counter-btn");

          const plusBtn = document.createElement("button");
          plusBtn.textContent="+";
          plusBtn.classList.add("counter-btn");

          const quantity = document.createElement("span");
          quantity.textContent = "1";
          quantity.classList.add("quantity-number");

          counterDiv.appendChild(minusBtn);
          counterDiv.appendChild(quantity);
          counterDiv.appendChild(plusBtn);

          dessertDiv.replaceChild(counterDiv,button);

          img.classList.add("selected");


          const existingItem = cartItems.find(ci => ci.name === item.name);
          if(existingItem){
            existingItem.quantity += 1;
            quantity.textContent = existingItem.quantity;
          } else {
            cartItems.push({
              id: item.name,
              name: item.name,
              price: item.price,
              quantity: 1,
              img: item.img
            });
          }
          updateCartUI();

          plusBtn.addEventListener("click", ()=>{
            const currentItem = cartItems.find(ci => ci.name === item.name);
            currentItem.quantity +=1;
            quantity.textContent = currentItem.quantity;
            updateCartUI();
          });

          minusBtn.addEventListener("click", ()=>{
            const currentItem = cartItems.find(ci => ci.name === item.name);
            if(currentItem.quantity>1){
              currentItem.quantity -=1;
              quantity.textContent = currentItem.quantity;
              updateCartUI();
            }else{
              dessertDiv.replaceChild(button,counterDiv);
              img.classList.remove("selected");
              cartItems = cartItems.filter(ci => ci.name !== item.name);
              updateCartUI();
            }
          })
          });

          updateCartUI();
        });
      });
      const totalDiv = document.createElement("div");
      totalDiv.classList.add("cart-total");
      totalDiv.innerHTML=`<span class="total-text">Order Total</span><h3>$${totalPrice.toFixed(2)}</h3>`;
      cartContainer.appendChild(totalDiv);
      const carbonDiv = document.createElement("div");
      carbonDiv.classList.add("carbon-neutral");
      carbonDiv.innerHTML=`<img src="assets/images/icon-carbon-neutral.svg" alt="">
      <p>This is carbon-neutral delivery</p>`;
      cartContainer.appendChild(carbonDiv);
      const confirmBtn = document.createElement("button");
      confirmBtn.classList.add("confirm-btn");
      confirmBtn.textContent="Confirm Order";

      confirmBtn.addEventListener("click", ()=>{
      const modalIcon = "assets/images/icon-order-confirmed.svg";
      const modalMain = document.getElementById("modal-main");
      modalMain.classList.remove("hidden");
      modalMain.classList.add("modal");
      overlay.classList.remove("hidden");

        modalMain.innerHTML= `
        <div class="cart-info2">
        <img src="${modalIcon}" alt="modal" class="modal-icon">
        <h2 class="order-conf">Order Confirmed</h2>
        <p class="enjoy-food">We hope you enjoy your food!</p>
        <div class="modal-items">
          ${cartItems
          .map(
            (ci) => `
        <div class="cart-info-sub2">
        <div><img src="${ci.img}" alt="thumbnail" class="thumbnail-img"></div>
        <div><p>${ci.name}</p>
        <p class="item-inf">
        <span class="item-inf-1">${ci.quantity}x</span>
        <span class="item-inf-2">@$${ci.price.toFixed(2)}</span></p></div>
        <div><p class="item-inf-3">$${(ci.price*ci.quantity).toFixed(2)}</p></div>
        </div>
            `
      )
       .join("")}
       <div class="order-total2"><span class="total-text">Order Total</span><h3>$${totalPrice.toFixed(2)}</h3></div>
       </div> 

       
       <button id="newOrderBtn">Start New Order</button>
        </div>
        `;

        document.getElementById("newOrderBtn").addEventListener("click", closeModal);
    });

      cartContainer.appendChild(confirmBtn);
    }
    const modalMain = document.getElementById("modal-main");
    const overlay = document.getElementById("overlay");
    overlay.addEventListener("click", ()=>{
      closeModal();
    });
    

    function closeModal() {
    modalMain.classList.add("hidden");
    overlay.classList.add("hidden");

    // 1. Cart'i sıfırla
    cartItems = [];
    updateCartUI();

    // 2. Tüm dessert divlerini resetle
    const dessertDivs = container.querySelectorAll(".dessert-div");
    dessertDivs.forEach(dessertDiv => {
        const counterDiv = dessertDiv.querySelector(".counter");
        const img = dessertDiv.querySelector("img");
        if(counterDiv){
            // Counter varsa kaldır, yerine "Add to Cart" butonu ekle
            const button = document.createElement("button");
            button.textContent = "Add to Cart";
            button.classList.add("add-btn");

            // eski counter'ı değiştir
            dessertDiv.replaceChild(button, counterDiv);

            // img'den selected class'ı kaldır
            img.classList.remove("selected");

            // Add to Cart butonuna event ekle
            const index = Array.from(container.children).indexOf(dessertDiv);
            const itemData = { 
                id: index,
                name: dessertDiv.querySelector(".name").textContent,
                price: parseFloat(dessertDiv.querySelector(".price").textContent.replace("$","")),
                img: img.src
            };
            button.addEventListener("click", () => {
                const counterDiv = document.createElement("div");
                counterDiv.classList.add("counter");

                const minusBtn = document.createElement("button");
                minusBtn.textContent = "-";
                minusBtn.classList.add("counter-btn");

                const plusBtn = document.createElement("button");
                plusBtn.textContent = "+";
                plusBtn.classList.add("counter-btn");

                const quantity = document.createElement("span");
                quantity.textContent = "1";
                quantity.classList.add("quantity-number");

                counterDiv.appendChild(minusBtn);
                counterDiv.appendChild(quantity);
                counterDiv.appendChild(plusBtn);

                dessertDiv.replaceChild(counterDiv, button);
                img.classList.add("selected");

                const existingItem = cartItems.find(ci => ci.id === index);
                if(existingItem){
                    existingItem.quantity +=1;
                } else {
                    cartItems.push({ id: index, name: itemData.name, price: itemData.price, quantity: 1, img: itemData.img });
                }
                updateCartUI();

                plusBtn.addEventListener("click", () => {
                    const currentItem = cartItems.find(ci => ci.id === index);
                    currentItem.quantity +=1;
                    quantity.textContent = currentItem.quantity;
                    updateCartUI();
                });
                minusBtn.addEventListener("click", () => {
                    const currentItem = cartItems.find(ci => ci.id === index);
                    if(currentItem.quantity>1){
                        currentItem.quantity -=1;
                        quantity.textContent = currentItem.quantity;
                        updateCartUI();
                    } else {
                        dessertDiv.replaceChild(button,counterDiv);
                        img.classList.remove("selected");
                        cartItems = cartItems.filter(ci => ci.id !== index);
                        updateCartUI();
                    }
                });
            });
        }
    });
}


    updateCartUI();


