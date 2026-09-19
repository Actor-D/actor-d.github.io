#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>

// 枚举类型表示天气情况
typedef enum {
    WEATHER_CLEAR,
    WEATHER_RAINY,
    WEATHER_SNOWY
} Weather;

// 枚举类型表示交通状况
typedef enum {
    TRAFFIC_LIGHT,
    TRAFFIC_MODERATE,
    TRAFFIC_HEAVY
} Traffic;

// 枚举类型表示道路条件
typedef enum {
    ROAD_GOOD,
    ROAD_OKAY,
    ROAD_BAD
} RoadCondition;

// 函数: 生成骑手的速度，服从截断正态分布
double generate_normal_speed(double mean, double stddev, double max_speed) {
    double speed;
    do {
        double u1 = (double)rand() / RAND_MAX;
        double u2 = (double)rand() / RAND_MAX;
        double z0 = sqrt(-2.0 * log(u1)) * cos(2 * M_PI * u2);
        speed = z0 * stddev + mean;
    } while (speed <= 0 || speed > max_speed);
    return speed;
}

// 函数: 根据交通情况调整速度
double adjust_speed_for_traffic(double speed, Traffic traffic) {
    switch (traffic) {
        case TRAFFIC_LIGHT: return speed;
        case TRAFFIC_MODERATE: return speed * 0.8;
        case TRAFFIC_HEAVY: return speed * 0.6;
        default: return speed;
    }
}

// 函数: 根据天气情况调整速度
double adjust_speed_for_weather(double speed, Weather weather) {
    switch (weather) {
        case WEATHER_CLEAR: return speed;
        case WEATHER_RAINY: return speed * 0.75;
        case WEATHER_SNOWY: return speed * 0.5;
        default: return speed;
    }
}

// 函数: 根据道路条件调整速度
double adjust_speed_for_road(double speed, RoadCondition road) {
    switch (road) {
        case ROAD_GOOD: return speed;
        case ROAD_OKAY: return speed * 0.85;
        case ROAD_BAD: return speed * 0.7;
        default: return speed;
    }
}

// 函数: 估算配送时间
double estimate_delivery_time(double distance, int traffic_lights, double mean_speed, double stddev, double max_speed, Weather weather, Traffic traffic, RoadCondition road) {
    // 生成实际速度
    double actual_speed = generate_normal_speed(mean_speed, stddev, max_speed);

    // 考虑不同因素调整速度
    actual_speed = adjust_speed_for_traffic(actual_speed, traffic);
    actual_speed = adjust_speed_for_weather(actual_speed, weather);
    actual_speed = adjust_speed_for_road(actual_speed, road);
    
    // 红绿灯等待时间
    double total_light_delay = traffic_lights * 0.5 / 60; // 每个红绿灯平均等待30秒
    
    // 计算配送时间
    double delivery_time = distance / actual_speed + total_light_delay;

    return delivery_time;
}

int main() {
    srand((unsigned int)time(NULL)); // 初始化随机数生成器

    // 配送信息输入
    double distance;
    int traffic_lights;
    double mean_speed = 20.0; // 骑手平均速度设定为20km/h
    double stddev = 2.5; // 骑手速度标准差设定为2.5km/h
    double max_speed = 25.0; // 骑手最高速度为25km/h
    Weather weather;
    Traffic traffic;
    RoadCondition road;

    // 用户输入
    printf("请输入配送距离（单位：公里）: ");
    scanf("%lf", &distance);
    printf("请输入路途中交通灯的数量: ");
    scanf("%d", &traffic_lights);
    printf("请输入天气情况（0-晴朗，1-雨天，2-雪天）: ");
    scanf("%u", (unsigned int *)&weather);
    printf("请输入交通情况（0-畅通，1-中等，2-拥堵）: ");
    scanf("%u", (unsigned int *)&traffic);
    printf("请输入道路情况（0-良好，1-一般，2-糟糕）: ");
    scanf("%u", (unsigned int *)&road);

    // 计算预估配送时间
    double delivery_time = estimate_delivery_time(distance, traffic_lights, mean_speed, stddev, max_speed, weather, traffic, road);

    // 输出预估配送时间区间，考虑不确定性给出时间范围
    printf("预计配送时间介于 %.2f 到 %.2f 分钟之间。\n", delivery_time * 60 * 0.9, delivery_time * 60 * 1.1);

    return 0;
}

