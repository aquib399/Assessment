//Query
const queryID = document.getElementById("searchID");

//Container
const table = document.getElementById("table");
const product = document.getElementById("product");
//Corresponding values
const productID = document.getElementById("PRODUCTID");
const productName = document.getElementById("PRODUCTNAME");
const productDes = document.getElementById("DESCRIPTION");
const productPrice = document.getElementById("PRICE");

//Buttons
const listBtn = document.getElementById("LIST");
const retrieveBtn = document.getElementById("RETRIEVE");
const updateBtn = document.getElementById("UPDATE");
const updateProductBtn = document.getElementById("UPDATEPRODUCT");

listBtn.addEventListener("click", () => {
    table.style.visibility = "visible";
    product.style.visibility = "hidden";
    listProduct();
});
retrieveBtn.addEventListener("click", () => {
    table.style.visibility = "hidden";
    product.style.visibility = "visible";
    retrieveProduct(queryID.value);
});
updateBtn.addEventListener("click", () => {
    const newPrice = prompt("Enter new price");
    if (newPrice) {
        updatePrice(queryID.value, newPrice);
    }
});

async function listProduct() {
    for (let i = 1; i < table.rows.length; ) {
        table.deleteRow(i);
    }
    const res = await fetch("/listProduct", {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await res.json();
    if (data.code == 503) {
        alert("Server error");
        return;
    }
    addRow(data.data);
}
async function retrieveProduct(ID) {
    const res = await fetch("/retrieve", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID }),
    });
    const data = await res.json();
    if (data.code == 503) {
        alert("Server error");
        return;
    }
    if (data.code == 404) {
        alert("Not found");
        return;
    }
    addData(data);
}
async function updatePrice(ID, newPrice) {
    const res = await fetch(`/update/${ID}/${newPrice}`, {
        method: "put",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await res.json();
    if (data.code == 400) {
        alert("Cannot find");
        return;
    }
    if (data.code == 503) {
        alert("Server error");
        return;
    }
    if (data.code == 405) {
        alert("please enter a number");
        return;
    }
    alert("Updated ");
}
function addRow(data) {
    data.forEach((ele) => {
        const row = table.insertRow();
        row.insertCell(0).innerHTML = ele.id;
        row.insertCell(1).innerHTML = ele.name;
        row.insertCell(2).innerHTML = ele.des;
        row.insertCell(3).innerHTML = ele.price;
    });
}
function addData(data) {
    productID.innerText = data.id;
    productName.innerText = data.name;
    productDes.innerText = data.des;
    productPrice.value = data.price;
}
updateProductBtn.addEventListener("click", () => {
    updatePrice(productID.innerText, productPrice.value);
});
