let searchInput = document.getElementById("searchBox");
let productList = document.getElementById("productContainer");

searchInput.addEventListener("input", function () {
  let searchitem = searchInput.value.toLowerCase();
  let products = productList.getElementsByTagName("p");
  for (let i = 0; i < products.length; i++) {
    let productName =  products[i].innerText;
    if(productName.toLowerCase().includes(searchitem)) {
        products[i].style.display=""
    }else{
        products[i].style.display="none"
    }
  }
});