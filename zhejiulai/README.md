# 浙就来 · 校园配送服务平台（最终版）

面向浙江大学校园场景的配送服务平台，覆盖「学号注册登录 → 双模式下单（代取外卖 / 代送物品）→ 地址管理 → 现金与积分双币支付 → 订单跟踪 → AI 助手问答」的完整业务闭环。

前端 Vue 3 单页应用，后端 Flask REST 服务，SQLite 落库，并接入 **scikit-learn 配送费预测模型** 与 **DeepSeek 大模型对话助手**。

> 在线作品集：https://actor-d.github.io/project.html
> 源码说明页：https://actor-d.github.io/zhejiulai/
> 作者 GitHub：https://github.com/Actor-D

## 项目规模（已核对源码）

| 指标 | 数量 |
| --- | --- |
| 前端路由 | **23 条**，其中 **21 条**受登录守卫保护 |
| 后端接口 | **31 个**（POST 13 / GET 11 / PUT 4 / DELETE 3），其中 **27 个**需要令牌 |
| 数据表 | **7 张**（users / addresses / orders / goods / feedbacks / chat_sessions / chat_messages），共 77 个字段 |
| 前端代码 | 55 个文件、约 14,470 行（.vue / .js） |
| 后端代码 | `server/app.py` 1,193 行 |
| 训练数据 | `delivery_data.csv` **100,000 行** |
| 界面语言 | 中文 / English（vue-i18n） |

---

## 目录

