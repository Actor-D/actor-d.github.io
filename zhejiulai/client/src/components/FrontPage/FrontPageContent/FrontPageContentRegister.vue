<template>
  <transition name="fade">
    <div class="registration-container">
      <div class="registration-header">
        <h1>注册账号</h1>
        <div class="progress-bar">
          <transition-group name="step" tag="div" class="progress-steps">
            <div class="progress-step active" key="1">
              <div class="step-icon">1</div>
              <div class="step-label">学籍验证</div>
            </div>
            <div class="progress-line" key="line1"></div>
            <div class="progress-step" key="2">
              <div class="step-icon">2</div>
              <div class="step-label">手机绑定</div>
            </div>
            <div class="progress-line" key="line2"></div>
            <div class="progress-step" key="3">
              <div class="step-icon">3</div>
              <div class="step-label">设置密码</div>
            </div>
          </transition-group>
        </div>
      </div>

      <transition name="slide-fade">
        <div class="identity-section">
          <h3>身份选择</h3>
          <div class="identity-options">
            <div
              class="identity-option"
              :class="{active: activeIdentity === 'student'}"
              @click="activeIdentity = 'student'"
            >
              <div class="identity-icon">
                <i class="icon-student">🎓</i>
              </div>
              <div class="identity-label">学生</div>
            </div>
            <div
              class="identity-option"
              :class="{active: activeIdentity === 'staff'}"
              @click="activeIdentity = 'staff'"
            >
              <div class="identity-icon">
                <i class="icon-staff">👨‍🏫</i>
              </div>
              <div class="identity-label">教职工</div>
            </div>
            <div
              class="identity-option"
              :class="{active: activeIdentity === 'merchant'}"
              @click="activeIdentity = 'merchant'"
            >
              <div class="identity-icon">
                <i class="icon-merchant">🏪</i>
              </div>
              <div class="identity-label">校内商户</div>
            </div>
          </div>
        </div>
      </transition>

      <div class="divider"></div>

      <transition name="slide-fade">
        <div class="university-section">
          <h3>浙江大学</h3>
          <div class="input-group">
            <input type="text" placeholder="请输入10位学号" v-model="student_id" @focus="onInputFocus" @blur="onInputBlur">
          </div>
          <div class="input-group">
            <input type="text" placeholder="请输入您的个性昵称" v-model="name" @focus="onInputFocus" @blur="onInputBlur">
          </div>
          <div class="input-group">
            <select v-model="campus" @focus="onInputFocus" @blur="onInputBlur" class="campus-input">
              <option value="">请选择校区</option>
              <option value="浙江大学紫金港校区">浙江大学紫金港校区</option>
              <option value="浙江大学玉泉校区">浙江大学玉泉校区</option>
              <option value="浙江大学西溪校区">浙江大学西溪校区</option>
              <option value="浙江大学华家池校区">浙江大学华家池校区</option>
              <option value="浙江大学之江校区">浙江大学之江校区</option>
              <option value="浙江大学海宁国际校区">浙江大学海宁国际校区</option>
            </select>
          </div>
        </div>
      </transition>

      <div class="divider"></div>

      <transition name="slide-fade">
        <div class="auth-section">
          <h3>认证方式</h3>
          <div class="auth-methods">
            <div
              class="auth-method"
              :class="{active: authMethod === 'sso'}"
              @click="authMethod = 'sso'"
            >
              <div class="method-header">
                <input type="radio" name="authMethod" :checked="authMethod === 'sso'">
                <label>统一身份认证（推荐）</label>
              </div>
              <div class="method-detail">跳转学校SSO登录验证</div>
            </div>

            <div
              class="auth-method"
              :class="{active: authMethod === 'email'}"
              @click="authMethod = 'email'"
            >
              <div class="method-header">
                <input type="radio" name="authMethod" :checked="authMethod === 'email'">
                <label>邮箱验证</label>
              </div>
              <div class="method-detail">发送验证码至邮箱@zju.edu.cn</div>
            </div>
          </div>
        </div>
      </transition>

      <div class="auth-phone-divider"></div>

      <transition name="slide-fade">
        <div class="phone-verification-section">
          <h3>手机验证</h3>
          <div class="phone-input">
            <select class="phone-prefix">
              <option>+86</option>
            </select>
            <input type="text" placeholder="请输入手机号" v-model="phone" @focus="onInputFocus" @blur="onInputBlur">
          </div>
          <div class="input-group with-button">
            <input type="text" placeholder="请输入验证码" @focus="onInputFocus" @blur="onInputBlur">
            <button class="get-code-btn" @click="getVerificationCode">
              <span v-if="!isCounting">{{ countdownText }}</span>
              <span v-else class="counting">{{ countdown }}秒后重新获取</span>
            </button>
          </div>
          <div class="verification-note">仅用于配送联系，不会公开</div>
        </div>
      </transition>

      <div class="divider"></div>

      <transition name="slide-fade">
        <div class="password-section">
          <h3>设置密码</h3>
          <div class="input-group">
            <input
              type="password"
              placeholder="请设置密码（至少8位，包含字母和数字）"
              v-model="password"
              @focus="onInputFocus"
              @blur="onInputBlur"
              @input="checkPasswordStrength"
            >
            <div class="password-strength" v-if="password.length > 0">
              <span :class="{'weak': passwordStrength === 'weak'}">弱</span>
              <span :class="{'medium': passwordStrength === 'medium'}">中</span>
              <span :class="{'strong': passwordStrength === 'strong'}">强</span>
            </div>
          </div>
          <div class="input-group">
            <input type="password" placeholder="请确认密码" v-model="confirmPassword" @focus="onInputFocus" @blur="onInputBlur">
          </div>
        </div>
      </transition>
      <transition name="fade">
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      </transition>
      <div class="divider"></div>

      <transition name="slide-fade">
        <div class="service-section">
          <div class="checkbox-group">
            <input type="checkbox" id="agreement" v-model="agreementChecked">
            <label for="agreement">
              我已阅读并同意
              <a href="#" class="policy-link">《用户协议[](@replace=10001)[](@replace=10001)》</a>
              及
              <a href="#" class="policy-link">《隐私政策[](@replace=10002)[](@replace=10002)》</a>
            </label>
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="device-notification" v-model="notificationChecked">
            <label for="device-notification">接收设备通知</label>
          </div>
        </div>
      </transition>

      <div class="register-button">
        <button
          class="submit-btn"
          :class="{'pulse': agreementChecked}"
          @click="submitRegistration"
          :disabled="isLoading">
          {{ isLoading ? '注册中...' : '立即注册' }}
        </button>
      </div>

      <div class="login-prompt">
        <span>已有帐号？</span>
        <router-link to="/" class="login-link">去登录</router-link>
      </div>

      <div class="contact-info">
        查询问题：联系方式：8888-xxxxx
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'FrontPageContentRegister',
  data() {
    return {
      authMethod: 'sso',
      activeIdentity: 'student',
      isCounting: false,
      countdown: 60,
      countdownText: '获取验证码',
      agreementChecked: false,
      notificationChecked: false,
      student_id: '',
      name: '',
      campus: '',
      phone: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
      isLoading: false,
      passwordStrength: '',
      showAgreementError: false
    }
  },
  methods: {
    async submitRegistration() {
      // 重置错误状态
      this.errorMessage = '';
      this.showAgreementError = false;

      // 前端验证
      if (!this.student_id) {
        this.errorMessage = '请输入学号';
        return;
      }

      if (!this.name) {
        this.errorMessage = '请输入昵称';
        return;
      }

      if (!this.campus) {
        this.errorMessage = '请选择校区';
        return;
      }

      if (!this.phone) {
        this.errorMessage = '请输入手机号';
        return;
      }

      if (!this.password) {
        this.errorMessage = '请设置密码';
        return;
      }

      if (!this.confirmPassword) {
        this.errorMessage = '请确认密码';
        return;
      }

      if (!this.agreementChecked) {
        this.showAgreementError = true;
        this.errorMessage = '请先同意用户协议和隐私政策';
        return;
      }

      // 验证学号格式
      if (!/^\d{10}$/.test(this.student_id)) {
        this.errorMessage = '学号必须是10位数字';
        return;
      }

      // 验证手机号格式
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        this.errorMessage = '请输入有效的手机号';
        return;
      }

      // 验证密码长度和复杂度
      if (this.password.length < 8) {
        this.errorMessage = '密码长度至少为8位';
        return;
      }

      if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(this.password)) {
        this.errorMessage = '密码必须包含字母和数字';
        return;
      }

      // 验证密码一致性
      if (this.password !== this.confirmPassword) {
        this.errorMessage = '两次输入的密码不一致';
        return;
      }

      this.isLoading = true;

      try {
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_id: this.student_id,
            name: this.name,
            campus: this.campus,
            phone: this.phone,
            password: this.password,
            identity: this.activeIdentity
          })
        });

        const data = await response.json();

        if (data.success) {
          alert('注册成功！');
          // 注册成功后跳转到登录页面
          this.$router.push('/');
        } else {
          this.errorMessage = data.message || '注册失败';
        }
      } catch (error) {
        this.errorMessage = '网络错误，请稍后再试';
      } finally {
        this.isLoading = false;
      }
    },

    checkPasswordStrength() {
      if (this.password.length === 0) {
        this.passwordStrength = '';
        return;
      }

      if (this.password.length < 8) {
        this.passwordStrength = 'weak';
        return;
      }

      // 包含字母和数字
      const hasLetter = /[a-zA-Z]/.test(this.password);
      const hasNumber = /\d/.test(this.password);
      const hasSpecialChar = /[^a-zA-Z0-9]/.test(this.password);

      if (hasLetter && hasNumber && hasSpecialChar && this.password.length >= 12) {
        this.passwordStrength = 'strong';
      } else if ((hasLetter && hasNumber) || (hasLetter && hasSpecialChar) || (hasNumber && hasSpecialChar)) {
        this.passwordStrength = 'medium';
      } else {
        this.passwordStrength = 'weak';
      }
    },

    getVerificationCode() {
      if (this.isCounting) return;

      this.isCounting = true;
      this.countdown = 60;
      this.countdownText = '获取验证码';

      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(timer);
          this.isCounting = false;
        }
      }, 1000);
    },
    onInputFocus(e) {
      e.target.parentNode.classList.add('focused');
    },
    onInputBlur(e) {
      e.target.parentNode.classList.remove('focused');
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=PingFang+SC:wght@400;500;600&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'PingFang SC', sans-serif;
}

