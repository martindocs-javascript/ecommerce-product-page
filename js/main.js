const headerMenu = document.querySelector('.header-menu ul');
const qtyContainer = document.querySelector('.qty-container');
const amount = document.querySelector('.amount');
const thumbnailCarousel = document.querySelector('.thumbnails');
const lightboxThumbnails = document.querySelector('.lightbox-thumbnails');
const itemsIn = document.querySelector('.cart-itemsIn');
const lightbox = document.querySelector('.lightbox-container');
const closeModalWindow = document.querySelector('.close-lightbox');
const currentImg = document.querySelector('.current-img');
const addToCheckout = document.querySelector('.button');
const showHideCart = document.querySelector('.cart-icon');
const lightboxControllers = document.querySelector('.lightbox-controls');

let qty = 0;
let priceTag = 0;


// hover menu effect
function menuHoverIn(e){
    if(e.target.tagName === 'LI'){
        const menuUnderline = e.srcElement.childNodes[1];
        menuUnderline.style.display = 'block';        
    }    
}
function menuHoverOut(e){
    if(e.target.tagName === 'LI'){
        const menuUnderline = e.srcElement.childNodes[1];
        menuUnderline.style.display = 'none';        
    }    
}

// default msg in checkout window
function checkOutEmpty(){
    const cartContent = document.querySelector('.cart-content');    
    cartContent.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    
}

// gallery thumbnail / lightbox thumbnail carousel
function moveBetweenThumbnails(srcImg, thumbnailClass) {
    if(srcImg.target.tagName === 'IMG'){                
        thumbnailClass = srcImg.target.parentNode.parentNode.classList[0];

        // get current selected thumbnail and remove 'selected' class from it
        const currentThumbSelected = document.querySelector(`.${thumbnailClass} .selected`);             
        const currentThumbContainer = document.querySelector(`.${thumbnailClass}`);
        
        currentThumbSelected.classList.remove('selected');

        // add the class 'selected' to new clicked thumbnail       
        srcImg.target.parentNode.classList.add('selected');

        // get the url of selected thumbnail and modify, it point to current viewed img  
        const newImgUrl = (srcImg.target.attributes[0].value).replace('-thumbnail', '');
       
        // target current image container and change with current selected thumbnail
        currentThumbContainer.parentElement.querySelector('.current-img').src = newImgUrl;
    }    
}


function getData(){    
    const tempArr = Array.from(lightboxThumbnails.querySelectorAll('div img'));
    
    return tempArr.map(img=>{
            return (img.attributes.src.value).replace('-thumbnail', '');
        });    
}

// show lightbox
function showLightbox(img){    
    const modalBox = document.querySelector('.lightbox-container .current-img');
    const getCurrentImg = img.target.attributes[1].value;

    // get current image and show in lightbox
    modalBox.src = getCurrentImg;

    // inject thumbnail carousel to lightbox with current selected thumbnail
    lightboxThumbnails.innerHTML = thumbnailCarousel.innerHTML;
    
    // show lightbox
    lightbox.style.visibility = 'visible';    
   
    
    // get all thumbnail images
    const currentThumbContainer = document.querySelectorAll(`.lightbox-thumbnails div`);

    // loop through all thumbnail images and get current selected and it's index ID
    const elemID = Array.from(currentThumbContainer).map((i, index)=> {
        return {
            id: index,
            elem: i
        }
    }).filter(elem=> elem.elem.className === 'selected');

    // position of 'selected' thumbnail
    let slideIndex = elemID[0].id;
    let pos = 0; 

    // show slides when 'prev' or 'next' pressed
    function showSlides(n){
        const slides = Array.from(currentThumbContainer);
        
        if (n > slides.length-1) {slideIndex = 0}    
        if (n < 0) {slideIndex = slides.length - 1}
        
        // display current lightbox image
        document.querySelector('.lightbox-modal .current-img').src = getData()[slideIndex];

        // re-select lightbox thumbnail with 'selected' class
        slides.map((e, i)=> {
            if(e.classList.value === 'selected'){e.classList.remove('selected')}
            if(i === slideIndex){e.classList.add('selected')}
        });
       
    }
    
    // listener to 'prev' / 'next' lightbox button
    lightboxControllers.addEventListener('click', (e)=>{        
        if(e.target.classList.contains('next-container')){pos = 1}
        if(e.target.classList.contains('prev-container')){pos = -1}
                 
        showSlides(slideIndex += pos);;        
    });
    
}

// close the lightbox
function closeLightBox(){        
    lightbox.style.visibility = 'hidden';
}

// calculate the price
function calculateProductPrice(price){  
    if(price.target.classList.value === 'plus'){
        qty++;  
        priceTag += 125; 
    }else if(price.target.classList.value === 'minus' && qty > 0){
        qty--;
        priceTag -= 125;
    }
    amount.innerText = qty;
}

// add the price and other info to checkout
function checkOutFinalPayment(){   
    const productSelected = Array.from(thumbnailCarousel.children).filter((e)=> e.className === 'selected' ).map((e)=> {
     return {        
         img: e.innerHTML,
         price: priceTag,
         quantity: qty
         }
     });
      
     const cartContent = document.querySelector('.cart-content');
     
     
     if(productSelected[0].quantity != 0){
        cartContent.innerHTML = `
            <div class="cart-product-container">        
                <div class="product-info">
                    ${productSelected[0].img}          
                    <div class="product-price-summary">
                    <div class="product-title">Fall Limited Edition Sneakers</div>
                    <div class="product-finial-payment">
                        <span>£125 </span>
                        <span>x ${qty} </span>
                        <span class="price-tag">£${priceTag}</span>                   
                    </div>
                    </div>
                    <div class="cart-bin"></div>
                </div>   
                <input type="submit" value="Checkout" />             
            </div>   
        `;        
        
        // show the product details in the cart
        const cartProductContent = document.querySelector('.cart-product-container');
        cartProductContent.style.display = 'block';

        // add the product amount to bubble by cart icon
        itemsIn.innerHTML = qty;
        itemsIn.style.display = 'block';        
    }

    // event listener to bin icon
    document.querySelector('.cart-bin').addEventListener('click', ()=>{        
        // remove product info/price from the checkout
        document.querySelector('.cart-product-container').remove();
        qty = 0;
        priceTag = 0;
        amount.innerHTML = qty;
        itemsIn.innerHTML = '';
        itemsIn.style.display = 'none';
        // show default msg
        checkOutEmpty();
    });
}

// show/hide checkout window
function showHideCheckOut(){
    const cart = document.querySelector('.cart-window-container'); 
    if(cart.style.visibility == 'hidden'){
        cart.style.visibility = 'visible';
    }else{
        cart.style.visibility = 'hidden';
    }
}


// hover menu effect
headerMenu.addEventListener('mouseover', menuHoverIn);
headerMenu.addEventListener('mouseout', menuHoverOut);

// gallery thumbnail carousel
thumbnailCarousel.addEventListener('click', moveBetweenThumbnails);

// lightbox thumbnail carousel
lightboxThumbnails.addEventListener('click', moveBetweenThumbnails);

// show lightbox
currentImg.addEventListener('click', showLightbox);

// close lightbox 
closeModalWindow.addEventListener('click', closeLightBox);

// calculate the price
qtyContainer.addEventListener('click', calculateProductPrice);

// checkout the product price
addToCheckout.addEventListener('click', checkOutFinalPayment);

// show/hide cart window
showHideCart.addEventListener('click', showHideCheckOut);



