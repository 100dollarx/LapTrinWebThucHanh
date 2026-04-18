import { useEffect, useState, useCallback } from 'react';
import {
  Layout, Menu, Avatar, Dropdown, Badge, Button, Typography,
  Modal, Form, Input, message, Drawer,
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  ApartmentOutlined,
  ReadOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  LockOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { authApi } from '../api/auth';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MOBILE_BP = 768; // px

const menuItems = [
  { key: '/dashboard',   icon: <DashboardOutlined />,  label: 'Dashboard' },
  { key: '/students',    icon: <UserOutlined />,        label: 'Sinh Viên' },
  { key: '/courses',     icon: <BookOutlined />,        label: 'Môn Học' },
  { key: '/classes',     icon: <TeamOutlined />,        label: 'Lớp Học' },
  { key: '/departments', icon: <ApartmentOutlined />,   label: 'Khoa' },
  { key: '/enrollments', icon: <ReadOutlined />,        label: 'Đăng Ký Môn' },
  { key: '/grades',      icon: <BarChartOutlined />,    label: 'Bảng Điểm' },
];

const sidebarBg = '#1a0f05';

// ──────────────────────────────────────────
// Sidebar content — dùng lại cho cả desktop & drawer
// ──────────────────────────────────────────
function SidebarContent({
  collapsed,
  user,
  roleColor,
  onNavigate,
  selectedKey,
}: {
  collapsed: boolean;
  user: any;
  roleColor: Record<string, string>;
  onNavigate: (key: string) => void;
  selectedKey: string;
}) {
  return (
    // ← wrapper này bắt buộc để menu chiếm flex:1, đẩy user-info xuống đáy
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Logo — click để về Dashboard */}
      <div
        onClick={() => onNavigate('/dashboard')}
        style={{
          padding: collapsed ? '16px 8px' : '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 64,
          borderBottom: '1px solid rgba(255,178,44,0.2)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,178,44,0.07)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div
          style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #FFB22C, #854836)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
            boxShadow: '0 2px 8px rgba(255,178,44,0.4)',
          }}
        >
          🎓
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#FFB22C', lineHeight: 1.2 }}>
              EduManager
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,178,44,0.55)', fontWeight: 500 }}>
              Student Management
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => onNavigate(key)}
        style={{ paddingTop: 8, flex: 1, overflow: 'auto', background: 'transparent', border: 'none' }}
        theme="dark"
      />

      {/* User info at bottom */}
      {user && (
        <div
          style={{
            padding: collapsed ? '12px 8px' : '12px 16px',
            borderTop: '1px solid rgba(255,178,44,0.2)',
            background: 'rgba(255,178,44,0.06)',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <Avatar
              size={32}
              style={{ background: 'linear-gradient(135deg,#FFB22C,#854836)', fontSize: 13, flexShrink: 0, color: '#1a0f05', fontWeight: 700 }}
            >
              {user.username?.[0]?.toUpperCase()}
            </Avatar>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.username}
                </div>
                <div style={{ fontSize: 10, color: roleColor[user.role] || '#FFB22C', textTransform: 'capitalize', fontWeight: 500 }}>
                  {user.role}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>  // ← đóng wrapper flex
  );
}

// ──────────────────────────────────────────
// Main Layout
// ──────────────────────────────────────────
export default function MainLayout() {
  const [collapsed, setCollapsed]       = useState(false);
  const [isMobile, setIsMobile]         = useState(window.innerWidth < MOBILE_BP);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [saving, setSaving]             = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();
  const [user, setUser]             = useState<any>(null);
  const [form]                      = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // ── Detect resize ──
  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < MOBILE_BP;
      setIsMobile(mobile);
      if (!mobile) setDrawerOpen(false); // đóng drawer khi quay lại desktop
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const handleNavigate = useCallback((key: string) => {
    navigate(key);
    if (isMobile) setDrawerOpen(false); // đóng drawer sau khi chọn menu
  }, [navigate, isMobile]);

  const handleChangePassword = async () => {
    try {
      const values = await form.validateFields();
      if (values.newPassword !== values.confirmPassword) {
        messageApi.error('Mật khẩu xác nhận không khớp');
        return;
      }
      setSaving(true);
      await authApi.changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword });
      messageApi.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      setChangePwdOpen(false);
      form.resetFields();
      setTimeout(handleLogout, 1500);
    } catch (e: any) {
      if (e?.errorFields) return;
      messageApi.error(e.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const userMenuItems = [
    { key: 'info', icon: <UserOutlined />, label: user?.username || 'Profile', disabled: true },
    { type: 'divider' as const },
    {
      key: 'change-password',
      icon: <LockOutlined />,
      label: 'Đổi Mật Khẩu',
      onClick: () => { form.resetFields(); setChangePwdOpen(true); },
    },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng Xuất', danger: true, onClick: handleLogout },
  ];

  const roleColor: Record<string, string> = {
    admin:   '#FFB22C',
    teacher: '#854836',
    student: '#2e7d32',
  };

  // Chiều rộng sidebar dựa vào collapsed state (chỉ áp dụng desktop)
  const siderWidth    = 220;
  const siderCollapsedW = 80;
  const currentSiderW = collapsed ? siderCollapsedW : siderWidth;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {contextHolder}

      {/* ═══════════════════════════════
          DESKTOP SIDEBAR (>= 768px)
          ═══════════════════════════════ */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={siderWidth}
          collapsedWidth={siderCollapsedW}
          style={{
            position: 'fixed',
            left: 0, top: 0, bottom: 0,
            zIndex: 100,
            overflow: 'hidden',
            background: sidebarBg,
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.2s',
          }}
        >
          <SidebarContent
            collapsed={collapsed}
            user={user}
            roleColor={roleColor}
            onNavigate={handleNavigate}
            selectedKey={location.pathname}
          />
        </Sider>
      )}

      {/* ═══════════════════════════════
          MOBILE DRAWER (< 768px)
          ═══════════════════════════════ */}
      {isMobile && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          placement="left"
          width={240}
          styles={{
            body:   { padding: 0, background: sidebarBg, display: 'flex', flexDirection: 'column', height: '100%' },
            header: { display: 'none' },
            mask:   { background: 'rgba(26,15,5,0.6)' },
          }}
          closeIcon={null}
          style={{ padding: 0 }}
        >
          {/* Nút đóng trong drawer */}
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'absolute',
              top: 14, right: 14,
              background: 'rgba(255,178,44,0.12)',
              border: '1px solid rgba(255,178,44,0.3)',
              borderRadius: 6,
              color: '#FFB22C',
              cursor: 'pointer',
              padding: '4px 8px',
              fontSize: 14,
              zIndex: 10,
            }}
          >
            <CloseOutlined />
          </button>
          <SidebarContent
            collapsed={false}
            user={user}
            roleColor={roleColor}
            onNavigate={handleNavigate}
            selectedKey={location.pathname}
          />
        </Drawer>
      )}

      {/* ═══════════════════════════════
          MAIN CONTENT AREA
          ═══════════════════════════════ */}
      <Layout
        style={{
          marginLeft: isMobile ? 0 : currentSiderW,
          transition: 'margin-left 0.2s',
          minHeight: '100vh',
        }}
      >
        {/* ── Header ── */}
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 99,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
          }}
        >
          {/* Left: toggle button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              type="text"
              icon={
                isMobile
                  ? <MenuUnfoldOutlined />
                  : collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
              }
              onClick={() => isMobile ? setDrawerOpen(true) : setCollapsed(!collapsed)}
              style={{ fontSize: 20, color: 'var(--text-secondary)', width: 40, height: 40 }}
            />
            {/* Breadcrumb title trên mobile */}
            {isMobile && (
              <Text style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                {menuItems.find(m => m.key === location.pathname)?.label || 'EduManager'}
              </Text>
            )}
          </div>

          {/* Right: bell + user */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
            <Badge count={0} showZero={false}>
              <Button
                type="text"
                icon={<BellOutlined />}
                style={{ color: 'var(--text-secondary)', fontSize: 18, width: 36, height: 36 }}
              />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
              <div
                id="user-menu-trigger"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-elevated)',
                }}
              >
                <Avatar size={28} style={{ background: 'var(--primary)', fontSize: 12, color: '#1a0f05', fontWeight: 700 }}>
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                {/* Ẩn username text trên màn hình rất nhỏ */}
                {!isMobile && (
                  <Text style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500 }}>
                    {user?.username || 'User'}
                  </Text>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* ── Page Content ── */}
        <Content style={{ padding: 0, minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>

      {/* ═══════════════════════════════
          MODAL: Đổi Mật Khẩu
          ═══════════════════════════════ */}
      <Modal
        title="🔒 Đổi Mật Khẩu"
        open={changePwdOpen}
        onOk={handleChangePassword}
        onCancel={() => { setChangePwdOpen(false); form.resetFields(); }}
        okText="Xác Nhận Đổi"
        cancelText="Hủy"
        confirmLoading={saving}
        width="min(420px, 95vw)"
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="oldPassword" label="Mật Khẩu Hiện Tại" rules={[{ required: true, message: 'Nhập mật khẩu hiện tại' }]}>
            <Input.Password id="old-password-input" prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="Mật khẩu đang dùng" />
          </Form.Item>
          <Form.Item name="newPassword" label="Mật Khẩu Mới" rules={[{ required: true, message: 'Nhập mật khẩu mới' }, { min: 6, message: 'Tối thiểu 6 ký tự' }]}>
            <Input.Password id="new-password-input" prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="Tối thiểu 6 ký tự" />
          </Form.Item>
          <Form.Item name="confirmPassword" label="Xác Nhận Mật Khẩu Mới" rules={[{ required: true, message: 'Nhập lại mật khẩu mới' }]}>
            <Input.Password id="confirm-password-input" prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />} placeholder="Nhập lại mật khẩu mới" />
          </Form.Item>
          <div style={{ background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            ⚠️ Sau khi đổi mật khẩu thành công, hệ thống sẽ tự động đăng xuất.
          </div>
        </Form>
      </Modal>
    </Layout>
  );
}
