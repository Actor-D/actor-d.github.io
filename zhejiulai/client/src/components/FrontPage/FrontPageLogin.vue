<template>
  <div class="app">
    <div class="container">
      <div class="header">
        <div class="logo">
          <span class="logo-icon">🚀</span>
          <span class="logo-text">{{ $t("platformName") }} <span class="highlight">{{ $t("platformSubtitle") }}</span></span>
        </div>
        <div class="header-right">
          <span @mouseenter="showHelpTooltip = true" @mouseleave="showHelpTooltip = false" @click="toggleLanguage">{{ $t("switchLanguage") }}</span>
        </div>
      </div>

      <div class="login-content">
        <div class="welcome-section">
          <h2>{{ $t("welcomeBack") }}</h2>
          <p>{{ $t("loginDescription") }}</p>
          <div class="campus-image" @click="redirectToZJU">
            <img src="../../../../public/images/zju.jpg" alt="浙江大学校园风光">
          </div>
        </div>

        <div class="login-card">
          <div class="login-form">
            <div class="form-group">
              <label class="form-label">{{ $t("selectCampus") }}</label>
              <select
                class="form-input"
                v-model="selectedCampus"
                :class="{'input-error': campusError}"
              >
                <option value="" disabled>{{ $t("pleaseSelectCampus") }}</option>
                <option v-for="(campus, index) in translatedCampuses" :key="index" :value="campus.value">{{ campus.text }}</option>
              </select>
              <transition name="fade">
                <div class="error-message" v-if="campusError">{{ campusError }}</div>
              </transition>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t("studentNumber") }}</label>
              <input
                type="text"
                class="form-input"
                v-model="username"
                :placeholder="$t('pleaseEnterStudentNumber')"
                @focus="inputFocused('username')"
                @blur="inputBlurred"
                :class="{'input-error': usernameError}"
              >
              <transition name="fade">
                <div class="error-message" v-if="usernameError">{{ usernameError }}</div>
              </transition>
            </div>

            <div class="form-group">
              <label class="form-label">{{ $t("password") }}</label>
              <div class="password-input">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  v-model="password"
                  :placeholder="$t('pleaseEnterPassword')"
                  @focus="inputFocused('password')"
                  @blur="inputBlurred"
                  :class="{'input-error': passwordError || loginError}"
                >
                <span
                  class="eye-icon"
                  @click="togglePasswordVisibility"
                  :title="showPassword ? $t('hidePassword') : $t('showPassword')"
                >
                  {{ showPassword ? '👁️' : '🔒' }}
                </span>
              </div>
              <transition name="fade">
                <div>
                  <div class="error-message" v-if="passwordError">{{ passwordError }}</div>
                  <div class="error-message" v-if="loginError">{{ loginError }}</div>
                </div>
              </transition>
            </div>

            <div class="form-actions">
              <button
                class="login-btn"
                @click="handleLogin"
                :disabled="isLoggingIn"
              >
                <span v-if="!isLoggingIn">{{ $t("login") }}</span>
                <span v-else class="loading-spinner"></span>
              </button>

              <div class="quick-links">
                <router-link to="/FrontPage/ContentRegister" class="nav-link">{{ $t("registerAccount") }}</router-link>
                <span class="forgot-password" @click="showForgotPassword = true">{{ $t("forgotPassword") }}（无功能）</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="login-footer">
        <transition name="fade">
          <div>
            <div class="agreement-error" v-if="agreementError">{{ agreementError }}</div>
            <div class="agreement">
              <input type="checkbox" id="agree" v-model="agreed">
              <label for="agree">{{ $t("iAgree") }} <a href="javascript:void(0);" @click="downloadUserAgreement">{{ $t("userAgreement") }}</a> {{ $t("and") }} <a href="javascript:void(0);" @click="downloadPrivacyPolicy">{{ $t("privacyPolicy") }}</a></label>
            </div>
          </div>
        </transition>
        <div class="warning">
          <span>{{ $t("noAccountSharing") }}</span>
        </div>
      </div>

      <transition name="modal">
        <div class="modal-overlay" v-if="showForgotPassword" @click.self="showForgotPassword = false">
          <div class="modal-content">
            <h3>{{ $t("resetPassword") }}（无功能）</h3>
            <div class="form-group">
              <label class="form-label">{{ $t("studentNumber") }}</label>
              <input type="text" class="form-input" v-model="forgotUsername" :placeholder="$t('pleaseEnterStudentNumber')">
            </div>
            <div class="form-group">
              <label class="form-label">{{ $t("registeredPhone") }}</label>
              <input type="email" class="form-input" v-model="forgotPhone" :placeholder="$t('pleaseEnterRegisteredPhone')">
            </div>
            <transition name="fade">
    <div class="success-message" v-if="resetSuccess">{{ t("passwordResetLinkSent") }}</div>
  </transition>
            <button class="login-btn" @click="resetPassword">{{ $t("submit") }}</button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t, locale } = useI18n();
