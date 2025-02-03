// API 設定
const API_URL = "https://api.rezio.io/v1/product/list"; // 替換為正確的 API 端點
const API_KEY = "3200cdb3b2122d6cea5cc7feb968eb69"; // 你的 Rezio API 金鑰
const UUID = "8a5230a0-c31d-423c-97fd-b2915e662245"; // 你的 UUID

// 取得 YYYY-MM-DD 格式的日期
function getFormattedDate(offset) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().split('T')[0]; // 取得 YYYY-MM-DD 格式
}

// 獲取未來 30 天的訂單
async function fetchOrdersForNextMonth() {
    const orderContainer = document.getElementById("order-container");
    orderContainer.innerHTML = ""; // 清空內容

    for (let i = 0; i < 30; i++) {
        const date = getFormattedDate(i);
        const orders = await fetchOrders(date);
        displayOrders(date, orders);
    }
}

// 呼叫 Rezio API 取得訂單
async function fetchOrders(date) {
    try {
        const response = await fetch(`${API_URL}?date=${date}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "x-rezio-uuid": UUID
            }
        });

        if (!response.ok) {
            throw new Error(`API 回應錯誤: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`取得 ${date} 訂單失敗:`, error);
        return [];
    }
}

// 顯示訂單在網頁上，支援展開/收合功能
function displayOrders(date, orders) {
    const orderContainer = document.getElementById("order-container");

    // 創建標題 (可點擊展開/收合)
    const dayHeader = document.createElement("h2");
    dayHeader.textContent = `${date} (${orders.length} 筆訂單)`;
    dayHeader.style.cursor = "pointer";
    dayHeader.onclick = function () {
        orderList.style.display = orderList.style.display === "none" ? "block" : "none";
    };
    
    orderContainer.appendChild(dayHeader);

    // 訂單列表 (預設隱藏)
    const orderList = document.createElement("ul");
    orderList.style.display = "none";

    if (orders.length === 0) {
        const noOrderItem = document.createElement("li");
        noOrderItem.textContent = "今日無訂單";
        orderList.appendChild(noOrderItem);
    } else {
        orders.forEach(order => {
            const item = document.createElement("li");
            item.innerHTML = `
                <strong>訂單編號:</strong> ${order.id} <br>
                <strong>客戶名稱:</strong> ${order.customer_name} <br>
                <strong>行程名稱:</strong> ${order.tour_name} <br>
                <strong>預定日期:</strong> ${order.date} <br>
                <strong>訂單狀態:</strong> ${order.status} <br>
            `;
            orderList.appendChild(item);
        });
    }

    orderContainer.appendChild(orderList);
}

// 初始載入
document.addEventListener("DOMContentLoaded", fetchOrdersForNextMonth);
