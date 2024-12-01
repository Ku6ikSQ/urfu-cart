document.addEventListener('DOMContentLoaded', function() {
    const modals = document.getElementById("editModal");
    const closeBtn = document.getElementsByClassName("close")[0];
    const saveButton = document.getElementById("saveButton");
    const fileInput = document.getElementById('fileInput');
    const previewImage = document.querySelector('#editModal .good_pic');
    function openModal(productName, productPrice,image,card) {
        document.getElementById("fileInput").value = null;
        document.getElementById("productName").value = productName;
        document.getElementById("productPrice").value = productPrice;
        document.querySelector('.modal .good_pic').src = image;
        currentCard = card;
        Firstimage = image;
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


    document.querySelectorAll('.pencil').forEach(item => {
        item.addEventListener('click', event => {
            const card = event.target.closest('.good_card');
            const productName = card.querySelector('p').innerText;
            const productPrice = card.querySelector('.good_price p').innerText;
            const image = card.querySelector('.good_pic').src;
            openModal(productName, productPrice, image, card);
        });
    });

    saveButton.onclick = function() {
        const name = document.getElementById('productName').value;
        const brand = document.getElementById('productBrand').value;
        const price = document.getElementById('productPrice').value;
        const description = document.getElementById('productDescription').value;
        const quantity = document.getElementById('goodsRemains').value;
        getImagesPath(document.getElementById('fileInput'), function(image) {
        if (name && price) {
            if (currentCard) {
                var old_price = ' ' + currentCard.querySelector('.good_price p').innerText + '₽';
                old_price = '<strike>' + old_price + '</strike>';
                currentCard.querySelector('p').innerText = name;
                currentCard.querySelector('.good_price p').innerText = price+'₽';
                currentCard.querySelector('.good_price p').innerHTML += old_price;
                const search = '<p>₽</p>';
                currentCard.innerHTML = currentCard.innerHTML.replace(search, '');
                currentCard.querySelector('.good_pic').src = image;
                modals.style.display = "none";
            }
        } else {
            alert('Заполните как минимум поля «Наименование товара» и «Цена»');
        }
    }, Firstimage);
}});
