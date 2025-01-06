document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const metricSelect = document.getElementById('add');
    const periodSelect = document.getElementById('add1');
    const date = new Date();
    const endDate = date.toISOString().split('T')[0];
    let chartInstance = null;
    const timeMap = {
        week: '7',
        month: '30',
        three_months: '90',
        year: '365'
    };
    const textMap = {
        likes: 'добавили в избранное',
        orders: 'оформили в заказах',
        views: 'просматривали',
        cartAdd: 'добавили в корзину'
    };
    
    const titleMap = {
        likes: 'лайков',
        orders: 'заказов',
        views: 'просмотров',
        cartAdd: 'в корзине'
    };
    const metricMap = {
        likes: 'add_to_favorites_count',
        orders: 'order_count',
        views: 'views',
        cartAdd: 'add_to_cart_count'
    };
    
    function calculateStartDate(period) {
        const startDate = new Date(date);
        switch (period) {
            case 'week':
                startDate.setDate(date.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(date.getMonth() - 1);
                break;
            case 'three_months':
                startDate.setMonth(date.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(date.getFullYear() - 1);
                break;
        }
        return startDate.toISOString().split('T')[0];
    }

    async function getAllGoods(){
        const response = await fetch('https://5.35.124.24:5000/api/goods', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    }

    function generateDateRange(startDate, endDate) {
        const dateData = [];
        let currentDate = new Date(startDate);
        while (currentDate <= new Date(endDate)) {
            dateData.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateData;
    }

    async function getMetricsRange(startDate, endDate, goods, maxCountMap) {
        const dateRange = generateDateRange(startDate, endDate);
        const dateData = {};
        for (const date of dateRange) {
            dateData[date] = {likes: 0, orders: 0, views: 0, cartAdd: 0};
        }
        for (const good of goods) {
            const response = await fetch(`https://5.35.124.24:5000/api/metrics/${good.id}/range?startDate=${startDate}&endDate=${endDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data == 'No metrics found in this date range') continue;
            for (const item of data) {
                const key = item.metric_date.split('T')[0];
                const likesCount = Math.max(0,item.add_to_favorites_count||0);
                const ordersCount = Math.max(0,item.order_count||0);
                const viewsCount = Math.max(0,item.views||0);
                const cartAddCount = Math.max(0,item.add_to_cart_count||0);
                maxCountMap['likes']+= likesCount;
                maxCountMap['orders']+= ordersCount;
                maxCountMap['views']+= viewsCount;
                maxCountMap['cartAdd']+= cartAddCount;
                dateData[key].likes += likesCount;
                dateData[key].orders += ordersCount;
                dateData[key].views += viewsCount;                
                dateData[key].cartAdd += cartAddCount;
            }
        }
        return dateData;
    }

    function drawChart(canvas, data, metric){
        const ctx = canvas.getContext('2d');
        if (chartInstance) {
            chartInstance.destroy();
        }
        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: metric,
                    data: Array.from(Object.values(data), item => item[metric]),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    fill: false,
                    lineTension: 0.1
                }]
            },
            options : {
                responsive: true,
                scales : {
                    y : {
                        beginAtZero : true
                    },
                },
            },
        });
    }

    async function getGoodMetricRange(startDate, endDate, goodId, metric) {
        const response = await fetch(`https://5.35.124.24:5000/api/metrics/${goodId}/range?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        let count = 0;
        if (data === 'No metrics found in this date range') return count;
        for (const item of data) {
            count += item[metricMap[metric]];
        }
        return count;
    }

    async function getFileLink(fileName) {
        if (fileName) {
            try{
                const response = await fetch(`https://5.35.124.24:5000/api/file/${fileName}`);
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                return response.json();
            } 
            catch (error) {
                console.error('Ошибка при получении ссылки на файл:', error);
                return null;
            }
        } else{
            return null;
        }
    }

    async function getGood(id) {
        try{
            const response = await fetch(`https://5.35.124.24:5000/api/goods/${id}`);
            if (!response.ok){
                throw new Error(`Ошибка: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async function updateCharts() {
        content.innerHTML = '';
        const graphics = document.createElement('div');
        graphics.classList.add('graphics');
        const text = document.createElement('h1');
        const selectedMetric = metricSelect.value;
        const selectedPeriod = periodSelect.value;
        let maxCountMap = {
            likes: 0,
            orders: 0,
            views: 0,
            cartAdd: 0
        };
        const allGoods = await getAllGoods();
        const startDate = calculateStartDate(selectedPeriod);
        const data = await getMetricsRange(startDate, endDate, allGoods, maxCountMap);
        text.textContent = `За последние ${timeMap[periodSelect.value]} дней ваши товары ${textMap[metricSelect.value]} ${maxCountMap[metricSelect.value]} раз`;
        graphics.appendChild(text);
        const currentCanvas = document.createElement('canvas');
        currentCanvas.id = metricSelect.value;
        graphics.appendChild(currentCanvas);
        content.appendChild(graphics);
        let canvas;
        switch (selectedMetric) {
            case 'likes':
                canvas = currentCanvas;
                break;
            case 'orders':
                canvas = currentCanvas;
                break;
            case 'views':
                canvas = currentCanvas;
                break;
            case 'cartAdd':
                canvas = currentCanvas;
                break;
        }
        if (canvas) {
            canvas.style.display = 'block';
            drawChart(canvas, data, selectedMetric);
        }
        const topGoods = document.createElement('div');
        topGoods.classList.add('popular-goods');
        const popularGoodsTitle = document.createElement('h2');
        popularGoodsTitle.textContent = 'Самые популярные товары за период';
        topGoods.appendChild(popularGoodsTitle);
        const goodsTable = document.createElement('div');
        goodsTable.classList.add('goods_table');
        const tableHeader = document.createElement('div');
        tableHeader.classList.add('table-header');
        tableHeader.innerHTML = `
            <p>Товары</p>
            <p>Количество ${titleMap[selectedMetric]}</p>
        `;
        goodsTable.appendChild(tableHeader);
        const tableBody = document.createElement('div');
        tableBody.classList.add('table-body');
        let goodsMap = {};
        for (const good of allGoods) {
            goodsMap[good.id] = await getGoodMetricRange(startDate, endDate, good.id, selectedMetric);
        }
        let items = Object.keys(goodsMap).map(function(key) {
            return [key, goodsMap[key]];
        });
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
        rate = 1;
        for (const item of items.slice(0, 5)) {
            const goodGood = await getGood(item[0]);
            const goodItem = document.createElement('div');
            goodItem.classList.add('stat-goods');
            const goodName = document.createElement('div');
            goodName.classList.add('stat-good');
            goodName.innerHTML = `
                <p>${rate}</p>
                <img src="${await getFileLink(goodGood.photos[0]) ? await getFileLink(goodGood.photos[0]) : 'assets/good_without_pic.jpg'}">
                <p>${goodGood.name}</p>
            `;
            goodItem.appendChild(goodName);
            const goodStat = document.createElement('div');
            goodStat.classList.add('stat-stat');
            goodStat.innerHTML = `<p>${item[1]}</p>`;
            goodItem.appendChild(goodStat);
            tableBody.appendChild(goodItem);
            rate++;
        }
        goodsTable.appendChild(tableBody);
        topGoods.appendChild(goodsTable);
        content.appendChild(topGoods);
    }

    metricSelect.addEventListener('change', updateCharts);
    periodSelect.addEventListener('change', updateCharts);

    updateCharts();
});