const router = useRouter();

// 响应式数据
const username = ref('');
const password = ref('');
const agreed = ref(false);
const selectedCampus = ref('');
const usernameError = ref('');
const passwordError = ref('');
const campusError = ref('');
const isLoggingIn = ref(false);
const showHelpTooltip = ref(false);
const showForgotPassword = ref(false);
const forgotUsername = ref('');
const forgotPhone = ref('');
const showPassword = ref(false);
const loginError = ref('');
const agreementError = ref('');
const lastSubmitTime = ref(0);
const resetSuccess = ref(false);
// 固定校区选项
const campusOptions = [
  '浙江大学紫金港校区',
  '浙江大学玉泉校区',
  '浙江大学西溪校区',
  '浙江大学华家池校区',
  '浙江大学之江校区',
  '浙江大学舟山校区',
  '浙江大学海宁国际校区'
];

// 计算属性
const translatedCampuses = computed(() => {
  return campusOptions.map((campus, index) => ({
    value: campus,
    text: t(`campus${index + 1}`)
  }));
});

// 方法
const redirectToZJU = () => {
  window.open('https://www.zju.edu.cn', '_blank');
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const inputFocused = (field) => {
  console.log(`${field} focused`);
};

const inputBlurred = () => {
  validateInputs();
};

const validateInputs = () => {
  let isValid = true;

  // 重置错误信息
  usernameError.value = '';
  passwordError.value = '';
  campusError.value = '';
  agreementError.value = '';

  // 验证校区选择
  if (!selectedCampus.value) {
    campusError.value = t("pleaseSelectCampus");
    isValid = false;
  }

  // 验证学号格式
  if (!username.value) {
    usernameError.value = t("pleaseEnterStudentNumber");
    isValid = false;
  } else if (username.value.length < 10) {
    usernameError.value = t("studentNumberMinLength");
    isValid = false;
  } else if (!/^\d+$/.test(username.value)) {
    usernameError.value = t("studentNumberMustBeDigits");
    isValid = false;
  }

  // 验证密码长度
  if (!password.value) {
    passwordError.value = t("pleaseEnterPassword");
    isValid = false;
  } else if (password.value.length < 8) {
    passwordError.value = t("passwordMinLength");
    isValid = false;
  }

  // 验证用户协议
  if (!agreed.value) {
    agreementError.value = t("pleaseAgreeTerms");
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  // 防止重复提交
  const now = Date.now();
  if (now - lastSubmitTime.value < 500) {
    return;
  }
  lastSubmitTime.value = now;

  // 重置错误信息
  usernameError.value = '';
  passwordError.value = '';
  campusError.value = '';
  loginError.value = '';
  agreementError.value = '';

  // 验证输入
  const inputsValid = validateInputs();
  if (!inputsValid) {
    return;
  }

  isLoggingIn.value = true;

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: username.value,
        password: password.value,
        campus: selectedCampus.value
      })
    });

    const data = await response.json();

    if (data.success) {
      // 登录成功
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      router.push('/home');
    } else {
      if (data.message.includes('校区')) {
        campusError.value = data.message;
      } else {
        loginError.value = data.message || t("invalidStudentNumberOrPassword");
      }
    }
  } catch (error) {
    loginError.value = t("networkError");
    console.error('登录错误:', error);
  } finally {
    isLoggingIn.value = false;
  }
};

const resetPassword = () => {
  console.log('找回密码:', {
    username: forgotUsername.value,
    Phone: forgotPhone.value
  });

  // 显示成功消息
  resetSuccess.value = true;

  // 3秒后隐藏消息和弹窗
  setTimeout(() => {
    resetSuccess.value = false;
    showForgotPassword.value = false;
  }, 3000);
};
const toggleLanguage = () => {
  locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN';
};

const downloadUserAgreement = () => {
  const link = document.createElement('a');
  link.href = '../../../../public/PDF/user.pdf';
  link.download = 'user_agreement.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadPrivacyPolicy = () => {
  const link = document.createElement('a');
  link.href = '../../../../public/PDF/public.pdf';
  link.download = 'privacy_policy.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif;
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ebee 100%);
  color: #333;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 新增：背景粒子效果 */
body::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="1" fill="%234080ff" opacity="0.1"/></svg>');
  z-index: -1;
  pointer-events: none;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  animation: fadeInDown 0.5s ease-out;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 28px;
  animation: pulse 2s infinite, float 3s ease-in-out infinite;
}

