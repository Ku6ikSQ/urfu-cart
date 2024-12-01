document.addEventListener('DOMContentLoaded', function() {
    const modals = document.getElementById("editModal");
    const closeBtn = document.getElementsByClassName("close")[0];
    const saveButton = document.getElementById("saveButton");
    const fileInput = document.getElementById('fileInput');
    const previewImage = document.querySelector('#editModal .good_pic');
    function openModal(productName, productPrice,image,card) {
        document.getElementById("fileInput").value = null;
        document.getElementById("productBrand").value = productName;
        document.getElementById("productCountry").value = productPrice;
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
        const brand = document.getElementById('productBrand').value;
        const country = document.getElementById('productCountry').value;
        const description = document.getElementById('productDescription').value;
        getImagesPath(document.getElementById('fileInput'), function(image) {
        if (brand && country) {
            if (currentCard) {
                currentCard.querySelector('p').innerText = brand;
                currentCard.querySelector('.good_price p').innerText = country;
                currentCard.querySelector('.good_pic').src = image;
                modals.style.display = "none";
            }
        } else {
            alert('Заполните как минимум поля «Бренд» и «Страна»');
        }
    }, Firstimage);
}});
