const translations = {
  zh: {
    pageTitle: "Actor.D｜个人主页",
    pageDescription:
      "Actor.D 的个人主页——浙江大学信息管理与信息系统专业毕业，现就读于香港中文大学商业分析理学硕士。",
    researchPageTitle: "研究论文 · Actor.D｜个人主页",
    researchPageDescription:
      "Actor.D 的毕业论文展示页——基于强化学习的优惠券公平发放策略（Fair-DQN）：摘要、核心发现、模型与实验结果。",
    projectPageTitle: "项目案例 · Actor.D｜个人主页",
    projectPageDescription:
      "Actor.D 的全栈项目「浙就来」——面向浙江大学校园场景的配送服务平台：交互界面预览、业务流程、系统架构与 API 设计。",
    accessibility: {
      skip: "跳到主要内容",
      home: "返回首页",
      language: "切换页面语言",
      menuOpen: "打开导航菜单",
      menuClose: "关闭导航菜单",
      navigation: "主导航",
      portrait: "Actor.D 数据化个人信息面板",
      focusList: "专业方向列表",
      techStack: "项目技术栈",
      projectPreview: "浙就来项目交互界面预览",
      projectTabs: "选择要预览的项目界面",
      lightboxLabel: "论文图表预览",
      lightboxClose: "关闭图表预览",
    },
    nav: { about: "关于我", projects: "项目案例", research: "研究论文", journey: "学习经历", contact: "联系我" },
    common: {
      backHome: "回到主页",
      nextProject: "继续阅读：项目案例",
      nextResearch: "继续阅读：研究论文",
    },
    hero: {
      eyebrow: "信息系统 × 商业分析",
      greeting: "你好，我是",
      name: "Actor.D。",
      intro:
        "从浙江大学信息管理与信息系统专业，到香港中文大学商业分析理学硕士，我正在数据、技术与商业的交汇处持续探索。",
      primaryAction: "查看我的项目",
      secondaryAction: "联系我",
      researchAction: "查看我的论文",
      scroll: "向下探索",
      metricBuild: "前后端开发",
      metricJourney: "跨校学习经历",
      metricFocus: "交叉专业视角",
      visualStatus: "当前状态",
      visualMode: "探索模式",
    },
    about: {
      title: "关于我",
      lead: "以数据理解问题，用分析支持更好的商业决策。",
      body:
        "我是董炎源（Actor.D），毕业于浙江大学信息管理与信息系统专业，目前就读于香港中文大学商业分析理学硕士项目。这段跨越信息系统与商业分析的学习经历，让我持续关注如何连接数据、技术与真实的商业问题。",
      techLabel: "技术栈",
      factFoundation: "本科基础",
      factCurrent: "当前项目",
      factInterest: "关注领域",
    },
    focus: {
      informationManagement: "信息管理",
      informationSystems: "信息系统",
      businessAnalytics: "商业分析",
      dataDriven: "数据驱动决策",
    },
    projects: {
      title: "项目案例",
      type: "全栈 Web 应用",
      subtitle: "面向浙江大学校园场景的配送服务平台",
      summary:
        "Vue 3 单页应用 + Flask REST 服务的校园配送平台：18 条前端路由（16 条受保护）、17 个接口、3 张数据表，串联注册登录、四步下单、地址簿、现金与积分双币支付和订单查询。",
      previewSummary:
        "从学号注册到订单履约的完整闭环：JWT 会话与路由守卫、四步下单流程、用户级地址簿、现金与积分双币计价，以及带类型白名单的图片上传——全部由真实接口驱动。",
      viewFull: "查看完整案例",
      viewSource: "查看源码",
      viewReadme: "运行说明",
      highlightOne: "18 条路由 + router.beforeEach 守卫，JWT 会话 24 小时过期",
      highlightTwo: "四步下单与双向计价：普通 ¥5 / 50 积分，加急 ¥7 / 70 积分",
      highlightThree: "3 张表 + 17 个接口，地址与订单按 user_id 强制隔离",
      challengeEyebrow: "业务问题",
      challengeTitle: "校园配送信息分散，履约流程缺少统一入口",
      challengeBody:
        "学生在外卖、快递与校内物品配送场景中，需要重复沟通取件位置、收货地址、费用和进度，信息容易遗漏。",
      solutionEyebrow: "产品方案",
      solutionTitle: "把身份、订单、地址与支付串成一条数字化链路",
      solutionBody:
        "平台围绕学生身份构建统一账户，用分步表单降低下单复杂度，并通过订单状态和个人中心沉淀完整服务记录。",
      prototype: "交互界面预览",
      tabLogin: "用户登录",
      tabOrder: "创建订单",
      tabOrders: "订单管理",
      mockPlatform: "校园专属配送平台",
      mockWelcome: "欢迎回来",
      mockWelcomeBody: "使用学号登录校园配送系统",
      mockCampus: "选择校区",
      mockCampusValue: "浙江大学紫金港校区",
      mockStudentId: "学号",
      mockPassword: "密码",
      mockLoginButton: "立即登录",
      mockRegister: "注册账号",
      mockReset: "找回密码",
      mockNewOrder: "新建配送订单",
      stepInfo: "订单信息",
      stepAddress: "配送地址",
      stepPayment: "支付方式",
      stepComplete: "完成",
      mockOrderDetail: "填写配送需求",
      mockFoodName: "外卖或物品名称",
      mockFoodValue: "外卖订单",
      mockLocker: "取件柜信息",
      mockLockerValue: "紫金港校区东二门智能柜",
      mockUrgent: "加急配送",
      mockSummary: "订单摘要",
      mockDeliveryFee: "配送费",
      mockPoints: "积分支付",
      mockNext: "下一步",
      mockMyOrders: "我的订单",
      mockSmartLocker: "东二门智能外卖柜",
      mockUrgentTag: "加急",
      mockDelivering: "配送中",
      mockTakeout: "外卖订单",
      mockDetail: "订单详情",
      mockReorder: "再来一单",
      mockDorm: "蓝田学园宿舍",
      mockCompleted: "已完成",
      mockParcel: "快递代取",
      factWorkflow: "步订单流程",
      factModels: "张数据表",
      factApi: "个 REST 接口",
      factRoutes: "条受保护路由",
      flowEyebrow: "核心业务流",
      flowTitle: "从需求提交到订单履约",
      flowOneTitle: "提交需求",
      flowOneBody: "填写物品名称、取件柜与备注，加急标记直接决定后续计价。",
      flowTwoTitle: "确认地址",
      flowTwoBody: "选择常用地址或输入新地点，服务端解析为可读地址串。",
      flowThreeTitle: "选择支付",
      flowThreeBody: "普通 ¥5 / 50 积分，加急 ¥7 / 70 积分，现金与积分同价。",
      flowFourTitle: "追踪订单",
      flowFourBody: "按时间倒序查看订单列表、详情与支付状态。",
      dataEyebrow: "数据模型",
      dataTitle: "三张表撑起完整业务闭环",
      dataIntro:
        "SQLAlchemy ORM 定义 users / addresses / orders 三个模型，通过 user_id 外键串联，所有读写按用户隔离。",
      dataUserName: "用户与身份",
      dataUserDesc: "账户、校区与积分余额",
      dataAddressName: "常用地址",
      dataAddressDesc: "用户级地址簿与默认地址",
      dataOrderName: "订单与计价",
      dataOrderDesc: "草稿到支付的完整状态",
      rulesEyebrow: "业务规则",
      rulesTitle: "把规则写进代码，而不是文档里",
      rulesIntro: "从计价到鉴权，每条业务约束在服务端都有对应的校验与实现。",
      rulePriceTitle: "双向计价：现金与积分同价",
      rulePriceBody:
        "普通 ¥5 / 50 积分，加急 ¥7 / 70 积分，固定 1 元 = 10 积分；下单瞬间同时写入两种费用字段，用户可自由选择支付货币。",
      ruleValidTitle: "身份校验前置到接口层",
      ruleValidBody:
        "学号必须匹配 10 位数字、手机号匹配 1[3-9] 开头共 11 位，注册时还会检查学号与手机号是否已被占用。",
      ruleAuthTitle: "令牌鉴权与会话守卫",
      ruleAuthBody:
        "后端用 @token_required 装饰器解析 HS256 令牌并回查用户，令牌 24 小时过期；前端 router.beforeEach 拦截未登录访问。",
      ruleScopeTitle: "用户级隔离与上传安全",
      ruleScopeBody:
        "地址与订单查询强制携带 user_id 过滤，越权 ID 返回 404；上传仅允许 png/jpg/jpeg/gif，限制 5MB 并用 UUID 重命名防覆盖。",
      featuresEyebrow: "核心功能",
      featuresTitle: "从登录到履约的完整体验",
      featureOne: "学号 10 位数字注册、PBKDF2 加密与 16 条受保护路由",
      featureTwo: "四步下单：需求 → 地址 → 支付 → 完成，支持加急计价",
      featureThree: "个人资料、常用地址（含默认地址切换）、积分与订单状态",
      featureFour: "订单图片上传（类型白名单 + 5MB 限制）与用户级 API 权限",
      architectureEyebrow: "系统架构",
      architectureTitle: "清晰的前后端分层",
      archClient: "客户端",
      archData: "数据层",
      engineeringEyebrow: "工程拆解",
      engineeringTitle: "不仅完成页面，也打通真实数据链路",
      engineeringBody:
        "前端路由、状态管理和表单交互与后端认证、数据库关系、文件上传共同组成可运行的全栈应用。",
      engineeringFrontTitle: "前端应用层",
      engineeringFrontBody:
        "Vue 3.5 + Vite 6 单页应用，Vue Router 4 以 beforeEach 守卫 16 条受保护路由，Pinia 3 管理共享状态，Element Plus 承载表单与反馈。",
      engineeringApiTitle: "后端服务层",
      engineeringApiBody:
        "Flask 3 提供 17 个 REST 接口，@token_required 装饰器统一解析 JWT，Flask-CORS 限定前端来源并支持凭证。",
      engineeringDataTitle: "数据模型层",
      engineeringDataBody:
        "User / Address / Order 三个 SQLAlchemy 模型以外键关联，地址与订单查询强制携带 user_id 实现隔离。",
      engineeringSecurityTitle: "认证与安全",
      engineeringSecurityBody:
        "PBKDF2-SHA256 密码哈希、24 小时 HS256 令牌、学号与手机号正则校验、上传类型白名单与 5MB 上限。",
      apiRegister: "创建学生账户",
      apiLogin: "验证身份并签发令牌",
      apiProfile: "读取当前用户资料",
      apiUpdateProfile: "更新姓名、手机号与校区",
      apiAddresses: "读取当前用户地址",
      apiAddAddress: "新增常用地址",
      apiDefaultAddress: "切换默认地址",
      apiEditAddress: "更新或删除地址",
      apiOrder: "创建并计算配送订单",
      apiOrderAddress: "回填配送与接收地址",
      apiOrderList: "按时间倒序读取订单列表",
      apiOrderDetail: "获取用户订单详情",
      apiUpload: "上传订单凭证图片",
    },
    moreProjects: {
      title: "更多项目",
      hackathonType: "数据竞赛 · 联合国大数据黑客松",
      hackathonTitle: "骑手配送系统研究",
      hackathonBody:
        "基于 75 份问卷与实地调研，发现平台算法将平均配送时间压缩 9.4%，致骑手违规率上升 23%；提出改进贪心智能调度算法，模拟验证配送效率提升 15%。",
      petType: "深度学习 · 计算机视觉",
      petTitle: "跨风格猫狗图像识别",
      petBody:
        "采集清洗 27,000 张跨风格图像，构建 CNN 分类模型，测试集准确率 94.32%；用 CAM 可视化验证动漫数据使纹理敏感度提升 3.2%。",
      biliType: "NLP · 文本挖掘",
      biliTitle: "弹幕情感与主题挖掘",
      biliBody:
        "爬取 B 站社科视频弹幕，用 Jieba + SnowNLP 做情感分析、LDA 做主题建模；专业术语占比 38.7%，构建「术语密度-情感极性」评估模型。",
      bikeType: "机器学习 · 需求预测",
      bikeTitle: "共享单车需求预测",
      bikeBody:
        "20,000+ 条租赁记录，对比 MLP 与 XGBoost 等 6 种模型，RMSLE 0.29（较基线提升 15%），识别高峰与天气对需求的非线性影响。",
    },
    research: {
      title: "研究论文",
      expandAbstract: "展开全文",
      collapseAbstract: "收起",
      backHome: "回到主页",
      kicker: "本科毕业论文 · 强化学习 × 算法公平",
      paperTitle: "基于强化学习的优惠券公平发放策略",
      paperTitleEn: "Fair-DQN · Fairness-aware coupon allocation via deep reinforcement learning",
      metaAuthor: "作者：董炎源（Actor.D）",
      metaAdvisor: "指导教师：张伟",
      metaSchool: "浙江大学管理学院 · 信息管理与信息系统",
      metaPeriod: "2022 级 · 2026.05",
      statsTransactions: "清洗后交易记录",
      statsCoupons: "优惠券记录 · 核销率 26.47%",
      statsInventory: "门店库存记录",
      statsDays: "天真实运营数据（2024.04–07）",
      statsSamples: "测试集样本",
      statsPolicies: "种策略横向对比",
      previewSummary:
        "把「公平」写进优化目标：群体间长期价值差距压缩约 99%，整体收益反而提升约 11%——公平与效率，可以正和。",
      viewFull: "阅读完整论文",
      statDisparityLabel: "群体差距降幅",
      statReturnLabel: "整体收益提升",
      statLLabel: "型低成本公平区间",
      abstractZhTitle: "中文摘要",
      abstractZh: `算法化的资源分配在追求效率最优时，往往因敏感属性与回报响应之间的内生相关性而系统性偏向高响应群体，使群体间回报差距被结构性放大。本文从分配正义理论出发，区分分配公平与结果公平两种范式，并明确选择结果公平作为本文的规范性立场——当群体响应率存在固有差异时，输入侧的等额发放因"同额不同效"反而扩大产出端不公平，故公平问题应被转化为可优化的目标函数设计问题。在此基础上提出Fair-DQN框架，将基于群体长期价值分布的不均度惩罚项作为结构性正则化嵌入Double DQN训练目标，并辅以动作掩码与熵正则稳定离线策略学习；理论上证明该惩罚项的梯度对群体均值具有双向校准性质，其作用机理是对Q值沿敏感属性维度分布形态的重塑，而非对参数范数的约束。本文基于某大型零售平台2024年4月至7月共85天的真实运营数据，将优惠券发放建模为含库存调节项的马尔可夫决策过程，并通过多随机种子重复、匹配样本无偏估计与七策略横向对比加以稳健性验证。Fair-DQN将群体间长期价值差距压缩约99%，整体收益反而提升约11%；公平惩罚强度的敏感性曲线呈现明显的"L型"拐点结构，表明绝大部分公平改善仅需极低效率代价即可获得，证伪了"公平必以效率为代价"的线性权衡直觉，识别出具有管理含义的"低代价公平"区间。机制层面揭示出"价值判断校准—动作偏好转移—特征依赖重组"的三级传导路径：公平约束自Q值的内部估计层逐级外传，最终使决策依据从会员等级等敏感代理变量转向库存与历史交互等情境性状态特征，在决策层实现可度量的去身份化。本文的核心理论贡献在于揭示，重新设定优化目标相较于精细调整算法结构在治理算法不公平问题上更具根本性——当公平被恰当形式化并嵌入目标函数时，效率与公平不再呈现零和关系，而可在结构性正则化作用下相互成就；这一发现为序贯决策情境下的算法责任化设计提供了一份来自管理科学与工程视角的可复现实证证据。`,
      abstractEnTitle: "Abstract",
      abstractEn: `Algorithmic resource allocation that optimizes solely for efficiency tends to favor high-response groups whenever sensitive attributes are endogenously correlated with reward responsiveness, structurally amplifying inter-group return disparities and giving rise to a fundamental tension between algorithmic efficiency and group fairness in sequential decision settings. Grounded in distributive justice theory, this paper distinguishes input-side from outcome-side fairness and explicitly adopts the latter as its normative stance: when intrinsic group-level differences in response rates are present, equalizing inputs compounds into outcome-side inequity, so fairness must be reframed as a computable problem of objective-function design. We accordingly propose Fair-DQN, a deep reinforcement-learning framework that embeds an inter-group long-run-value disparity penalty as a structural regularizer into the Double DQN objective, complemented by action masking and entropy regularization for offline stability; the penalty's gradient is shown to exhibit a bilateral calibration property around the group mean, so that its mechanism reshapes value distributions along the sensitive attribute rather than constraining parameter norms. Using 85 days of operational data (April–July 2024) from a major retail platform, we formulate coupon distribution as a finite-horizon Markov decision process with an inventory-adjusted reward and validate the framework through multi-seed replication, matched-sample unbiased estimation, and a seven-policy comparative benchmark. Fair-DQN compresses the inter-group long-run-value gap by approximately 99% while raising aggregate return by approximately 11% over the historical policy—satisfying a Kaldor–Hicks improvement and falsifying the prevailing linear-trade-off intuition; the sensitivity curve with respect to fairness-penalty strength exhibits a pronounced L-shaped knee, indicating that the bulk of fairness gains can be secured at near-zero efficiency cost and identifying a managerially actionable "low-cost fairness" regime. Mechanism analysis uncovers a three-tier transmission pathway—value calibration → action-preference shift → feature-dependence restructuring—through which the fairness constraint propagates outward from internal value estimates, ultimately reorienting the decision basis from sensitive proxy attributes such as membership tier toward context-dependent state features such as inventory level and historical interaction, yielding a measurable degree of de-identification. The central theoretical contribution is that redesigning the objective is more consequential than refining the architecture in addressing algorithmic unfairness: when fairness is properly formalized and embedded into the objective, efficiency and fairness cease to be zero-sum and can become mutually reinforcing through structural regularization—offering reproducible empirical evidence, from a management science and engineering perspective, for the principled design of accountable algorithms in sequential decision contexts.`,
      keywordsLabelZh: "关键词",
      keywordsLabelEn: "Keywords",
      keywordsZh: "深度强化学习；优惠券发放策略；算法公平性；结果公平；结构性正则化；去身份化决策",
      keywordsEn: "Deep Reinforcement Learning; Coupon Allocation; Algorithmic Fairness; Outcome Fairness; Structural Regularization; De-identified Decision-Making",
      findingsEyebrow: "核心发现",
      findingsTitle: "公平与效率，可以正和",
      finding1Label: "群体间长期价值差距降幅",
      finding1Note: "Q-Disparity：7.96 → 0.057",
      finding2Label: "整体期望收益提升",
      finding2Note: "Weighted E[R]：191.60 → 212.07",
      finding3Label: "200 元券投放占比提升",
      finding3Note: "10.4% → 26.0%，定向唤醒沉睡用户",
      finding4Label: "五次独立运行标准差",
      finding4Note: "结果跨随机种子高度稳健",
      finding5Label: "λ=0.005 时公平改善幅度",
      finding5Note: "回报代价仅 2.6% —— L 型「低成本公平」区间",
      finding6Label: "种策略横向对比",
      finding6Note: "Fair-DQN 总回报 675.5 万居首",
      contributionsEyebrow: "三大贡献",
      contributionsTitle: "从模型到机制，再到治理",
      contribution1Title: "模型：公平强化学习框架",
      contribution1Body: "构建含 17 维状态、6 级动作与库存调节奖励的 MDP，将群体间长期回报差距以惩罚项嵌入 Double DQN 训练目标，辅以 Action Masking 与熵正则化；梯度推导揭示其本质是「结构性正则化」——约束价值分布形态而非参数范数。",
      contribution2Title: "实证：低成本公平与三级传导",
      contribution2Body: "发现「L 型」低成本公平区间与卡尔多-希克斯改进：公平约束不是削峰填谷，而是做大蛋糕；凝练出「价值判断校准—动作偏好转移—特征依赖重组」的三级传导机制。",
      contribution3Title: "管理：从算法发明到目标设计",
      contribution3Body: "决策者应把关注点从「发明新算法」转向「选择正确的优化目标」：一旦明确「什么是公平」，公平就从价值宣言变为可计算、可优化、可审计的目标函数设计问题。",
      pipelineEyebrow: "研究流程",
      pipelineTitle: "从数据现象到可检验的优化问题",
      step1Title: "问题定义",
      step1Body: "「同额不同效」悖论：等额发放反而随时间放大群体差距，公平必须被重新定义为可追踪、可约束的优化目标。",
      step2Title: "MDP 建模",
      step2Body: "17 维状态空间、6 级动作空间（0/5/10/25/40/200 元）与含库存调节项的奖励函数。",
      step3Title: "Fair-DQN 训练",
      step3Body: "Double DQN + Disparity 惩罚 + Action Masking + 熵正则化，离线训练，5 个独立种子。",
      step4Title: "实验评估",
      step4Body: "核心/辅助/诊断三层指标体系，匹配样本无偏估计，7 策略对比与 λ 敏感性分析。",
      step5Title: "机制解释",
      step5Body: "特征重要性、动作画像、Q 值分析与决策转移矩阵，凝练「三级传导」机制模型。",
      modelEyebrow: "模型架构",
      modelTitle: "Fair-DQN 一图速览",
      modelStateTitle: "状态空间 · 17 维",
      modelStateList: "用户静态特征 ×4 · 行为特征 ×5 · 优惠券特征 ×3 · 环境约束 ×5",
      modelNetTitle: "Q 网络 · 三层全连接",
      modelNetList: "LayerNorm + ReLU + Dropout · 软更新目标网络 · Action Masking · Disparity 惩罚 + 熵正则",
      modelActionTitle: "动作空间 · 6 级",
      modelActionList: "不发券 0 元 · 5 元 · 10 元 · 25 元 · 40 元 · 200 元",
      transmissionEyebrow: "机制发现",
      transmissionTitle: "「三级传导」统一机制模型",
      transmission1Title: "价值判断校准",
      transmission1Body: "公平约束重塑 Q 值分布：G₁ 平均价值 22.40 → 14.91，G₂ 由 12.05 → 14.02，群体差距从 10.35 缩至 0.89。",
      transmission2Title: "动作偏好转移",
      transmission2Body: "200 元券占比 10.4% → 26.0%，集中投向低活跃、低核销用户；「不发券」被系统性重构为差异化补偿投入。",
      transmission3Title: "特征依赖重组",
      transmission3Body: "决策依据从「会员等级」等身份标签转向「历史领券次数、平均库存」等情境特征——在决策层实现可度量的去身份化。",
      figuresEyebrow: "论文图表",
      figuresTitle: "关键图表与证据",
      figuresHint: "点击任意图表可放大查看",
      fig21: "图 2.1 数据探索性分析：券状态、面额分布与 G₁/G₂ 核销率对比",
      fig31: "图 3.1 Fair-DQN 网络架构",
      fig41: "图 4.1 训练过程：TD 损失与 Fairness Disparity",
      fig42: "图 4.2 测试集评估：动作分布与回报-公平散点",
      fig44: "图 4.4 七策略综合对比",
      fig46: "图 4.6 敏感性分析：L 型曲线",
      fig51: "图 5.1 梯度法特征重要性：Fair-DQN vs Baseline",
      fig58: "图 5.8 决策转移矩阵：Historical → Fair-DQN / Baseline",
      tableEyebrow: "实验结果",
      tableTitle: "七策略横向对比",
      thPolicy: "策略",
      thWeightedER: "Weighted E[R]",
      thTotalReturn: "总回报",
      thTotalCost: "总成本",
      thQDisp: "Q-Disp",
      thRefQDisp: "Ref Q-Disp",
      policyFairDQN: "Fair-DQN（本文）",
      policyBaseline: "Baseline（纯收益 DQN）",
      policyHistorical: "Historical（历史策略）",
      policyRandom: "Random（随机策略）",
      policyBlind25: "Blind（统一 25 元）",
      policyBlind5: "Blind（统一 5 元）",
      policyBlind10: "Blind（统一 10 元）",
      noteQDisp: "注：Q-Disp 仅对参与训练的 Fair-DQN 与 Baseline 可评定；其余策略以 Fair-DQN 网络作为裁判计算 Ref Q-Disp。完整数据见论文表 4.2。",
      limitsEyebrow: "局限与展望",
      limitsTitle: "六项局限，六个方向",
      limit1Title: "单一平台与时间窗口",
      limit1Body: "结论基于单一连锁超市 85 天数据，跨业态、跨周期的外部效度有待检验。",
      limit2Title: "二元分组较粗糙",
      limit2Body: "公平性仅基于会员等级二分，组内结构差异未被刻画。",
      limit3Title: "离线评估固有偏差",
      limit3Body: "历史数据已被原有策略塑形，结果应视为「指示性证据」，需线上 A/B 或模拟环境逼近无偏结论。",
      limit4Title: "网络结构简洁",
      limit4Body: "两层全连接 Q 网络，可探索 CQL、Dueling DQN 等更富表达力的结构。",
      limit5Title: "群体均值公平度量",
      limit5Body: "仅约束组间均值，个体公平与组内分布约束是自然延伸。",
      limit6Title: "机制链为推断性解释",
      limit6Body: "「三级传导」基于推断而非严格因果识别，未来可设计受控消融实验强化因果证据。",
      future1Title: "跨业态、跨周期复现",
      future1Body: "在服装、3C、生鲜等业态与促销季/常规期对照下重做敏感性分析，检验 L 型曲线的稳定性。",
      future2Title: "细粒度公平划分",
      future2Body: "从会员二分扩展到金卡/银卡、注册渠道、地理位置等多层次群体定义，寻找公平的「最优颗粒度」。",
      future3Title: "线上决策性证据",
      future3Body: "以 A/B 测试为主线，辅以 LLM 模拟环境，完成「离线—模拟—线上」三类证据的层层逼近。",
      future4Title: "更强的算法骨架",
      future4Body: "把 Disparity 惩罚移植到 CQL 与 Dueling DQN，或将 Q 值标量估计推广为分布估计。",
      future5Title: "混合公平度量",
      future5Body: "引入个体公平与组内分布约束，让公平在群体间、个体间、组内形态上都被度量。",
      future6Title: "准因果机制验证",
      future6Body: "用「逐级断链」式受控消融与反事实归因，把三级传导从相关性证据推进为准因果命题。",
      quote: "重新设定优化目标，比精细调整算法结构更具根本性——当公平被恰当形式化并嵌入目标函数时，效率与公平不再零和。",
      quoteSource: "—— 论文 7.2 未来展望",
    },
    journey: {
      title: "学习与方向",
      zjuType: "本科 · ZJU",
      zjuTitle: "浙江大学",
      zjuBody:
        "信息管理与信息系统专业毕业（均分 85），建立了信息技术、数据与管理相结合的知识基础；获 2022-2023 学年浙江大学学业优秀标兵。",
      cuhkType: "硕士 · CUHK",
      cuhkTitle: "香港中文大学",
      cuhkBody: "现就读于商业分析理学硕士项目，进一步探索数据分析在商业场景中的应用。",
      focusType: "专业方向",
      focusTitle: "跨学科视角",
      focusBody:
        "将信息系统背景与商业分析方法相连接，从数据中提炼洞察，为复杂问题寻找清晰、可执行的答案。",
    },
    contact: { lineOne: "期待与你连接，", lineTwo: "聊聊新的想法。" },
    footer: { backToTop: "回到顶部 ↑" },
  },
  en: {
    pageTitle: "Actor.D | Personal Website",
    pageDescription:
      "Actor.D's personal website — ZJU graduate in Information Management & Information Systems and MSc Business Analytics student at CUHK.",
    researchPageTitle: "Research Paper · Actor.D | Personal Website",
    researchPageDescription:
      "Actor.D's undergraduate thesis — Fair-DQN, fairness-aware coupon allocation via deep reinforcement learning: abstract, key findings, model, and experiments.",
    projectPageTitle: "Project · Actor.D | Personal Website",
    projectPageDescription:
      "Actor.D's full-stack project Zhejiulai — a campus delivery platform for Zhejiang University: interactive UI previews, business workflow, system architecture, and API design.",
    accessibility: {
      skip: "Skip to main content",
      home: "Back to home",
      language: "Switch page language",
      menuOpen: "Open navigation menu",
      menuClose: "Close navigation menu",
      navigation: "Main navigation",
      portrait: "Actor.D data profile panel",
      focusList: "Areas of focus",
      techStack: "Project technology stack",
      projectPreview: "Interactive interface preview for the Zhejiulai project",
      projectTabs: "Choose a project screen to preview",
      lightboxLabel: "Thesis figure preview",
      lightboxClose: "Close figure preview",
    },
    nav: { about: "About", projects: "Project", research: "Research", journey: "Journey", contact: "Contact" },
    common: {
      backHome: "Back to home",
      nextProject: "Continue: the project case",
      nextResearch: "Continue: the research paper",
    },
    hero: {
      eyebrow: "INFORMATION SYSTEMS × BUSINESS ANALYTICS",
      greeting: "Hi, I'm",
      name: "Actor.D.",
      intro:
        "From Information Management & Information Systems at Zhejiang University to an MSc in Business Analytics at CUHK, I continue to explore the intersection of data, technology, and business.",
      primaryAction: "View my project",
      secondaryAction: "Get in touch",
      researchAction: "Read my thesis",
      scroll: "Scroll to explore",
      metricBuild: "Front-end & back-end",
      metricJourney: "Cross-campus journey",
      metricFocus: "Interdisciplinary lens",
      visualStatus: "CURRENT STATUS",
      visualMode: "EXPLORATION MODE",
    },
    about: {
      title: "About me",
      lead: "Understanding problems through data and enabling better business decisions through analytics.",
      body:
        "I'm Dong Yanyuan (Actor.D). I graduated from Zhejiang University with a degree in Information Management & Information Systems and am currently pursuing an MSc in Business Analytics at The Chinese University of Hong Kong. This interdisciplinary journey keeps me focused on connecting data and technology with real business challenges.",
      techLabel: "Tech stack",
      factFoundation: "FOUNDATION",
      factCurrent: "CURRENT PROGRAMME",
      factInterest: "INTERESTS",
    },
    focus: {
      informationManagement: "Information Management",
      informationSystems: "Information Systems",
      businessAnalytics: "Business Analytics",
      dataDriven: "Data-driven Decisions",
    },
    projects: {
      title: "Featured project",
      type: "FULL-STACK WEB APPLICATION",
      subtitle: "A campus delivery service platform designed for Zhejiang University",
      summary:
        "A Vue 3 SPA with a Flask REST service for campus delivery: 18 front-end routes (16 protected), 17 endpoints, and 3 database tables covering sign-up, four-step ordering, an address book, dual cash/points payment, and order tracking.",
      previewSummary:
        "A full loop from student sign-up to order fulfilment: JWT sessions with route guards, a four-step ordering flow, a per-user address book, dual cash/points pricing, and type-allow-listed image uploads — all driven by real endpoints.",
      viewFull: "View the full case study",
      viewSource: "View source",
      viewReadme: "Run guide",
      highlightOne: "18 routes with router.beforeEach guards and 24-hour JWT sessions",
      highlightTwo: "Four-step ordering with dual pricing: ¥5 / 50 points, or ¥7 / 70 priority",
      highlightThree: "3 tables and 17 endpoints, with addresses and orders scoped by user_id",
      challengeEyebrow: "THE PROBLEM",
      challengeTitle: "Campus delivery information is fragmented, with no unified fulfilment workflow",
      challengeBody:
        "Across food, parcel, and on-campus delivery, students repeatedly communicate pickup points, destinations, fees, and progress—making details easy to miss.",
      solutionEyebrow: "THE SOLUTION",
      solutionTitle: "Connect identity, orders, addresses, and payment in one digital chain",
      solutionBody:
        "The platform builds a unified account around student identity, simplifies ordering with guided steps, and retains the complete service history through status tracking and a personal centre.",
      prototype: "Interactive UI preview",
      tabLogin: "User login",
      tabOrder: "Create order",
      tabOrders: "Order management",
      mockPlatform: "Campus delivery platform",
      mockWelcome: "Welcome back",
      mockWelcomeBody: "Sign in with your student ID",
      mockCampus: "Campus",
      mockCampusValue: "Zijingang Campus, ZJU",
      mockStudentId: "Student ID",
      mockPassword: "Password",
      mockLoginButton: "Sign in",
      mockRegister: "Create account",
      mockReset: "Reset password",
      mockNewOrder: "Create delivery order",
      stepInfo: "Order info",
      stepAddress: "Address",
      stepPayment: "Payment",
      stepComplete: "Complete",
      mockOrderDetail: "Delivery request",
      mockFoodName: "Food or item",
      mockFoodValue: "Takeout order",
      mockLocker: "Pickup locker",
      mockLockerValue: "East Gate 2 smart locker, Zijingang",
      mockUrgent: "Priority delivery",
      mockSummary: "Order summary",
      mockDeliveryFee: "Delivery fee",
      mockPoints: "Pay with points",
      mockNext: "Continue",
      mockMyOrders: "My orders",
      mockSmartLocker: "East Gate 2 smart locker",
      mockUrgentTag: "Priority",
      mockDelivering: "Delivering",
      mockTakeout: "Takeout order",
      mockDetail: "View details",
      mockReorder: "Order again",
      mockDorm: "Lantian College dormitory",
      mockCompleted: "Completed",
      mockParcel: "Parcel pickup",
      factWorkflow: "step order workflow",
      factModels: "database tables",
      factApi: "REST endpoints",
      factRoutes: "protected routes",
      flowEyebrow: "CORE WORKFLOW",
      flowTitle: "From request to fulfilment",
      flowOneTitle: "Submit request",
      flowOneBody: "Enter the item, pickup locker, and notes; the priority flag drives all downstream pricing.",
      flowTwoTitle: "Confirm address",
      flowTwoBody: "Pick a saved address or type a new one, resolved server-side into a readable string.",
      flowThreeTitle: "Choose payment",
      flowThreeBody: "¥5 / 50 points standard, ¥7 / 70 points priority — cash and points stay equivalent.",
      flowFourTitle: "Track order",
      flowFourBody: "Review the newest-first order list with details and payment status.",
      dataEyebrow: "DATA MODELS",
      dataTitle: "Three tables carry the whole loop",
      dataIntro:
        "SQLAlchemy ORM defines the users / addresses / orders models, joined by user_id foreign keys, with every read and write scoped to the owner.",
      dataUserName: "Users & identity",
      dataUserDesc: "Account, campus, and points balance",
      dataAddressName: "Saved addresses",
      dataAddressDesc: "Per-user address book with default flag",
      dataOrderName: "Orders & pricing",
      dataOrderDesc: "Full state from draft to paid",
      rulesEyebrow: "BUSINESS RULES",
      rulesTitle: "Rules live in code, not in a document",
      rulesIntro: "From pricing to authorization, every business constraint has a matching server-side check.",
      rulePriceTitle: "Dual currency: cash and points priced alike",
      rulePriceBody:
        "¥5 / 50 points standard, ¥7 / 70 points priority at a fixed 1 CNY = 10 points; both fee fields are written on creation so users pick their currency.",
      ruleValidTitle: "Identity validation at the API layer",
      ruleValidBody:
        "Student IDs must be 10 digits and phones must match 1[3-9] followed by 9 digits; registration also rejects duplicate IDs and phone numbers.",
      ruleAuthTitle: "Token auth and session guards",
      ruleAuthBody:
        "The @token_required decorator decodes the HS256 token and reloads the user, expiring after 24 hours; the SPA blocks unauthenticated routes in router.beforeEach.",
      ruleScopeTitle: "User-scoped isolation and safe uploads",
      ruleScopeBody:
        "Address and order queries always filter by user_id and return 404 on foreign IDs; uploads accept only png/jpg/jpeg/gif under 5 MB and are renamed with a UUID.",
      featuresEyebrow: "CORE CAPABILITIES",
      featuresTitle: "A complete experience from sign-in to delivery",
      featureOne: "10-digit student sign-up, PBKDF2 hashing, and 16 protected routes",
      featureTwo: "Four-step ordering: request → address → payment → done, with priority pricing",
      featureThree: "Profiles, saved addresses with default switching, points, and order status",
      featureFour: "Order image uploads (type allow-list + 5 MB cap) and user-scoped API access",
      architectureEyebrow: "SYSTEM ARCHITECTURE",
      architectureTitle: "A clear full-stack separation",
      archClient: "CLIENT",
      archData: "DATA LAYER",
      engineeringEyebrow: "ENGINEERING BREAKDOWN",
      engineeringTitle: "More than screens: a connected, working data flow",
      engineeringBody:
        "Front-end routing, state, and form interactions work with back-end authentication, relational data, and file uploads to form a functional full-stack application.",
      engineeringFrontTitle: "Front-end application",
      engineeringFrontBody:
        "A Vue 3.5 + Vite 6 SPA where Vue Router 4 guards 16 authenticated routes in beforeEach, Pinia 3 holds shared state, and Element Plus powers forms and feedback.",
      engineeringApiTitle: "Back-end services",
      engineeringApiBody:
        "Flask 3 exposes 17 REST endpoints behind a shared @token_required JWT decorator, with Flask-CORS restricted to the front-end origins and credentials enabled.",
      engineeringDataTitle: "Data models",
      engineeringDataBody:
        "The User / Address / Order SQLAlchemy models are joined by foreign keys, and address and order queries always carry user_id to enforce isolation.",
      engineeringSecurityTitle: "Authentication & security",
      engineeringSecurityBody:
        "PBKDF2-SHA256 password hashing, 24-hour HS256 tokens, student-ID and phone regex validation, plus upload type allow-listing and a 5 MB cap.",
      apiRegister: "Create a student account",
      apiLogin: "Verify identity and issue a token",
      apiProfile: "Read the current user's profile",
      apiUpdateProfile: "Update name, phone, and campus",
      apiAddresses: "Read the current user's addresses",
      apiAddAddress: "Add a saved address",
      apiDefaultAddress: "Switch the default address",
      apiEditAddress: "Update or delete an address",
      apiOrder: "Create and price a delivery order",
      apiOrderAddress: "Attach delivery and receiver addresses",
      apiOrderList: "List orders, newest first",
      apiOrderDetail: "Retrieve user-scoped order details",
      apiUpload: "Upload an order proof image",
    },
    moreProjects: {
      title: "More projects",
      hackathonType: "Data competition · UN Big Data Hackathon",
      hackathonTitle: "Rider Delivery System Study",
      hackathonBody:
        "From 75 surveys and field research, found the platform compressed average delivery time by 9.4% while rider violations rose 23%; proposed an improved greedy scheduling algorithm, with simulated efficiency gains of 15%.",
      petType: "Deep learning · Computer vision",
      petTitle: "Cross-style Cat & Dog Recognition",
      petBody:
        "Collected and cleaned 27,000 cross-style images, built a CNN classifier reaching 94.32% test accuracy; CAM visualization verified that anime data raised texture sensitivity by 3.2%.",
      biliType: "NLP · Text mining",
      biliTitle: "Danmaku Sentiment & Topic Mining",
      biliBody:
        "Scraped Bilibili social-science danmaku, applied Jieba + SnowNLP sentiment analysis and LDA topic modeling; 38.7% domain-term density, built a term-density × sentiment-polarity evaluation model.",
      bikeType: "Machine learning · Demand forecasting",
      bikeTitle: "Bike-share Demand Forecasting",
      bikeBody:
        "Across 20,000+ rental records, benchmarked six models (MLP, XGBoost) to reach RMSLE 0.29 (+15% vs baseline), revealing non-linear peak-time and weather effects.",
    },
    research: {
      title: "Research Paper",
      expandAbstract: "Read more",
      collapseAbstract: "Collapse",
      backHome: "Back to home",
      kicker: "Undergraduate thesis · RL × algorithmic fairness",
      paperTitle: "Fairness-Aware Coupon Allocation via Deep Reinforcement Learning",
      paperTitleEn: "Original thesis title: 基于强化学习的优惠券公平发放策略",
      metaAuthor: "Author: Dong Yanyuan (Actor.D)",
      metaAdvisor: "Supervisor: Zhang Wei",
      metaSchool: "ZJU School of Management · Information Management & Information Systems",
      metaPeriod: "Class of 2022 · May 2026",
      statsTransactions: "cleaned transaction records",
      statsCoupons: "coupon records · 26.47% redemption",
      statsInventory: "store inventory records",
      statsDays: "days of operational data (Apr–Jul 2024)",
      statsSamples: "test-set samples",
      statsPolicies: "policies benchmarked",
      previewSummary:
        "Writing fairness into the objective: the inter-group long-run-value gap shrinks by ~99% while aggregate return rises ~11% — fairness and efficiency can be a positive-sum game.",
      viewFull: "Read the full paper",
      statDisparityLabel: "gap reduction",
      statReturnLabel: "return gain",
      statLLabel: "-shaped low-cost fairness",
      abstractZhTitle: "Chinese Abstract",
      abstractZh: `算法化的资源分配在追求效率最优时，往往因敏感属性与回报响应之间的内生相关性而系统性偏向高响应群体，使群体间回报差距被结构性放大。本文从分配正义理论出发，区分分配公平与结果公平两种范式，并明确选择结果公平作为本文的规范性立场——当群体响应率存在固有差异时，输入侧的等额发放因"同额不同效"反而扩大产出端不公平，故公平问题应被转化为可优化的目标函数设计问题。在此基础上提出Fair-DQN框架，将基于群体长期价值分布的不均度惩罚项作为结构性正则化嵌入Double DQN训练目标，并辅以动作掩码与熵正则稳定离线策略学习；理论上证明该惩罚项的梯度对群体均值具有双向校准性质，其作用机理是对Q值沿敏感属性维度分布形态的重塑，而非对参数范数的约束。本文基于某大型零售平台2024年4月至7月共85天的真实运营数据，将优惠券发放建模为含库存调节项的马尔可夫决策过程，并通过多随机种子重复、匹配样本无偏估计与七策略横向对比加以稳健性验证。Fair-DQN将群体间长期价值差距压缩约99%，整体收益反而提升约11%；公平惩罚强度的敏感性曲线呈现明显的"L型"拐点结构，表明绝大部分公平改善仅需极低效率代价即可获得，证伪了"公平必以效率为代价"的线性权衡直觉，识别出具有管理含义的"低代价公平"区间。机制层面揭示出"价值判断校准—动作偏好转移—特征依赖重组"的三级传导路径：公平约束自Q值的内部估计层逐级外传，最终使决策依据从会员等级等敏感代理变量转向库存与历史交互等情境性状态特征，在决策层实现可度量的去身份化。本文的核心理论贡献在于揭示，重新设定优化目标相较于精细调整算法结构在治理算法不公平问题上更具根本性——当公平被恰当形式化并嵌入目标函数时，效率与公平不再呈现零和关系，而可在结构性正则化作用下相互成就；这一发现为序贯决策情境下的算法责任化设计提供了一份来自管理科学与工程视角的可复现实证证据。`,
      abstractEnTitle: "Abstract",
      abstractEn: `Algorithmic resource allocation that optimizes solely for efficiency tends to favor high-response groups whenever sensitive attributes are endogenously correlated with reward responsiveness, structurally amplifying inter-group return disparities and giving rise to a fundamental tension between algorithmic efficiency and group fairness in sequential decision settings. Grounded in distributive justice theory, this paper distinguishes input-side from outcome-side fairness and explicitly adopts the latter as its normative stance: when intrinsic group-level differences in response rates are present, equalizing inputs compounds into outcome-side inequity, so fairness must be reframed as a computable problem of objective-function design. We accordingly propose Fair-DQN, a deep reinforcement-learning framework that embeds an inter-group long-run-value disparity penalty as a structural regularizer into the Double DQN objective, complemented by action masking and entropy regularization for offline stability; the penalty's gradient is shown to exhibit a bilateral calibration property around the group mean, so that its mechanism reshapes value distributions along the sensitive attribute rather than constraining parameter norms. Using 85 days of operational data (April–July 2024) from a major retail platform, we formulate coupon distribution as a finite-horizon Markov decision process with an inventory-adjusted reward and validate the framework through multi-seed replication, matched-sample unbiased estimation, and a seven-policy comparative benchmark. Fair-DQN compresses the inter-group long-run-value gap by approximately 99% while raising aggregate return by approximately 11% over the historical policy—satisfying a Kaldor–Hicks improvement and falsifying the prevailing linear-trade-off intuition; the sensitivity curve with respect to fairness-penalty strength exhibits a pronounced L-shaped knee, indicating that the bulk of fairness gains can be secured at near-zero efficiency cost and identifying a managerially actionable "low-cost fairness" regime. Mechanism analysis uncovers a three-tier transmission pathway—value calibration → action-preference shift → feature-dependence restructuring—through which the fairness constraint propagates outward from internal value estimates, ultimately reorienting the decision basis from sensitive proxy attributes such as membership tier toward context-dependent state features such as inventory level and historical interaction, yielding a measurable degree of de-identification. The central theoretical contribution is that redesigning the objective is more consequential than refining the architecture in addressing algorithmic unfairness: when fairness is properly formalized and embedded into the objective, efficiency and fairness cease to be zero-sum and can become mutually reinforcing through structural regularization—offering reproducible empirical evidence, from a management science and engineering perspective, for the principled design of accountable algorithms in sequential decision contexts.`,
      keywordsLabelZh: "Keywords",
      keywordsLabelEn: "Keywords",
      keywordsZh: "深度强化学习；优惠券发放策略；算法公平性；结果公平；结构性正则化；去身份化决策",
      keywordsEn: "Deep Reinforcement Learning; Coupon Allocation; Algorithmic Fairness; Outcome Fairness; Structural Regularization; De-identified Decision-Making",
      findingsEyebrow: "KEY FINDINGS",
      findingsTitle: "Fairness and efficiency can be a positive-sum game",
      finding1Label: "Drop in inter-group long-run value gap",
      finding1Note: "Q-Disparity: 7.96 → 0.057",
      finding2Label: "Gain in overall expected return",
      finding2Note: "Weighted E[R]: 191.60 → 212.07",
      finding3Label: "Increase in ¥200 coupon share",
      finding3Note: "10.4% → 26.0%, aimed at dormant users",
      finding4Label: "Std across five independent runs",
      finding4Note: "Results stay stable across random seeds",
      finding5Label: "Fairness gain at λ=0.005",
      finding5Note: "Only 2.6% return cost — the L-shaped low-cost-fairness regime",
      finding6Label: "strategies benchmarked",
      finding6Note: "Fair-DQN tops total return at 6.755M",
      contributionsEyebrow: "THREE CONTRIBUTIONS",
      contributionsTitle: "From model to mechanism to governance",
      contribution1Title: "Model: a fairness-aware RL framework",
      contribution1Body: "An MDP with a 17-dim state, 6-tier actions, and inventory-adjusted rewards; the inter-group long-run-value gap is embedded as a penalty in the Double DQN objective, with action masking and entropy regularization. Gradient analysis shows it works as structural regularization — shaping value distributions rather than parameter norms.",
      contribution2Title: "Evidence: low-cost fairness & three-tier transmission",
      contribution2Body: "Uncovers an L-shaped low-cost-fairness regime and a Kaldor–Hicks improvement: the constraint grows the pie instead of merely redistributing it; distils the three-tier mechanism of value calibration → action-preference shift → feature-dependence restructuring.",
      contribution3Title: "Management: from inventing algorithms to designing objectives",
      contribution3Body: "Practitioners should shift from inventing new algorithms to choosing the right objective: once fairness is formalized, it becomes a computable, optimizable, auditable objective-design problem.",
      pipelineEyebrow: "RESEARCH PIPELINE",
      pipelineTitle: "From data patterns to a testable optimization problem",
      step1Title: "Problem definition",
      step1Body: "The equal-coupon paradox: identical inputs amplify group gaps over time, so fairness must be redefined as a trackable, constrainable objective.",
      step2Title: "MDP formulation",
      step2Body: "A 17-dim state space, a 6-tier action space (¥0/5/10/25/40/200), and an inventory-adjusted reward.",
      step3Title: "Fair-DQN training",
      step3Body: "Double DQN with a disparity penalty, action masking, and entropy regularization; offline training across 5 seeds.",
      step4Title: "Evaluation",
      step4Body: "Three-tier metrics, matched-sample unbiased estimation, a seven-policy benchmark, and λ sensitivity analysis.",
      step5Title: "Mechanism analysis",
      step5Body: "Feature importance, action portraits, Q-value analysis, and transition matrices yield the three-tier transmission model.",
      modelEyebrow: "MODEL ARCHITECTURE",
      modelTitle: "Fair-DQN at a glance",
      modelStateTitle: "State space · 17 dims",
      modelStateList: "Static profile ×4 · behaviour ×5 · coupon history ×3 · environment ×5",
      modelNetTitle: "Q-network · 3-layer MLP",
      modelNetList: "LayerNorm + ReLU + Dropout · soft target updates · action masking · disparity penalty + entropy",
      modelActionTitle: "Action space · 6 tiers",
      modelActionList: "No coupon ¥0 · ¥5 · ¥10 · ¥25 · ¥40 · ¥200",
      transmissionEyebrow: "MECHANISM INSIGHT",
      transmissionTitle: "The three-tier transmission model",
      transmission1Title: "Value calibration",
      transmission1Body: "The constraint reshapes Q-value distributions: G₁ mean value 22.40 → 14.91, G₂ 12.05 → 14.02 — the gap shrinks from 10.35 to 0.89.",
      transmission2Title: "Action-preference shift",
      transmission2Body: "¥200 coupon share rises 10.4% → 26.0%, focused on inactive, low-redemption users; the dominant no-coupon action is replaced by differentiated compensatory investment.",
      transmission3Title: "Feature-dependence restructuring",
      transmission3Body: "The model leans on context features (coupon history, inventory) instead of identity labels (membership tier) — measurable de-identified decision-making.",
      figuresEyebrow: "THESIS FIGURES",
      figuresTitle: "Key figures and evidence",
      figuresHint: "Click any figure to enlarge",
      fig21: "Fig 2.1 EDA: coupon status, denominations, G₁/G₂ redemption rates",
      fig31: "Fig 3.1 Fair-DQN network architecture",
      fig41: "Fig 4.1 Training: TD loss and fairness disparity",
      fig42: "Fig 4.2 Test-set evaluation: action distribution and return–fairness scatter",
      fig44: "Fig 4.4 Seven-policy comparison",
      fig46: "Fig 4.6 Sensitivity: the L-shaped curve",
      fig51: "Fig 5.1 Gradient feature importance: Fair-DQN vs Baseline",
      fig58: "Fig 5.8 Decision transition matrices: Historical → Fair-DQN / Baseline",
      tableEyebrow: "RESULTS",
      tableTitle: "Seven-policy benchmark",
      thPolicy: "Policy",
      thWeightedER: "Weighted E[R]",
      thTotalReturn: "Total return",
      thTotalCost: "Total cost",
      thQDisp: "Q-Disp",
      thRefQDisp: "Ref Q-Disp",
      policyFairDQN: "Fair-DQN (ours)",
      policyBaseline: "Baseline (profit-only DQN)",
      policyHistorical: "Historical (original policy)",
      policyRandom: "Random (uniform policy)",
      policyBlind25: "Blind (flat ¥25)",
      policyBlind5: "Blind (flat ¥5)",
      policyBlind10: "Blind (flat ¥10)",
      noteQDisp: "Note: Q-Disp applies only to the trained models; for the other policies, Ref Q-Disp is computed with the Fair-DQN network as referee. Full data in thesis Table 4.2.",
      limitsEyebrow: "LIMITATIONS & FUTURE WORK",
      limitsTitle: "Six limitations, six directions",
      limit1Title: "A single platform and time window",
      limit1Body: "The evidence comes from 85 days of one supermarket chain; external validity across formats and periods remains open.",
      limit2Title: "Coarse binary grouping",
      limit2Body: "Fairness is defined on membership tier only; within-group structure is not captured.",
      limit3Title: "Inherent offline-evaluation bias",
      limit3Body: "Historical data was shaped by the old policy, so results are indicative evidence; online A/B tests or simulation can approach unbiased conclusions.",
      limit4Title: "Simple network architecture",
      limit4Body: "The two-layer MLP leaves room for CQL, Dueling DQN, and richer structures.",
      limit5Title: "Group-mean fairness metric",
      limit5Body: "Only between-group means are constrained; individual fairness and within-group distributions are natural extensions.",
      limit6Title: "Inferential mechanism chain",
      limit6Body: "The three-tier transmission is inferred, not causally identified; controlled ablation studies can strengthen the evidence.",
      future1Title: "Cross-format, cross-period replication",
      future1Body: "Re-run sensitivity analyses across apparel, 3C, and fresh-food retail, and across promotion vs. regular seasons, to test the stability of the L-shaped curve.",
      future2Title: "Fine-grained fairness groups",
      future2Body: "Extend binary membership to gold/silver tiers, sign-up channels, and geography — and search for the optimal granularity of fairness.",
      future3Title: "Online, decision-grade evidence",
      future3Body: "Run A/B tests as the backbone, with LLM-based simulation environments bridging offline and online evaluation.",
      future4Title: "Stronger algorithmic skeletons",
      future4Body: "Port the disparity penalty to CQL and Dueling DQN, or extend scalar Q-values to distributional estimates.",
      future5Title: "Hybrid fairness metrics",
      future5Body: "Add individual fairness and within-group distribution constraints so fairness is measured between groups, within groups, and among individuals.",
      future6Title: "Quasi-causal mechanism validation",
      future6Body: "Use link-by-link controlled ablations and counterfactual attribution to move the transmission chain from correlation to quasi-causal evidence.",
      quote: "Redesigning the objective is more consequential than refining the architecture — when fairness is properly formalized and embedded into the objective, efficiency and fairness cease to be zero-sum.",
      quoteSource: "— Thesis §7.2, Future work",
    },
    journey: {
      title: "Journey & focus",
      zjuType: "UNDERGRADUATE · ZJU",
      zjuTitle: "Zhejiang University",
      zjuBody:
        "Graduated in Information Management & Information Systems (average score 85), building a foundation across technology, data, and management; awarded the 2022–2023 ZJU Academic Excellence honor.",
      cuhkType: "MASTER'S · CUHK",
      cuhkTitle: "The Chinese University of Hong Kong",
      cuhkBody:
        "Currently pursuing an MSc in Business Analytics and exploring how analytics can be applied to real-world business contexts.",
      focusType: "AREA OF FOCUS",
      focusTitle: "An interdisciplinary lens",
      focusBody:
        "Connecting an information systems background with business analytics to turn data into insight and complex questions into clear, actionable answers.",
    },
    contact: { lineOne: "Let's connect and", lineTwo: "explore new ideas." },
    footer: { backToTop: "Back to top ↑" },
  },
};