/* 新增：浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.highlight {
  color: #4080ff;
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #4080ff;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.highlight:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.header-right span {
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
  position: relative;
}

.header-right span:hover {
  color: #4080ff;
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.login-content {
  display: flex;
  gap: 40px;
  margin: 40px 0;
  flex: 1;
}

.welcome-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.welcome-section h2 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #333;
  position: relative;
  display: inline-block;
}

.welcome-section h2::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 50px;
  height: 3px;
  background: #4080ff;
  border-radius: 3px;
}

.welcome-section p {
  color: #666;
  margin-bottom: 30px;
}

.campus-image {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  position: relative;
}

/* 新增：图片遮罩效果 */
.campus-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(64, 128, 255, 0.1), rgba(64, 128, 255, 0.3));
  opacity: 0;
  transition: opacity 0.3s;
}

.campus-image:hover::after {
  opacity: 1;
}

.campus-image:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.campus-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.campus-image:hover img {
  transform: scale(1.05);
}

.login-card {
  width: 400px;
  background-color: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  align-self: center;
  transition: all 0.3s;
  transform: translateY(0);
  animation: fadeInUp 0.5s ease-out;
  position: relative;
  overflow: hidden;
}

/* 新增：卡片装饰元素 */
.login-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
      transparent,
      rgba(64, 128, 255, 0.1),
      transparent
  );
  animation: rotate 10s linear infinite;
  z-index: 0;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  position: relative;
}

.form-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-color: rgba(255, 255, 255, 0.8);
}

.form-input:focus {
  outline: none;
  border-color: #4080ff;
  box-shadow: 0 0 0 2px rgba(64, 128, 255, 0.2);
}

.input-error {
  border-color: #ff4d4f;
}

.input-error:focus {
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  position: absolute;
  bottom: -20px;
  animation: shake 0.5s;
  font-weight: bold;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-5px);
  }
  40%, 80% {
    transform: translateX(5px);
  }
}

.password-input {
  position: relative;
}

.eye-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  cursor: pointer;
  transition: all 0.3s;
}

.eye-icon:hover {
  color: #4080ff;
  transform: translateY(-50%) scale(1.2);
}

.login-btn {
  background-color: #4080ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  text-align: center;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

/* 新增：按钮光效 */
.login-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg,
  rgba(255, 255, 255, 0.3) 0%,
  rgba(255, 255, 255, 0) 50%,
  rgba(255, 255, 255, 0.3) 100%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
  z-index: -1;
}

.login-btn:hover::after {
  transform: translateX(100%);
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s;
}

.login-btn:hover {
  background-color: #3a77e8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(64, 128, 255, 0.3);
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:active {
  transform: translateY(0);
}

.login-btn:disabled {
  background-color: #a0c0ff;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

.form-actions {
  margin-top: 20px;
}

.quick-links {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.nav-link {
  color: #4080ff;
  text-decoration: none;
  font-size: 13px;
  transition: all 0.3s;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #4080ff;
  transition: width 0.3s;
}

.nav-link:hover::after {
  width: 100%;
}

.forgot-password {
  color: #666;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
  position: relative;
}

.forgot-password::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #666;
  transition: width 0.3s;
}

.forgot-password:hover {
  color: #4080ff;
}

.forgot-password:hover::after {
  background: #4080ff;
  width: 100%;
}

.login-footer {
  margin-top: auto;
  padding: 20px 0;
  text-align: center;
}

.agreement {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
}

.warning {
  color: #ff4d4f;
  font-size: 13px;
  animation: pulse 2s infinite;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform-origin: center;
  animation: modalIn 0.3s ease-out;
  position: relative;
  overflow: hidden;
}

/* 新增：模态框装饰 */
.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #4080ff, #3a77e8);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-content h3 {
  margin-bottom: 20px;
  text-align: center;
  color: #333;
  position: relative;
}

.modal-content h3::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: #4080ff;
  border-radius: 3px;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 新增：输入框标签动画 */
.form-label {
  transition: all 0.3s;
}

.form-input:focus + .form-label {
  color: #4080ff;
  transform: translateY(-2px);
}

/* 新增：下拉选择框样式增强 */
select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 1em;
  padding-right: 2em;
}

/* 新增：复选框样式增强 */
input[type="checkbox"] {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-right: 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
}

input[type="checkbox"]:checked {
  background-color: #4080ff;
  border-color: #4080ff;
}

input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.agreement-error {
  margin-bottom: 5px;
  padding: 1px;
  border-radius: 4px;
  text-align: center;
  color: #ff4d4f;
  font-size: 15px;
  margin-top: 4px;
  bottom: -20px;
  font-weight: bold;
  animation: shake 0.5s ease-in-out forwards, blink 1.5s infinite; /* 添加闪烁动画 */
}

/* 闪烁动画 */
@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>