import { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Spin } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  ApartmentOutlined,
  ReadOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { studentsApi } from '../api/students';
import { departmentsApi, classesApi, coursesApi, enrollmentsApi, gradesApi } from '../api/services';

const { Title, Text } = Typography;

interface Stats {
  students: number;
  courses: number;
  classes: number;
  departments: number;
  enrollments: number;
  grades: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    students: 0, courses: 0, classes: 0,
    departments: 0, enrollments: 0, grades: 0,
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [s, c, cl, d, e, g] = await Promise.all([
          studentsApi.getAll({ limit: 1 }),
          coursesApi.getAll(),
          classesApi.getAll(),
          departmentsApi.getAll(),
          enrollmentsApi.getAll(),
          gradesApi.getAll(),
        ]);
        setStats({
          students: s.data.meta?.total || 0,
          courses: c.data.length || 0,
          classes: cl.data.length || 0,
          departments: d.data.length || 0,
          enrollments: e.data.length || 0,
          grades: g.data.length || 0,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Tổng Sinh Viên',
      value: stats.students,
      icon: <UserOutlined />,
      iconClass: 'stat-icon purple',
      color: '#F59E0B',
    },
    {
      title: 'Môn Học',
      value: stats.courses,
      icon: <BookOutlined />,
      iconClass: 'stat-icon cyan',
      color: '#854836',
    },
    {
      title: 'Lớp Học',
      value: stats.classes,
      icon: <TeamOutlined />,
      iconClass: 'stat-icon green',
      color: '#2e7d32',
    },
    {
      title: 'Khoa',
      value: stats.departments,
      icon: <ApartmentOutlined />,
      iconClass: 'stat-icon amber',
      color: '#FFB22C',
    },
    {
      title: 'Đăng Ký Môn',
      value: stats.enrollments,
      icon: <ReadOutlined />,
      iconClass: 'stat-icon blue',
      color: '#854836',
    },
    {
      title: 'Bản Ghi Điểm',
      value: stats.grades,
      icon: <TrophyOutlined />,
      iconClass: 'stat-icon red',
      color: '#c0392b',
    },
  ];

  return (
    <div className="page-container fade-in">
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <Title level={3} style={{ color: 'var(--text-primary)', margin: 0 }}>
          Xin chào, {user.username}! 👋
        </Title>
        <Text style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Chào mừng đến với hệ thống quản lý sinh viên EduManager
        </Text>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" />
        </div>
      ) : (
        <div className="stats-grid">
          {statCards.map((card, index) => (
            <div 
              key={card.title} 
              className="stat-card fade-in" 
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={card.iconClass}>{card.icon}</div>
              <div className="stat-info">
                <div className="stat-value" style={{ color: card.color }}>
                  {card.value.toLocaleString()}
                </div>
                <div className="stat-label">{card.title}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info cards */}
      <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
        <Col xs={24} md={12}>
          <Card title="📊 Thông Tin Hệ Thống">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Framework Backend', value: 'NestJS + TypeORM' },
                { label: 'Database', value: 'PostgreSQL' },
                { label: 'Framework Frontend', value: 'React + Vite + Ant Design' },
                { label: 'Authentication', value: 'JWT Bearer Token' },
                { label: 'API Docs', value: 'Swagger UI — /api-docs' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{label}</Text>
                  <Text style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, background: 'var(--bg-elevated)', padding: '2px 10px', borderRadius: 20 }}>
                    {value}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="🚀 Tính Năng Hệ Thống">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                '✅ Quản lý sinh viên: CRUD, tìm kiếm, phân trang',
                '✅ Quản lý môn học & khóa học',
                '✅ Quản lý lớp học và khoa',
                '✅ Đăng ký môn học cho sinh viên',
                '✅ Nhập và quản lý bảng điểm',
                '✅ Tự động tính điểm tổng & xếp loại (A+/A/B+...)',
                '✅ Phân quyền: Admin / Teacher / Student',
                '✅ Xác thực JWT bảo mật',
              ].map((item) => (
                <Text key={item} style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
                  {item}
                </Text>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
