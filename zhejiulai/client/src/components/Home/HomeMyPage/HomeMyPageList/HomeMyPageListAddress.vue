<template>
  <div class="page-container">
    <div class="header">
      <router-link to="/Home/MyPage" class="nav-back">
        <svg class="back-icon" viewBox="0 0 24 24" width="24" height="24">
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" fill="white"/>
        </svg>
      </router-link>
      <h1>🏠 管理地址</h1>
      <div class="nav-placeholder"></div>
    </div>

    <div class="container">
      <div class="add-form" v-if="showAddForm">
        <div class="add-form-title">添加新地址</div>
        <div class="form-group">
          <label class="form-label">地址类型</label>
          <select class="form-input" v-model="newAddress.icon">
            <option value="📍">外卖架</option>
            <option value="🏢">快递柜</option>
            <option value="🏠">宿舍</option>
            <option value="🏫">教学楼</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">地址名称</label>
          <input
            type="text"
            class="form-input"
            v-model="newAddress.title"
            placeholder="例如: 紫云1舍南门外卖架"
          >
        </div>
        <div class="form-group">
          <label class="form-label">详细位置</label>
          <input
            type="text"
            class="form-input"
            v-model="newAddress.detail"
            placeholder="例如: 左数第3格"
          >
        </div>
        <div class="form-actions">
          <button class="form-btn cancel-btn" @click="showAddForm = false">取消</button>
          <button class="form-btn save-btn" @click="saveNewAddress">保存</button>
        </div>
      </div>

      <div class="edit-form" v-if="editingAddressId">
        <div class="add-form-title">编辑地址</div>
        <div class="form-group">
          <label class="form-label">地址类型</label>
          <select class="form-input" v-model="editForm.icon">
            <option value="📍">外卖架</option>
            <option value="🏢">快递柜</option>
            <option value="🏠">宿舍</option>
            <option value="🏫">教学楼</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">地址名称</label>
          <input
            type="text"
            class="form-input"
            v-model="editForm.title"
            placeholder="例如: 紫云1舍南门外卖架"
          >
        </div>
        <div class="form-group">
          <label class="form-label">详细位置</label>
          <input
            type="text"
            class="form-input"
            v-model="editForm.detail"
            placeholder="例如: 左数第3格"
          >
        </div>
        <div class="form-actions">
          <button class="form-btn cancel-btn" @click="cancelEdit">取消</button>
          <button class="form-btn save-btn" @click="saveEditedAddress">保存</button>
        </div>
      </div>

      <div class="address-card default-card" v-if="defaultAddress">
        <div class="default-badge">默认</div>
        <div class="address-header">
          <div class="address-icon">{{ defaultAddress.icon }}</div>
          <div class="address-title default-title">{{ defaultAddress.title }}</div>
        </div>
        <div class="address-detail">📌 详细：{{ defaultAddress.detail }}</div>
        <div class="address-time">⏰ 最近使用：{{ defaultAddress.time }}</div>
        <div class="address-actions">
          <a class="action-btn edit-btn" @click="startEdit(defaultAddress)">编辑</a>
          <a class="action-btn cancel-default-btn" @click="cancelDefault(defaultAddress.id)">取消默认</a>
        </div>
      </div>

      <div class="address-card" v-for="address in otherAddresses" :key="address.id">
        <div class="address-header">
          <div class="address-icon">{{ address.icon }}</div>
          <div class="address-title">{{ address.title }}</div>
        </div>
        <div class="address-detail">📌 详细：{{ address.detail }}</div>
        <div class="address-time">⏰ 最近使用：{{ address.time }}</div>
        <div class="address-actions">
          <a class="action-btn edit-btn" @click="startEdit(address)">编辑</a>
          <a class="action-btn set-default-btn" @click="setAsDefault(address.id)">设为默认</a>
          <a class="action-btn delete-btn" @click="openConfirmModal('删除地址', '确定要删除此地址吗？', 'delete', address.id)">删除</a>
        </div>
      </div>

      <div class="empty-state" v-if="isEmpty && !showAddForm">
        <div class="empty-icon">🛵</div>
        <div class="empty-text">暂无保存的地址</div>
        <button class="add-btn" @click="openAddForm">
          <span class="btn-icon">＋</span>
          添加第一个地址
        </button>
      </div>
    </div>

    <div class="add-btn-container" v-if="!isEmpty && !showAddForm">
      <button class="add-btn" @click="openAddForm">
        <span class="btn-icon">＋</span>
        添加地址
      </button>
    </div>

    <div class="modal" v-if="showConfirmModal" @click.self="showConfirmModal = false">
      <div class="modal-content">
        <div class="modal-title">{{ modalConfig.title }}</div>
        <div>{{ modalConfig.message }}</div>
        <div class="modal-actions">
          <button class="modal-btn modal-cancel" @click="showConfirmModal = false">取消</button>
          <button class="modal-btn modal-confirm" @click="confirmAction">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const addresses = ref([]);
const showAddForm = ref(false);
const editingAddressId = ref(null);
const showConfirmModal = ref(false);
const modalConfig = ref({
  title: '',
  message: '',
  action: '',
  addressId: null
});

const newAddress = ref({ icon: "📍", title: "", detail: "" });
const editForm = ref({ icon: "📍", title: "", detail: "" });