const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");
const navigationLinks = document.querySelectorAll(".site-nav a");
const languageButtons = document.querySelectorAll("[data-lang]");
const showcaseTabs = [...document.querySelectorAll("[data-showcase-tab]")];
const showcasePanels = document.querySelectorAll("[data-showcase-panel]");
const description = document.querySelector('meta[name="description"]');
const year = document.querySelector("#current-year");

let currentLanguage = getInitialLanguage();
year.textContent = new Date().getFullYear();

function getTranslation(language, path) {
  return path.split(".").reduce((value, key) => value?.[key], translations[language]);
}

function getInitialLanguage() {
  try {
    const savedLanguage = localStorage.getItem("actor-language");
    if (savedLanguage === "zh" || savedLanguage === "en") return savedLanguage;
  } catch {
    // The page still works when browser storage is unavailable.
  }

  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  const pageKind = document.body.dataset.page;
  document.title =
    pageKind === "research"
      ? translations[language].researchPageTitle
      : pageKind === "project"
        ? translations[language].projectPageTitle
        : translations[language].pageTitle;
  description.setAttribute(
    "content",
    pageKind === "research"
      ? translations[language].researchPageDescription
      : pageKind === "project"
        ? translations[language].projectPageDescription
        : translations[language].pageDescription,
  );

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = getTranslation(language, element.dataset.i18n);
    if (value) element.textContent = value;
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const value = getTranslation(language, element.dataset.i18nAriaLabel);
    if (value) element.setAttribute("aria-label", value);
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  try {
    localStorage.setItem("actor-language", language);
  } catch {
    // No persistence is required for the language switcher to function.
  }

  document.dispatchEvent(
    new CustomEvent("actor-language-changed", { detail: { language } }),
  );
}

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", translations[currentLanguage].accessibility.menuOpen);
  navigation.classList.remove("is-open");
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen
      ? translations[currentLanguage].accessibility.menuOpen
      : translations[currentLanguage].accessibility.menuClose,
  );
  navigation.classList.toggle("is-open", !isOpen);
});

