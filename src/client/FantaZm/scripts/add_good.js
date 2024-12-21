document.addEventListener('DOMContentLoaded', async function() {
    const modals = document.getElementById("editModal1");
    const closeBtn = document.getElementById("close");
    const addButton = document.getElementById("addButton");
    const productContainer = document.getElementById("productContainer");
    const fileInput = document.getElementById('fileInput1');
    const previewImage = document.querySelector('#editModal1 .good_pic');
    const categories = document.getElementById('category-list1');
    categories.innerHTML = '';
    const response = await fetch(`https://5.35.124.24:5000/api/good-categories`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();
    const categoryList = [];
    data.forEach(category => {
        const option = document.createElement('option');
        option.value = category.title;
        categoryList.push(category.title);
        option.setAttribute('data-id', category.id);
        categories.appendChild(option);
    });
    function openModal() {
        document.getElementById("productName1").value = null;
        document.getElementById("productBrand1").value = null;
        document.getElementById("productPrice1").value = null;
        document.getElementById("productDescription1").value = null;
        document.getElementById("productCategory1").value = null;
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

    addButton.onclick = async function() {
        const name = document.getElementById('productName1').value;
        const brand = document.getElementById('productBrand1').value;
        const price = document.getElementById('productPrice1').value;
        const description = document.getElementById('productDescription1').value;
        const quantity = document.getElementById('goodsRemains1').value;
        const category = document.getElementById('productCategory1').value.trim();
        const image = document.getElementById('fileInput1').files[0];
        let uploadFileName = null;
        if (image){
            try{
                const uploadResult = await uploadFile(image);
                uploadFileName = uploadResult;
            } catch (error){
                console.error("Uploading file error: ",error);
                return;
            }
        }
        if (name && price) {
            if (!categoryList.includes(category)){
                alert('Выберите категорию из списка');
                return;
            }
            const newData = {
                'name': name,
                'description': description || '',
                'price': parseFloat(price),
                'category_id': document.querySelector(`#category-list1 option[value="${category}"]`).getAttribute('data-id'),
                'photos':[uploadFileName],
                'article':'',
                'discount':0,
                'brand': brand || '',
                'stock': quantity || 0
            };
            const response = await fetch(`https://5.35.124.24:5000/api/goods`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData)
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const metricdata = await response.json();
            const metricsResponse = await fetch(`https://5.35.124.24:5000/api/metrics/${metricdata.id}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'goods_id': metricdata.id,
                    'views': 0,
                    'add_to_cart_count': 0,
                    'order_count': 0
                })
            });
            if (!metricsResponse.ok) {
                throw new Error('Не удалось добавить метрики товара');
            }
            const ret = await metricsResponse.json();
            console.log(ret);
            alert('Товар успешно добавлен');
            modals.style.display = "none";
            window.location.reload();
        } else{
            alert('Заполните как минимум имя товара и цену');
        }
    }
});