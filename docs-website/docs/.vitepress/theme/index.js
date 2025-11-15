import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  setup() {
    onMounted(() => {
      // Add logout button after the page loads and auth is successful
      setTimeout(() => {
        if (sessionStorage.getItem('skyguyver_auth') === 'true') {
          const logoutBtn = document.createElement('button');
          logoutBtn.innerHTML = '🔓 Logout';
          logoutBtn.className = 'logout-btn';
          logoutBtn.onclick = () => {
            if (confirm('🔐 Logout from SkyGuyver Documentation?')) {
              sessionStorage.removeItem('skyguyver_auth');
              window.location.reload();
            }
          };
          document.body.appendChild(logoutBtn);
        }
      }, 1000);
    });
  }
}