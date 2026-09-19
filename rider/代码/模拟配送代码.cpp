#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <math.h>
#define MAX_ORDERS 100        // 定义每个骑手最多可以处理的订单数量
#define MAX_RIDERS 10         // 定义最多的骑手数量
#define MAX_TRAFFIC_STATUS 3  // 定义交通状况的最大值

// 订单结构体定义
typedef struct {
    int id;          // 订单ID
    double x;        // 订单的X坐标
    double y;        // 订单的Y坐标
    int priority;    // 订单优先级
    bool is_active;  // 订单是否有效（未被取消）
} Order;

// 骑手结构体定义
typedef struct {
    int id;                  // 骑手ID
    double x;                // 骑手的X坐标
    double y;                // 骑手的Y坐标
    int num_orders;          // 骑手当前处理的订单数
    Order orders[MAX_ORDERS]; // 骑手负责的订单数组
} Rider;

// 交通状况结构体定义
typedef struct {
    int level;  // 交通状况等级，0表示畅通，MAX_TRAFFIC_STATUS表示非常堵塞
} Traffic;

// 接收新订单的函数
bool receive_new_order(Order *new_order) {
    // 这里应该与服务器进行通信获取新订单
    // 目前通过随机数模拟生成新订单
    if (rand() % 2 == 0) {
        new_order->id = rand() % 1000 + 1000;
        new_order->x = rand() % 100;
        new_order->y = rand() % 100;
        new_order->priority = rand() % 10;  // 优先级为0到9
        new_order->is_active = true;
        return true;  // 成功接收到新订单
    }
    return false;  // 没有新订单
}

// 更新交通情况的函数
void update_traffic(Traffic *traffic) {
    // 在实际应用中应该获取实时交通数据
    // 目前通过随机数模拟交通情况
    traffic->level = rand() % (MAX_TRAFFIC_STATUS + 1);
}

// 检查订单是否被取消的函数
bool check_for_cancellations(Order *orders, int num_orders) {
    // 在实际应用中应该与服务器通信检查订单状态
    // 目前通过随机概率模拟订单取消
    for (int i = 0; i < num_orders; i++) {
        if (orders[i].is_active && rand() % 25 == 0) {  // 假设有4%的概率订单被取消
            orders[i].is_active = false;
            return true;  // 有订单被取消
        }
    }
    return false;  // 没有订单被取消
}

// 骑手决策过程的函数
void rider_decision_process(Rider *rider, Traffic traffic) {
    // 如果交通极度拥堵，优先考虑高优先级订单
    if (traffic.level == MAX_TRAFFIC_STATUS) {
        // 根据订单优先级进行简单排序
        // 采用冒泡排序法，优先级高的排在前面
        for (int i = 0; i < rider->num_orders; i++) {
            for (int j = i + 1; j < rider->num_orders; j++) {
                if (rider->orders[j].priority > rider->orders[i].priority) {
                    Order temp = rider->orders[i];
                    rider->orders[i] = rider->orders[j];
                    rider->orders[j] = temp;
                }
            }
        }
    }

    // 执行配送决策
    for (int i = 0; i < rider->num_orders; i++) {
        if (rider->orders[i].is_active) {
            // 输出配送信息
            printf("骑手 %d 正在配送订单 %d，优先级为 %d\n",
                   rider->id, rider->orders[i].id, rider->orders[i].priority);
            // 模拟订单配送，此处可以添加更多的逻辑
        }
    }
}

// 将新订单分配给骑手的函数
void assign_order_to_rider(Rider *riders, int num_riders, Order new_order) {
    // 寻找最近的骑手
    int closest_rider_index = -1;
    double closest_distance = -1;
    for (int i = 0; i < num_riders; i++) {
        double distance = sqrt(pow((riders[i].x - new_order.x), 2) + pow((riders[i].y - new_order.y), 2));
        if (closest_distance == -1 || distance < closest_distance) {
            closest_distance = distance;
            closest_rider_index = i;
        }
    }

    // 给最近的骑手分配订单
    if (closest_rider_index != -1) {
        Rider *closest_rider = &riders[closest_rider_index];
        closest_rider->orders[closest_rider->num_orders] = new_order;
        closest_rider->num_orders++;
    }
}
// 添加功能：移除被取消的订单
void remove_cancelled_orders(Rider *rider) {
    int active_orders = 0;
    for (int i = 0; i < rider->num_orders; i++) {
        if (rider->orders[i].is_active) {
            rider->orders[active_orders++] = rider->orders[i];
        }
    }
    rider->num_orders = active_orders;
}

// 添加功能：骑手决策考虑配送路径优化
void optimize_delivery_route(Rider *rider) {
    // 简单的贪心策略，选择离当前位置最近的订单进行配送
    bool visited[MAX_ORDERS] = {0}; // 初始化所有订单为未访问
    Order sorted_orders[MAX_ORDERS]; // 用于存放排序后的订单
    int sorted_count = 0; // 已排序的订单数量
    double current_x = rider->x;
    double current_y = rider->y;

    while (sorted_count < rider->num_orders) {
        double closest_distance = -1;
        int closest_order_index = -1;

        // 找出离骑手当前位置最近的订单
        for (int i = 0; i < rider->num_orders; i++) {
            if (!visited[i]) {
                double distance = sqrt(pow((rider->orders[i].x - current_x), 2) + pow((rider->orders[i].y - current_y), 2));
                if (closest_distance == -1 || distance < closest_distance) {
                    closest_distance = distance;
                    closest_order_index = i;
                }
            }
        }

        // 标记此订单为已访问
        if (closest_order_index != -1) {
            visited[closest_order_index] = true;
            sorted_orders[sorted_count++] = rider->orders[closest_order_index];

            // 更新骑手的当前位置为刚刚找到的最近订单的位置
            current_x = rider->orders[closest_order_index].x;
            current_y = rider->orders[closest_order_index].y;
        }
    }

    // 将优化后的订单列表复制回骑手的订单数组
    for (int i = 0; i < rider->num_orders; i++) {
        rider->orders[i] = sorted_orders[i];
    }
}


// 主函数
int main() {
    Rider riders[MAX_RIDERS]; // 初始化骑手数组
    Traffic traffic;          // 初始化交通状况
    Order new_order;          // 初始化新订单
    int num_riders = 3;       // 实际使用的骑手数量

    // 骑手初始化
    for (int i = 0; i < num_riders; i++) {
        riders[i].id = i;
        riders[i].x = rand() % 100; // 随机初始化骑手位置
        riders[i].y = rand() % 100;
        riders[i].num_orders = 0;
    }

    // 模拟100个时间单位
    for (int time = 0; time < 100; time++) {
        update_traffic(&traffic); // 更新交通状况

        if (receive_new_order(&new_order)) { // 接收新订单
            assign_order_to_rider(riders, num_riders, new_order); // 分配订单给骑手
        }

        
        for (int i = 0; i < num_riders; i++) {
            if (check_for_cancellations(riders[i].orders, riders[i].num_orders)) { // 检查订单是否被取消
                remove_cancelled_orders(&riders[i]);  // 处理取消订单
            }
            optimize_delivery_route(&riders[i]);  // 优化配送路线
            rider_decision_process(&riders[i], traffic); // 骑手做出配送决策
        }

        // 打印当前时间步骤结束的信息
        printf("时间 %d: 交通等级 %d\n", time, traffic.level);
    }

    return 0;
}


