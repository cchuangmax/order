// API 設定
const API_URL = "https://api.rezio.io/v1/your_endpoint"; // 替換為正確的 API 端點
const API_KEY = "3200cdb3b2122d6cea5cc7feb968eb69"; // 你的 Rezio API 金鑰
const UUID = "8a5230a0-c31d-423c-97fd-b2915e662245"; // 你的 UUID

// 取得今日日期 (YYYY-MM-DD 格式)
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // 取得 YYYY-MM-DD 格式
}

// 呼叫 Rezio API 取得每日訂單
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

        const data = await response.json();
        displayOrders(data);
    } catch (error) {
        console.error("取得訂單失敗:", error);
    }
}

// 顯示訂單在網頁上
function displayOrders(data) {
    const orderList = document.getElementById("order-list");
    orderList.innerHTML = ""; // 清空列表

    if (!data || data.length === 0) {
        orderList.innerHTML = "<p>今日無訂單</p>";
        return;
    }

    data.forEach(order => {
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

// 初始載入
document.addEventListener("DOMContentLoaded", () => {
    const today = getTodayDate();
    fetchOrders(today);
});q