/* 页面进入动画 */

/* 进度条动画 */
.error-message {
  color: #ff4d4f;
  text-align: center;
  margin: 15px 0;
  animation: shake 0.5s;
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

/* 部分滑动淡入动画 */

.registration-container {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1),
  0 10px 30px rgba(24, 144, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.registration-header h1 {
  font-size: 18pt;
  font-weight: 600;
  margin-bottom: 20px;
  color: #000;
  text-align: center;
  position: relative;
}

.registration-header h1::after {
  content: "";
  display: block;
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, #1890FF, #40a9ff);
  margin: 10px auto;
  border-radius: 3px;
  animation: widthGrow 1.5s ease-out;
}

@keyframes widthGrow {
  from {
    width: 0;
  }
  to {
    width: 50px;
  }
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  width: 100%;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.progress-step.active .step-icon {
  background-color: #1890FF;
  color: white;
  box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(24, 144, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0);
  }
}

.progress-step.active .step-label {
  color: #1890FF;
  font-weight: 600;
}

.step-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12pt;
  margin-bottom: 5px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.step-label {
  font-size: 12pt;
  color: #8C8C8C;
  transition: all 0.3s ease;
}

.progress-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right, #1890FF, #d9d9d9);
  margin: 0 10px;
  position: relative;
  overflow: hidden;
}

.progress-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(to right, #1890FF, #40a9ff);
  animation: loading 2s linear infinite;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.identity-section {
  margin-bottom: 20px;
  padding: 0 15px;
}

.identity-section h3 {
  font-size: 14pt;
  font-weight: 500;
  margin-bottom: 15px;
  color: #000;
  text-align: center;
}

.identity-options {
  display: flex;
  justify-content: space-around;
  gap: 30px;
}

.identity-option {
  flex: 1;
  max-width: 150px;
  padding: 15px 10px;
  border-radius: 8px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid transparent;
}

.identity-option.active {
  background-color: #e6f7ff;
  border-color: #1890FF;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
}

.identity-option:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.identity-icon {
  font-size: 24px;
  margin-bottom: 8px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.identity-icon:hover {
  animation: bounce 0.5s;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.identity-label {
  font-size: 14pt;
  font-weight: 500;
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e8e8e8, transparent);
  margin: 20px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, transparent, #1890FF, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.registration-container:hover .divider::before {
  opacity: 1;
}

.auth-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.auth-method {
  padding: 15px;
  border-radius: 8px;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s ease;
}

.auth-method.active {
  background-color: #e6f7ff;
  border: 1px solid #1890FF;
  transform: scale(1.02);
  animation: highlight 1.5s ease-out;
}

@keyframes highlight {
  0% {
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(24, 144, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0);
  }
}

.method-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.method-header input[type="radio"] {
  margin-right: 10px;
  width: 16px;
  height: 16px;
  appearance: none;
  border: 2px solid #d9d9d9;
  border-radius: 50%;
  outline: none;
  transition: all 0.2s ease;
}

.method-header input[type="radio"]:checked {
  border-color: #1890FF;
  background-color: #1890FF;
  box-shadow: inset 0 0 0 3px white;
}

.method-detail {
  font-size: 12pt;
  color: #595959;
  padding-left: 26px;
}

.phone-input {
  display: flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.phone-input:focus-within {
  border-color: #1890FF;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.phone-prefix {
  padding: 12px;
  border: none;
  border-right: 1px solid #d9d9d9;
  background-color: #f5f5f5;
  outline: none;
}

.phone-input input {
  flex: 1;
  padding: 12px 15px;
  border: none;
  outline: none;
  font-size: 14pt;
}

.input-group {
  margin-bottom: 15px;
  position: relative;
}

@keyframes inputFocus {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

.input-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14pt;
  outline: none;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: #1890FF;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.get-code-btn {
  position: relative;
  padding: 12px 15px;
  background-color: #1890FF;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 12pt;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.get-code-btn:hover {
  background-color: #40a9ff;
  transform: translateY(-2px);
}

.get-code-btn:active {
  transform: translateY(0);
}

.get-code-btn::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%, -50%);
  transform-origin: 50% 50%;
}

.get-code-btn:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

.get-code-btn .counting {
  display: inline-block;
  animation: pulseText 1s infinite;
}

@keyframes pulseText {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  100% {
    transform: scale(20, 20);
    opacity: 0;
  }
}

.input-group.with-button {
  display: flex;
  align-items: center;
}

.input-group.with-button input {
  flex: 1;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}

.input-group.with-button .get-code-btn {
  position: static;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.verification-note {
  font-size: 12pt;
  color: #8C8C8C;
  margin-top: -10px;
  margin-bottom: 15px;
  text-align: center;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.checkbox-group input {
  margin-right: 10px;
  width: 16px;
  height: 16px;
  appearance: none;
  border: 2px solid #d9d9d9;
  border-radius: 4px;
  outline: none;
  transition: all 0.2s ease;
}

.checkbox-group input:checked {
  background-color: #1890FF;
  border-color: #1890FF;
  position: relative;
}

.checkbox-group input:checked::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 12px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.checkbox-group label {
  font-size: 14pt;
}

.policy-link {
  color: #1890FF;
  text-decoration: underline;
  transition: all 0.2s ease;
  position: relative;
}

.policy-link:hover {
  color: #096dd9;
}

.policy-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #096dd9;
  transition: width 0.3s ease;
}

.policy-link:hover::after {
  width: 100%;
}

.register-button {
  text-align: center;
  margin: 25px 0;
}

.submit-btn {
  background-color: #1890FF;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 50px;
  font-size: 16pt;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover {
  background-color: #40a9ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(24, 144, 255, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn.pulse {
  animation: pulse 2s infinite;
}

.login-prompt {
  text-align: center;
  margin-bottom: 15px;
  font-size: 14pt;
}

.login-link {
  color: #1890FF;
  text-decoration: underline;
  transition: all 0.2s ease;
}

.login-link:hover {
  color: #096dd9;
}

.contact-info {
  text-align: center;
  font-size: 14pt;
  color: #8C8C8C;
  animation: fadeIn 2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.auth-phone-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e8e8e8, transparent);
  margin: 30px 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.campus-input{
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #d9d9d9;
    border-radius: 8px;
    font-size: 14pt;
    outline: none;
    transition: all 0.3s ease;
}
.password-strength {
  display: flex;
  margin-top: 5px;
  font-size: 12px;
  color: #999;
}

.password-strength span {
  margin-right: 10px;
  padding: 2px 5px;
  border-radius: 3px;
}

.password-strength .weak {
  color: #ff4d4f;
  background-color: #fff2f0;
}

.password-strength .medium {
  color: #faad14;
  background-color: #fffbe6;
}

.password-strength .strong {
  color: #52c41a;
  background-color: #f6ffed;
}

/* 添加复选框错误提示样式 */
.checkbox-error {
  color: #ff4d4f;
  font-size: 12px;
  margin-left: 10px;
}
</style>