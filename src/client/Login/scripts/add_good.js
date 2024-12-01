document.addEventListener('DOMContentLoaded', function() {
    const modals = document.getElementById("editModal1");
    const closeBtn = document.getElementById("close");
    const addButton = document.getElementById("addButton");
    const productContainer = document.getElementById("productContainer");
    const fileInput = document.getElementById('fileInput1');
    const previewImage = document.querySelector('#editModal1 .good_pic');
    function openModal() {
        document.getElementById("productName1").value = null;
        document.getElementById("productBrand1").value = null;
        document.getElementById("productPrice1").value = null;
        document.getElementById("productDescription1").value = null;
        document.getElementById("goodsRemains1").value = null;
        document.getElementById("fileInput1").value = null;
        modals.style.display = "block";
    }
    closeBtn.onclick = function() {
        modals.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modals) {
            modals.style.display = "none";
        }
    };

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            console.log('Выбрано изображение:', file.name);
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('add').addEventListener('click', function() {
        openModal();
    });

    addButton.onclick = function() {
        const name = document.getElementById('productName1').value;
        const brand = document.getElementById('productBrand1').value;
        const price = document.getElementById('productPrice1').value;
        const description = document.getElementById('productDescription1').value;
        const quantity = document.getElementById('goodsRemains1').value;
        getImagesPath(document.getElementById('fileInput1'), function(image) {
        if (name && price) {
            const newCard = document.createElement('div');
            newCard.className = "good_card";
            newCard.innerHTML = `
                <img src="${image}" class="good_pic">
                <img class="pencil" src="assets/pencil.png" id="edit_pencil">
                <p>${name}</p>
                <div class="good_price">
                    <p>${price}₽</p>
                </div>`;
            productContainer.appendChild(newCard);
            modals.style.display = "none";
        } else {
            alert('Заполните как минимум поля «Наименование товара» и «Цена»');
        }
    });
}});
