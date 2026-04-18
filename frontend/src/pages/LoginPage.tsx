import { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';

const { Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await authApi.login(values);
      const { access_token, user } = res.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      messageApi.success(`Chào mừng, ${user.username}!`);
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Đăng nhập thất bại';
      messageApi.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {contextHolder}
      <div className="login-bg-glow top-right" />
      <div className="login-bg-glow bottom-left" />

      <div className="login-card fade-in">
        <div className="login-header">
          <div className="login-logo">🎓</div>
          <h1 className="login-title">Student Management</h1>
          <p className="login-subtitle">Đăng nhập vào hệ thống quản lý sinh viên</p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập username' }]}
          >
            <Input
              id="login-username"
              prefix={<UserOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="Nhập username..."
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password
              id="login-password"
              prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
              placeholder="Nhập mật khẩu..."
              iconRender={(visible) =>
                visible ? (
                  <EyeTwoTone twoToneColor="var(--primary)" />
                ) : (
                  <EyeInvisibleOutlined style={{ color: 'var(--text-muted)' }} />
                )
              }
            />
          </Form.Item>

          <Button
            id="login-submit"
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{ height: 44, fontSize: 15, marginTop: 8, fontWeight: 600 }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </Button>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            Demo: admin / 123456
          </Text>
        </div>
      </div>
    </div>
  );
}