const defaultAddress = computed(() => addresses.value.find(addr => addr.is_default));
const otherAddresses = computed(() => addresses.value.filter(addr => !addr.is_default));
const isEmpty = computed(() => addresses.value.length === 0);

const fetchAddresses = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get('http://127.0.0.1:5000/api/addresses', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    addresses.value = response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
  }
};

const saveNewAddress = async () => {
  if (!newAddress.value.title.trim()) return;

  try {
    const token = sessionStorage.getItem('token');
    await axios.post('http://127.0.0.1:5000/api/addresses', {
      icon: newAddress.value.icon,
      title: newAddress.value.title.trim(),
      detail: newAddress.value.detail.trim() || '未填写',
      is_default: addresses.value.length === 0
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    fetchAddresses();
    showAddForm.value = false;
  } catch (error) {
    console.error('Error saving new address:', error);
  }
};

const saveEditedAddress = async () => {
  const address = addresses.value.find(addr => addr.id === editingAddressId.value);
  if (!address || !editForm.value.title.trim()) return;

  try {
    const token = sessionStorage.getItem('token');
    await axios.put(`http://127.0.0.1:5000/api/addresses/${address.id}`, {
      icon: editForm.value.icon,
      title: editForm.value.title.trim(),
      detail: editForm.value.detail.trim() || '未填写'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    fetchAddresses();
    editingAddressId.value = null;
  } catch (error) {
    console.error('Error updating address:', error);
  }
};

const deleteAddress = async (addressId) => {
  try {
    const token = sessionStorage.getItem('token');
    await axios.delete(`http://127.0.0.1:5000/api/addresses/${addressId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    fetchAddresses();
  } catch (error) {
    console.error('Error deleting address:', error);
  }
};

const setAsDefault = async (addressId) => {
  try {
    const token = sessionStorage.getItem('token');
    await axios.post(`http://127.0.0.1:5000/api/addresses/${addressId}/default`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    fetchAddresses();
  } catch (error) {
    console.error('Error setting default address:', error);
  }
};

const cancelDefault = async (addressId) => {
  try {
    const token = sessionStorage.getItem('token');
    await axios.put(`http://127.0.0.1:5000/api/addresses/${addressId}`, {
      is_default: false
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    fetchAddresses();
  } catch (error) {
    console.error('Error canceling default address:', error);
  }
};

const startEdit = (address) => {
  editingAddressId.value = address.id;
  editForm.value = {
    icon: address.icon,
    title: address.title,
    detail: address.detail
  };
};

const cancelEdit = () => {
  editingAddressId.value = null;
};

const openConfirmModal = (title, message, action, addressId) => {
  modalConfig.value = { title, message, action, addressId };
  showConfirmModal.value = true;
};

const confirmAction = () => {
  const { action, addressId } = modalConfig.value;

  switch (action) {
    case 'setDefault':
      setAsDefault(addressId);
      break;
    case 'delete':
      deleteAddress(addressId);
      break;
  }

  showConfirmModal.value = false;
};

const openAddForm = () => {
  newAddress.value = { icon: "📍", title: "", detail: "" };
  showAddForm.value = true;
};

onMounted(fetchAddresses);
</script>



<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", sans-serif;
}

.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background-color: #1890FF;
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header h1 {
  font-size: 18px;
  flex: 1;
  text-align: center;
  margin: 0;
}

.nav-back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.back-icon {
  transition: transform 0.2s;
}

.nav-back:active .back-icon {
  transform: scale(0.9);
}

.nav-placeholder {
  width: 24px;
}

.container {
  width: 100%;
  padding: 16px;
  padding-bottom: 80px;
  flex: 1;
  overflow-y: auto;
}

.address-card {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.default-card {
  border: 1px solid #1890FF;
  position: relative;
}

.default-badge {
  position: absolute;
  top: -8px;
  left: 16px;
  background-color: #1890FF;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.address-icon {
  font-size: 20px;
  margin-right: 8px;
}

.address-title {
  font-weight: 500;
  font-size: 14pt;
}

.default-title {
  color: #1890FF;
}

.address-detail, .address-time {
  color: #8C8C8C;
  font-size: 13px;
  margin-left: 28px;
  margin-bottom: 8px;
}

.address-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.action-btn {
  color: #1890FF;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.delete-btn {
  color: #ff4d4f;
}

.add-form, .edit-form {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.add-form-title {
  font-size: 16px;
  margin-bottom: 12px;
  color: #1890FF;
}

.form-group {
  margin-bottom: 12px;
}

.form-label {
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
  color: #8C8C8C;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.form-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-size: 13px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f5f5f5;
}

.save-btn {
  background-color: #1890FF;
  color: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  color: #8C8C8C;
  margin-bottom: 16px;
}

.empty-text {
  color: #8C8C8C;
  font-size: 14pt;
  margin-bottom: 24px;
}

.add-btn {
  padding: 14px 24px;
  background-color: #1890FF;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14pt;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.add-btn-container {
  display: flex;
  justify-content: flex-end; /* 水平靠右 */
  align-items: flex-end;    /* 垂直靠底 */
  bottom: 20px;
  right: 20px;
}

.btn-icon {
  margin-right: 8px;
  font-size: 16px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  max-width: 400px;
}

.modal-title {
  font-size: 18px;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.modal-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.modal-cancel {
  background-color: #f5f5f5;
}

.modal-confirm {
  background-color: #1890FF;
  color: white;
}
</style>