navigationLinks.forEach((link) => link.addEventListener("click", closeMenu));

function activateShowcasePanel(panelName) {
  showcaseTabs.forEach((tab) => {
    const isActive = tab.dataset.showcaseTab === panelName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  showcasePanels.forEach((panel) => {
    const isActive = panel.dataset.showcasePanel === panelName;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

showcaseTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateShowcasePanel(tab.dataset.showcaseTab));
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + offset + showcaseTabs.length) % showcaseTabs.length;
    showcaseTabs[nextIndex].focus();
    activateShowcasePanel(showcaseTabs[nextIndex].dataset.showcaseTab);
  });
});

/* Stagger sibling reveals inside each section for an orchestrated entrance. */
const revealGroups = new Map();
document.querySelectorAll(".reveal").forEach((element) => {
  const group = element.closest("main > section") || element.parentElement || document.body;
  const index = revealGroups.get(group) || 0;
  revealGroups.set(group, index + 1);
  element.style.setProperty("--reveal-delay", `${Math.min(index * 90, 450)}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const scrollProgress = document.querySelector(".scroll-progress i");
const pageSections = document.querySelectorAll("main > section[id]");

function updateScrollProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => {
        link.classList.toggle("is-current", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55%", threshold: 0 },
);

pageSections.forEach((section) => sectionObserver.observe(section));
window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener(
    "pointermove",
    (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    },
    { passive: true },
  );
}

function revealAndJumpToHash() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;

  target.classList.add("is-visible");
  target.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
  document.documentElement.style.scrollBehavior = "auto";
  target.scrollIntoView({ block: "start" });
  requestAnimationFrame(() => document.documentElement.style.removeProperty("scroll-behavior"));
}

window.addEventListener("hashchange", revealAndJumpToHash);
requestAnimationFrame(revealAndJumpToHash);

setLanguage(currentLanguage);

/* ---------- Polished chrome & page transitions ---------- */

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const rootElement = document.documentElement;

/* Page-enter: release the pre-paint veil after the first hidden frame,
   so the fade/rise transition actually plays. */
requestAnimationFrame(() => {
  requestAnimationFrame(() => rootElement.classList.remove("page-pre"));
});

/* Header condenses once the page is scrolled. */
const siteHeader = document.querySelector(".site-header");
if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 14);
  };
  window.addEventListener("scroll", updateHeaderState, { passive: true });
  updateHeaderState();
}

/* Page-leave: fade out before following an internal page link. */
if (!motionQuery.matches) {
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    if (/^(mailto|tel|javascript):/i.test(href)) return;

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.hash) return;

    event.preventDefault();
    rootElement.classList.add("page-leave");
    window.setTimeout(() => {
      window.location.href = url.href;
    }, 300);
  });

  /* Back/forward cache restores must not keep the leave veil. */
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) rootElement.classList.remove("page-leave");
  });
} else {
  rootElement.classList.remove("page-leave");
}

/* ---------- Hero 3D scene: pointer parallax tilt ---------- */

const heroScene = document.querySelector(".scene");
if (heroScene && window.matchMedia("(pointer: fine)").matches && !motionQuery.matches) {
  const sceneInner = heroScene.querySelector(".scene-inner");
  heroScene.addEventListener(
    "pointermove",
    (event) => {
      const rect = heroScene.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      sceneInner.style.transform = `rotateY(${(px * 12).toFixed(2)}deg) rotateX(${(-py * 10).toFixed(2)}deg)`;
    },
    { passive: true },
  );
  heroScene.addEventListener("pointerleave", () => {
    sceneInner.style.transform = "";
  });
}
