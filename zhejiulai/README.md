# 浙就来 · 校园配送服务平台

面向浙江大学校园场景的配送服务平台，覆盖「学号注册登录 → 四步下单 → 地址管理 → 双币支付 → 订单查询」的完整业务闭环。

前端为 Vue 3 单页应用，后端为 Flask REST 服务，数据落库 SQLite。项目由董炎源（Actor.D）独立完成，包含 **18 条前端路由（16 条受保护）**、**17 个 REST 接口**、**3 张数据表**。

> 在线作品集：https://actor-d.github.io/project.html
> 作者 GitHub：https://github.com/Actor-D

---

## 目录

- [功能一览](#功能一览)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [业务流程](#业务流程)
- [数据模型](#数据模型)
- [API 接口](#api-接口)
- [业务规则](#业务规则)
- [常见问题](#常见问题)
- [已知限制与后续计划](#已知限制与后续计划)
- [English Quick Start](#english-quick-start)

---

## 功能一览

| 模块 | 说明 |
| --- | --- |
| 账号体系 | 学号 + 手机号注册，PBKDF2 加密存储，登录需匹配校区 |
| 会话鉴权 | 后端 JWT（HS256 / 24 小时），前端路由守卫拦截未登录访问 |
| 下单流程 | 四步式：填写需求 → 确认地址 → 选择支付 → 完成 |
| 地址簿 | 常用地址增删改查，支持设为/取消默认地址，下单时可直接选用 |
| 双币支付 | 同一订单同时计算现金价与积分价，用户自由选择支付货币 |
| 订单管理 | 按时间倒序的订单列表与详情，含加急标记与支付状态 |
| 图片上传 | 订单凭证上传，类型白名单 + 5MB 上限 + UUID 重命名 |
| 个人中心 | 资料修改、地址管理、积分余额、反馈与设置 |

---

## 技术栈

**前端**

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| Vue | 3.5 | 组件化视图层 |
| Vite | 6.2 | 开发服务器与构建 |
| Vue Router | 4.5 | 路由与 `beforeEach` 登录守卫 |
| Pinia | 3.0 | 共享状态 |
| Element Plus | 2.9 | 表单、弹窗、反馈组件 |
| axios | 1.9 | 调用后端 REST 接口 |

**后端**

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| Flask | 3.1 | Web 框架与路由 |
| Flask-SQLAlchemy | 3.1 | ORM 与模型定义 |
| Flask-CORS | 5.0 | 跨域与凭证支持 |
| PyJWT | 2.10 | 签发与校验令牌 |
| Werkzeug | 3.1 | 密码哈希（pbkdf2:sha256） |
| SQLite | — | 本地数据库（文件型，免安装） |

---

## 快速开始

### 环境要求

- Node.js 18 或更高版本
- Python 3.10 或更高版本

### 1. 启动后端（Flask）

```bash
cd server

# 创建并激活虚拟环境
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 启动服务（默认 http://127.0.0.1:5000）
python app.py
```

首次启动会自动执行 `db.create_all()`，在 `server/` 下生成数据库文件 `zju_delivery.db`，**无需手动建表**。

### 2. 启动前端（Vue）

另开一个终端：

```bash
cd client

npm install
npm run dev
```

浏览器打开终端提示的地址，默认是 **http://localhost:5173**。

### 3. 注册账号并登录

项目**没有预置测试账号**，首次使用请点击「注册账号」自行创建：

| 字段 | 要求 |
| --- | --- |
| 学号 | **必须是 10 位数字**（例如 `2209641601`） |
| 姓名 | 任意中文或英文 |
| 手机号 | 11 位，`1` 开头，第二位 3–9（例如 `13812345678`） |
| 密码 | 自定义，服务端以 PBKDF2-SHA256 加密后存储 |
| 校区 | 登录时需与注册时选择的校区一致 |

注册成功后即可体验下单、地址管理与订单查询的完整流程。

### 打包构建（可选）

```bash
cd client
npm run build      # 产物输出到 client/dist
npm run preview    # 本地预览构建结果
```

---

## 项目结构

```
.
├── client/                     # 前端 · Vue 3 单页应用
│   ├── public/                 # 静态资源（图片、广告位配置）
│   │   ├── HomePage/AdvertisementInfo.json
│   │   └── images/             # 校园图、订单占位图、地图
│   ├── src/
│   │   ├── components/         # 业务组件（首页、下单、订单、我的）
│   │   ├── views/              # 路由级页面
│   │   ├── router/index.js     # 18 条路由 + 登录守卫
│   │   ├── stores/             # Pinia 状态
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── vite.config.js
├── server/                     # 后端 · Flask REST 服务
│   ├── app.py                  # 全部接口与数据模型
│   ├── requirements.txt
│   └── uploads/                # 图片上传目录（首次上传时自动创建）
├── prototype/                  # 早期原型参考
└── LICENSE                     # 木兰宽松许可证 v2
```

---

## 业务流程

```
注册/登录 ──► 首页 ──► ① 填写配送需求 ──► ② 确认配送地址
                              │                    │
                              └────► ③ 选择支付方式 ──► ④ 完成
                                                         │
                                              订单列表 / 详情 ◄── 状态跟踪
```

四步下单的实现要点：

1. **填写需求**：物品名称、取件柜信息、备注、是否加急。提交后创建订单，状态为 `draft`。
2. **确认地址**：选择地址簿中的地址（提交 ID，由服务端解析为可读地址串）或直接输入新地址。
3. **选择支付**：按是否加急给出两种货币的配送费，用户选择现金或积分。
4. **完成**：展示订单摘要，进入订单列表跟踪状态。

> 说明：支付确认接口在 `server/app.py` 中处于注释状态（见文件内 `update_payment` 相关代码段），因此第 3 步目前完成计价与选择，尚未写入 `paid` 状态。这是刻意保留的扩展点。

---

## 数据模型

三张表通过 `user_id` 外键串联，所有读写都按用户隔离。

### `users` — 用户与身份

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | Integer | 主键 |
| `public_id` | String(50) | UUID，写入 JWT 载荷 |
| `student_id` | String(20) | 学号，唯一，10 位数字 |
| `name` | String(100) | 姓名 |
| `phone` | String(20) | 手机号 |
| `password` | String(200) | PBKDF2-SHA256 哈希 |
| `points` | Integer | 积分余额，默认 100 |
| `identity` | String(20) | 身份，默认 `student` |
| `campus` | String(50) | 校区，登录时校验 |
| `created_at` / `last_login` | DateTime | 注册时间 / 最近登录 |

### `addresses` — 常用地址

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | Integer | 主键 |
| `user_id` | Integer | 外键 → `users.id` |
| `icon` | String(10) | 地址类型标记 |
| `title` | String(100) | 地点名称 |
| `detail` | String(200) | 详细地址 |
| `time` | String(50) | 可用时段 |
| `is_default` | Boolean | 是否为默认地址 |

### `orders` — 订单与计价

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `order_id` | String(36) | UUID，对外订单号 |
| `user_id` | Integer | 外键 → `users.id` |
| `food_name` / `locker_info` / `notes` | String/Text | 物品、取件柜、备注 |
| `is_urgent` | Boolean | 加急标记，决定计价 |
| `delivery_address` / `receiver_address` | String(200) | 配送地址 / 接收地址 |
| `delivery_fee_cash` | Float | 现金配送费：5.0 / 7.0 |
| `delivery_fee_points` | Integer | 积分配送费：50 / 70 |
| `payment_method` / `payment_currency` | String | 支付方式与货币 |
| `payment_status` | String(20) | `draft` → `pending` → `paid` |
| `created_at` / `updated_at` | DateTime | 时间戳 |

---

## API 接口

后端共 **17 个端点**，除 `/uploads/<filename>` 外均在 `/api` 前缀下。带 🔒 的接口需要请求头 `Authorization: Bearer <token>`。

### 账号与资料

| 方法 | 路径 | 说明 | 状态码 |
| --- | --- | --- | --- |
| POST | `/api/register` | 创建学生账户，返回令牌 | 201 |
| POST | `/api/login` | 校验学号/密码/校区并签发令牌 | 200 |
| GET 🔒 | `/api/user_profile` | 读取当前用户资料与积分 | 200 |
| PUT 🔒 | `/api/update_profile` | 更新姓名、手机号、校区 | 200 |

### 地址簿

| 方法 | 路径 | 说明 | 状态码 |
| --- | --- | --- | --- |
| GET 🔒 | `/api/addresses` | 读取当前用户全部地址 | 200 |
| POST 🔒 | `/api/addresses` | 新增地址 | 201 |
| PUT 🔒 | `/api/addresses/<id>` | 更新地址 | 200 |
| DELETE 🔒 | `/api/addresses/<id>` | 删除地址 | 200 |
| POST 🔒 | `/api/addresses/<id>/default` | 设为默认地址 | 200 |
| POST 🔒 | `/api/addresses/<id>/cancel_default` | 取消默认地址 | 200 |

### 订单

| 方法 | 路径 | 说明 | 状态码 |
| --- | --- | --- | --- |
| POST 🔒 | `/api/order` | 创建订单并按加急计价 | 201 |
| POST 🔒 | `/api/order/<order_id>/address` | 回填配送与接收地址 | 200 |
| GET 🔒 | `/api/order` | 订单列表（时间倒序） | 200 |
| GET 🔒 | `/api/order/<order_id>` | 订单详情 | 200 |

### 文件

| 方法 | 路径 | 说明 | 状态码 |
| --- | --- | --- | --- |
| POST 🔒 | `/api/upload` | 上传订单图片，返回相对 URL | 200 |
| GET 🔒 | `/api/orders/<order_id>/images` | 读取订单图片 | 200 |
| GET | `/uploads/<filename>` | 静态访问已上传文件 | 200 |

请求示例：

```bash
# 注册
curl -X POST http://127.0.0.1:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"student_id":"2209641601","name":"张三","phone":"13812345678","password":"secret123","campus":"紫金港校区"}'

# 携带令牌读取订单列表
curl http://127.0.0.1:5000/api/order \
  -H "Authorization: Bearer <上一步返回的 token>"
```

---

## 业务规则

代码中真实生效的约束，全部在服务端校验：

- **双向计价**：普通 `¥5 / 50 积分`，加急 `¥7 / 70 积分`，兑换率固定 `1 元 = 10 积分`。创建订单时同时写入 `delivery_fee_cash` 与 `delivery_fee_points`。
- **身份校验**：学号匹配 `^\d{10}$`，手机号匹配 `^1[3-9]\d{9}$`；注册时检查学号与手机号是否已被占用。
- **校区校验**：登录时比对账户校区，不一致返回 `401 校区不匹配`。
- **令牌鉴权**：`@token_required` 装饰器解析 HS256 令牌并回查用户，令牌 24 小时过期。
- **用户级隔离**：地址与订单查询强制携带 `user_id` 过滤，访问他人 ID 返回 404。
- **上传限制**：仅允许 `png / jpg / jpeg / gif`，单文件不超过 5MB，文件名以 UUID 前缀重命名避免覆盖。
- **前端守卫**：`router.beforeEach` 检查 `sessionStorage` 中的 token，未登录访问受保护路由时跳回登录页。

---

## 常见问题

**Q：登录提示「学号、密码和校区是必填项」？**
登录接口必须同时提交 `student_id`、`password`、`campus` 三个字段，校区下拉框不能为空。

**Q：注册提示「学号必须是10位数字」？**
学号正则要求恰好 10 位数字，不足或含字母都会被拒绝。

**Q：前端请求失败 / 跨域报错？**
后端 CORS 仅放行 `http://localhost:5173` 与 `http://127.0.0.1:5000`。请用 `npm run dev` 的默认端口访问，或同步修改 `server/app.py` 中的 `CORS(...)` 配置。

**Q：图片上传后访问不到？**
上传目录 `server/uploads/` 会在首次上传时自动创建；访问路径形如 `http://127.0.0.1:5000/uploads/<文件名>`。

**Q：数据库想重置怎么办？**
停止后端服务，删除 `server/zju_delivery.db`，重新启动即可重新建表（原有数据会丢失）。

**Q：端口被占用？**
后端端口在 `server/app.py` 末尾的 `app.run(debug=True, port=5000)` 修改；前端端口在 `client/vite.config.js` 中配置。

---

## 已知限制与后续计划

| 现状 | 计划 |
| --- | --- |
| 支付确认接口处于注释状态，订单停在 `draft`/`pending` | 补全支付回调与状态流转，接入真实或模拟支付网关 |
| 前端 axios 请求地址硬编码为 `http://127.0.0.1:5000` | 抽到 `.env` 的 `VITE_API_BASE_URL`，并加请求拦截器统一注入令牌 |
| `SECRET_KEY` 为占位字符串 | 改为环境变量注入，避免密钥入库 |
| `views/` 与 `components/` 存在功能重复的页面文件 | 合并为单一目录结构，去掉历史冗余 |
| 无自动化测试 | 为订单计价与鉴权补充后端单元测试 |
| 生产环境仍用 SQLite | 切换 MySQL / PostgreSQL（依赖中已预留 PyMySQL） |

---

## English Quick Start

**Zhejiulai** is a campus delivery platform for Zhejiang University: a Vue 3 single-page app backed by a Flask REST API with SQLite storage. It covers student sign-up, a four-step ordering flow, an address book, dual cash/points pricing, image uploads, and order tracking — **18 front-end routes (16 protected), 17 endpoints, 3 tables**.

```bash
# 1. Backend — http://127.0.0.1:5000
cd server
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py

# 2. Frontend — http://localhost:5173
cd client
npm install
npm run dev
```

No test account is pre-seeded: register first with a **10-digit student ID** and an **11-digit phone number** (starting `1[3-9]`). The SQLite database is created automatically on first launch via `db.create_all()`.

Key rules: standard delivery ¥5 / 50 points, priority ¥7 / 70 points at a fixed 1 CNY = 10 points; passwords hashed with PBKDF2-SHA256; JWTs signed with HS256 and expiring after 24 hours; uploads restricted to png/jpg/jpeg/gif under 5 MB.

---

## License

本项目采用 **木兰宽松许可证，第 2 版（Mulan PSL v2）**，详见 [LICENSE](./LICENSE)。