- [功能一览](#功能一览)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [两种下单模式](#两种下单模式)
- [机器学习：配送费预测](#机器学习配送费预测)
- [AI 助手：DeepSeek 对话](#ai-助手deepseek-对话)
- [数据模型](#数据模型)
- [API 接口](#api-接口)
- [业务规则](#业务规则)
- [常见问题](#常见问题)
- [已知问题与后续计划](#已知问题与后续计划)
- [English Quick Start](#english-quick-start)

---

## 功能一览

| 模块 | 说明 |
| --- | --- |
| 账号体系 | 学号 + 手机号注册，PBKDF2-SHA256 加密，登录需匹配校区 |
| 会话鉴权 | JWT（HS256 / 24 小时）+ 前端 `router.beforeEach` 守卫 21 条路由 |
| 双模式下单 | **代取外卖**（取件柜、加急）与 **代送物品**（物品类型/尺寸、拖拽上传图片）两条独立流程 |
| 智能计价 | scikit-learn 模型根据 尺寸 / 距离 / 是否加急 预测积分配送费 |
| 双币支付 | 同一订单同时给出现金价与积分价，用户任选；积分扣减在事务中原子完成 |
| 地址簿 | 增删改查 + 默认地址切换，下单时可直接选用 |
| 订单管理 | 列表 / 详情 / 图片、支付状态与确认收货 |
| AI 助手 | 基于 DeepSeek 的校园配送问答，会话与消息持久化到数据库 |
| 反馈中心 | 分类反馈提交与历史查看 |
| 国际化 | vue-i18n 中英双语言（当前已接入登录页） |
| 法律文档 | 内置用户协议与隐私政策 PDF |

---

## 技术栈

**前端**（`client/package.json`）

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| vue | ^3.5.13 | 组件化视图层 |
| vue-router | ^4.5.0 | 路由与登录守卫 |
| pinia | ^3.0.1 | 状态管理 |
| vue-i18n | ^11.1.5 | 中英文切换 |
| element-plus | ^2.9.11 | 表单与反馈组件 |
| @element-plus/icons-vue | ^2.3.1 | 图标 |
| ant-design-vue | ^4.2.6 | 部分页面组件 |
| axios | ^1.9.0 | 调用后端接口 |
| vite | ^6.2.4 | 开发服务器与构建 |
| sass-embedded | ^1.89.0 | 样式预处理 |
| unplugin-auto-import / unplugin-vue-components | ^19 / ^28 | 自动导入 |

**后端**（`server/requirements.txt`）

| 依赖 | 版本 | 用途 |
| --- | --- | --- |
| Flask | 3.1.0 | Web 框架 |
| Flask-SQLAlchemy | 3.1.1 | ORM |
| flask-cors | 5.0.1 | 跨域与凭证 |
| PyJWT | 2.10.1 | 令牌签发与校验 |
| scikit-learn | 1.6.1 | 配送费预测模型 |
| joblib | 1.5.1 | 模型持久化（`model.pkl`） |
| pandas / numpy | 2.2.3 / 2.2.6 | 特征构造 |
| openai | 1.82.1 | 调用 DeepSeek（OpenAI 兼容协议） |
| Werkzeug | 3.1.x | 密码哈希与文件名校验 |
| SQLite | — | 文件型数据库，免安装 |

---

## 快速开始

### 环境要求

Node.js 18+、Python 3.10+

### 1. 启动后端

```bash
cd server
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 配置密钥（不要写进代码）
export SECRET_KEY="$(python -c 'import secrets;print(secrets.token_hex(32))')"
export DEEPSEEK_API_KEY="sk-你的密钥"   # 可选：不配置则 AI 助手不可用，其余功能正常

python app.py                       # http://127.0.0.1:5000
```

首次启动自动执行 `db.create_all()`，在 `server/` 下生成 `zju_delivery.db`（**免手动建表**）。

### 2. 启动前端

```bash
cd client
npm install
npm run dev
```

打开终端提示的地址（Vite 默认 **http://localhost:5173**）。

### 3. 注册并登录

项目**没有预置账号**，请先注册：

| 字段 | 要求 |
| --- | --- |
| 学号 | **10 位数字**（如 `2209641601`） |
| 手机号 | 11 位，`1[3-9]` 开头（如 `13812345678`） |
| 密码 | 自定义，服务端以 PBKDF2-SHA256 存储 |
| 校区 | 登录时须与注册时一致 |

---

## 项目结构

```
.
├── client/                        # 前端 · Vue 3 SPA
│   ├── public/
│   │   ├── PDF/                   # 用户协议、隐私政策
│   │   ├── HomePage/              # 首页广告位配置
│   │   └── images/                # 校园图、订单占位图、紫金港地图
│   └── src/
│       ├── components/            # 真实业务组件（22–42 行的 views 只是包装壳）
│       │   ├── FrontPage/         # 登录 / 注册
│       │   ├── Home/              # 首页、下单、订单、消息、我的
│       │   └── Navigation/        # 顶栏与页脚
│       ├── views/                 # 路由级包装组件
│       ├── stores/                # pinia：i18n、counter
│       ├── router/index.js        # 23 条路由 + 守卫
│       └── main.js
├── server/
│   ├── app.py                     # 31 个接口 + 7 个模型 + ML 与 LLM 调用
│   ├── model.pkl                  # 训练好的配送费预测模型
│   ├── delivery_data.csv          # 10 万行训练数据
│   └── requirements.txt
├── prototype/                     # 原型文档
└── LICENSE                        # 木兰宽松许可证 v2
```

---

## 两种下单模式

| | 代取外卖（food） | 代送物品（good） |
| --- | --- | --- |
| 路由 | `Info → Address → Complete → Pay → ListDetail` | `GoodInfo → GoodAddress → GoodComplete → GoodPay → GoodDetail` |
| 关键字段 | `food_name`、`locker_info`、`size` | `good_name`、`good_type`、`good_size` |
| 计价 | **调用 ML 模型预测积分** | 固定 10 积分 |
| 图片 | 上传取件凭证 | 拖拽上传物品照片 |

两条流程结构对称、数据表独立（`orders` / `goods`），互不干扰。

---

## 机器学习：配送费预测

`server/model.pkl` 由 scikit-learn 训练，`delivery_data.csv` 含 **100,000 行**样本，字段为 `size, distance, urgent, delivery_fee`。

调用链（`server/app.py`）：

```python
def predict_delivery_fee_points(size, distance, urgent):   # :369
    model = joblib.load('model.pkl')
    X = pd.DataFrame([{'size': size, 'distance': distance, 'urgent': urgent}])
    return int(model.predict(X)[0])
```

- 在创建外卖订单时调用（`create_order`），结果写入 `delivery_fee_points`
- 提供公开的 `GET /api/test_predict` 便于调试模型

> ⚠️ **已知缺陷（值得写进简历的反思点）**：`create_order` 在写入订单时把 `distance` 固定为 `0.0`，而真实距离是在**下一步** `POST /api/order/<id>/address` 才回填的 —— 也就是说线上预测**永远只用到 `size` 与 `urgent`**，距离特征形同虚设。修复方式是把预测延后到地址确认之后，或先取地址再定价。

---

## AI 助手：DeepSeek 对话

- 通过 `openai` SDK 以 OpenAI 兼容协议调用 DeepSeek（`base_url="https://api.deepseek.com/"`）
- 约 700 字的中文 system prompt，限定助手只回答校园配送相关问题
- 会话与消息**持久化到数据库**：`chat_sessions` + `chat_messages`
- 4 个接口：创建会话、拉取历史、发送消息、清空历史
- 前端有完整聊天界面（消息气泡、加载态、多会话切换）

> 密钥通过环境变量 `DEEPSEEK_API_KEY` 注入。**仓库中不包含任何密钥**。

---

## 数据模型

7 张表，除 `chat_messages` 外均通过 `user_id` 关联到用户。

### `users` — 用户（11 字段）

`id` · `public_id`(UUID，写入 JWT) · `student_id`(唯一，10 位) · `name` · `phone` · `password`(PBKDF2) · `points`(默认 100) · `identity` · `campus` · `created_at` · `last_login`

### `addresses` — 常用地址（7 字段）

`id` · `user_id`(FK) · `icon` · `title` · `detail` · `time` · `is_default`

### `orders` — 外卖订单（22 字段）

`order_id`(UUID) · `user_id`(FK) · `food_name` · `locker_info` · `is_urgent` · `size` · `notes` · `delivery_address` · `receiver_address` · `delivery_fee_cash` · `delivery_fee_points` · `payment_method` / `payment_currency` / `payment_amount` / `payment_time` / `payment_status` · `confirm` · `distance` · `image_url` · 时间戳

### `goods` — 物品代送订单（21 字段）

`goodorder_id`(UUID) · `user_id`(FK) · `good_name` · `good_type` · `good_size` · `is_urgent` · `notes` · `delivery_address` · `receiver_address` · 费用与支付字段 · `confirm` · `image_url` · 时间戳

### `feedbacks` — 反馈（6 字段）

`id` · `user_id`(FK) · `type` · `content` · `contact_info` · `created_at`

### `chat_sessions` / `chat_messages` — AI 会话（5 + 5 字段）

`session_id`(UUID) · `user_id`(FK) · 时间戳 ／ `session_id`(FK) · `role` · `content` · `timestamp`

---

## API 接口

**31 个端点**，🔒 表示需要 `Authorization: Bearer <token>`。

### 账号与资料

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | `/api/register` | 注册并返回令牌 |
| POST | `/api/login` | 校验学号/密码/校区并签发令牌 |
| GET 🔒 | `/api/user_profile` | 读取资料与积分 |
| PUT 🔒 | `/api/update_profile` | 更新姓名、手机号、校区 |

### 地址簿

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET 🔒 | `/api/addresses` | 地址列表 |
| POST 🔒 | `/api/addresses` | 新增地址 |
| PUT 🔒 | `/api/addresses/<id>` | 更新地址 |
| DELETE 🔒 | `/api/addresses/<id>` | 删除地址 |
| POST 🔒 | `/api/addresses/<id>/default` | 设为默认 |
| POST 🔒 | `/api/addresses/<id>/cancel_default` | 取消默认 |

### 外卖订单

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST 🔒 | `/api/order` | 创建订单并调用 ML 计价 |
| POST 🔒 | `/api/order/<id>/address` | 回填配送与接收地址 |
| PUT 🔒 | `/api/order/<id>/payment` | 选择支付方式并扣减积分 |
| GET 🔒 | `/api/order` | 订单列表（时间倒序） |
| GET 🔒 | `/api/order/<id>` | 订单详情 |
| GET 🔒 | `/api/orders/<id>/images` | 订单图片 |
| GET | `/api/test_predict` | 公开的模型调试接口 |

### 物品代送

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST 🔒 | `/api/good` | 创建物品代送订单 |
| POST 🔒 | `/api/good/<id>/address` | 回填地址 |
| PUT 🔒 | `/api/good/<id>/payment` | 支付 |
| GET 🔒 | `/api/good` | 列表 |
| GET 🔒 | `/api/good/<id>` | 详情 |
| GET 🔒 | `/api/good/<id>/images` | 图片 |

### AI 助手 · 反馈 · 文件

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST 🔒 | `/api/chat/session` | 新建会话 |
| GET 🔒 | `/api/chat/history` | 会话历史 |
| POST 🔒 | `/api/chat/send` | 发送消息并获取回复 |
| DELETE 🔒 | `/api/chat/clear` | 清空历史 |
| POST 🔒 | `/api/feedback` | 提交反馈 |
| DELETE 🔒 | `/api/clear_data` | 清空当前用户数据 |
| POST 🔒 | `/api/upload` | 上传图片 |
| GET | `/uploads/<filename>` | 静态访问已上传文件 |

```bash
# 注册
curl -X POST http://127.0.0.1:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{"student_id":"2209641601","name":"张三","phone":"13812345678","password":"secret123","campus":"紫金港校区"}'

# 带令牌读取订单
curl http://127.0.0.1:5000/api/order -H "Authorization: Bearer <token>"
```

---

## 业务规则

- **双向计价**：普通 `¥5 / 50 积分`，加急 `¥7 / 70 积分`（外卖订单的积分价改由 ML 模型预测；物品代送固定 10 积分）
- **积分原子扣减**：支付时在数据库事务中完成扣减与余额校验
- **身份校验**：学号 `^\d{10}$`、手机号 `^1[3-9]\d{9}$`，注册时查重
- **校区校验**：登录时比对账户校区，不一致返回 401
- **令牌鉴权**：`@token_required` 解析 HS256 令牌并回查用户，24 小时过期
- **用户级隔离**：地址、订单、物品、反馈、会话查询均按 `user_id` 过滤
- **上传限制**：仅 `png / jpg / jpeg / gif`，单文件 ≤ 5MB，UUID 重命名防覆盖
- **前端守卫**：`router.beforeEach` 检查 `sessionStorage` 中的 token，拦截 21 条受保护路由

---

## 常见问题

**Q：AI 助手报错 / 没有回复？**
需要先 `export DEEPSEEK_API_KEY="sk-..."` 再启动后端。未配置时其余功能不受影响。

**Q：登录提示「学号、密码和校区是必填项」？**
登录接口必须同时提交 `student_id`、`password`、`campus`。

**Q：前端请求失败或跨域？**
后端 CORS 仅放行 `http://localhost:5173` 与 `http://127.0.0.1:5000`。若 Vite 换了端口，请同步修改 `server/app.py` 中的 `CORS(...)`。前端接口地址目前**硬编码**在组件里（约 49 处），建议改用 Vite 代理或 `.env`。

**Q：模型预测总是同一个价格？**
见上文「已知缺陷」——创建订单时 `distance` 恒为 0，距离特征未生效。

**Q：数据库想重置？**
停止服务，删除 `server/zju_delivery.db`，重启即可重建（数据会丢失）。

---

## 已知问题与后续计划

| 现状 | 计划 |
| --- | --- |
| 预测时 `distance=0`，距离特征失效 | 把预测延后到地址确认之后 |
| 49 处硬编码接口地址、无 axios 拦截器 | 抽到 `VITE_API_BASE_URL` + 统一请求拦截器注入令牌 |
| i18n 只接入登录页，其余页面硬编码中文 | 全量抽取文案到 locale 文件 |
| `views/` 与 `components/` 存在 Food/Good 双份近似代码 | 抽象通用下单流程组件 |
| 无自动化测试、无 CI | 为计价、鉴权、订单状态流转补单测 |
| `/api/test_predict`、`/uploads/<filename>` 公开，`debug=True` | 生产环境关闭调试、收敛公开接口 |
| SQLite + `db.create_all()`，无迁移 | 切换 MySQL/PostgreSQL 并接入 Alembic |
| 死代码：`stores/counter.js`、`POINTS_EXCHANGE_RATE`、未用依赖 | 清理 |

---

## English Quick Start

**Zhejiulai** is a campus delivery platform for Zhejiang University: a Vue 3 SPA with a Flask REST API, SQLite storage, a scikit-learn delivery-fee model and a DeepSeek-powered assistant. It ships **23 routes (21 guarded), 31 endpoints (27 authenticated), 7 tables** and a **100,000-row** training set.

```bash
# 1. Backend — http://127.0.0.1:5000
cd server
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export SECRET_KEY="change-me"
export DEEPSEEK_API_KEY="sk-..."                    # optional, for the AI assistant
python app.py

# 2. Frontend — http://localhost:5173
cd client
npm install
npm run dev
```

No account is pre-seeded: register with a **10-digit student ID** and an **11-digit phone number** (`1[3-9]…`). The database is created automatically via `db.create_all()`.

Two ordering flows are supported — food pickup and item delivery — each with its own table, address step and payment step. Standard delivery is ¥5 / 50 points and priority ¥7 / 70 points, with points deducted atomically on payment. Passwords use PBKDF2-SHA256; JWTs use HS256 with a 24-hour expiry; uploads are restricted to png/jpg/jpeg/gif under 5 MB.

---

## License

本项目采用 **木兰宽松许可证，第 2 版（Mulan PSL v2）**，详见 [LICENSE](./LICENSE)。
