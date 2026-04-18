import { useEffect, useState, useCallback } from 'react';
import {
  Table, Button, Input, Space, Tag, Popconfirm,
  Modal, Form, Select, InputNumber, message, Tooltip,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined,
  DeleteOutlined, BookOutlined, ReloadOutlined,
} from '@ant-design/icons';
import { coursesApi, departmentsApi } from '../api/services';

const { Option } = Select;

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [saving, setSaving] = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await coursesApi.getAll(search || undefined);
      setCourses(res.data);
    } catch {
      messageApi.error('Không thể tải danh sách môn học');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);
  useEffect(() => {
    departmentsApi.getAll().then((res) => setDepartments(res.data));
  }, []);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      department_id: record.department?.id || record.department_id,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await coursesApi.delete(id);
      messageApi.success('Đã xóa môn học');
      fetchCourses();
    } catch (e: any) {
      messageApi.error(e.response?.data?.message || 'Xóa thất bại');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      if (editing) {
        await coursesApi.update(editing.id, values);
        messageApi.success('Cập nhật thành công');
      } else {
        await coursesApi.create(values);
        messageApi.success('Thêm môn học thành công');
      }
      setModalOpen(false);
      fetchCourses();
    } catch (e: any) {
      if (e?.errorFields) return;
      messageApi.error(e.response?.data?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'Mã Môn',
      dataIndex: 'course_code',
      key: 'course_code',
      width: 120,
      render: (v: string) => (
        <span style={{ fontFamily: 'monospace', color: 'var(--secondary)', fontWeight: 600 }}>
          {v}
        </span>
      ),
    },
    {
      title: 'Tên Môn Học',
      dataIndex: 'course_name',
      key: 'course_name',
      render: (v: string) => (
        <Space>
          <BookOutlined style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontWeight: 500 }}>{v}</span>
        </Space>
      ),
    },
    {
      title: 'Số Tín Chỉ',
      dataIndex: 'credits',
      key: 'credits',
      width: 110,
      render: (v: number) => (
        <Tag color="purple">{v} tín chỉ</Tag>
      ),
    },
    {
      title: 'Khoa',
      key: 'department',
      width: 160,
      render: (_: any, r: any) =>
        r.department ? (
          <Tag color="gold">{r.department.dept_name}</Tag>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>—</span>
        ),
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (v: string) => v || <span style={{ color: 'var(--text-muted)' }}>—</span>,
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 100,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)}
              style={{ color: 'var(--primary-light)' }} />
          </Tooltip>
          <Popconfirm
            title="Xóa môn học?"
            description={`Bạn có chắc muốn xóa "${record.course_name}"?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" icon={<DeleteOutlined />} style={{ color: 'var(--danger)' }} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container fade-in">
      {contextHolder}
      <div className="page-header">
        <div>
          <h1 className="page-title">📚 Quản Lý Môn Học</h1>
          <p className="page-subtitle">
            Tổng cộng <strong style={{ color: 'var(--secondary)' }}>{courses.length}</strong> môn học
          </p>
        </div>
        <Button id="add-course-btn" type="primary" icon={<PlusOutlined />} onClick={openAdd} size="large">
          Thêm Môn Học
        </Button>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <Input
            id="course-search"
            prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
            placeholder="Tìm theo tên hoặc mã môn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 280 }}
            allowClear
          />
        </div>
        <Button icon={<ReloadOutlined />} onClick={fetchCourses}>Làm Mới</Button>
      </div>

      <div className="table-container">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={courses}
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (t) => `${t} môn học` }}
          scroll={{ x: 800 }}
        />
      </div>

      <Modal
        title={editing ? '✏️ Chỉnh Sửa Môn Học' : '➕ Thêm Môn Học'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Cập Nhật' : 'Thêm Mới'}
        cancelText="Hủy"
        confirmLoading={saving}
        width={540}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item name="course_code" label="Mã Môn" rules={[{ required: true }]}>
              <Input id="form-course-code" placeholder="VD: CNTT101" disabled={!!editing} />
            </Form.Item>
            <Form.Item name="credits" label="Số Tín Chỉ" rules={[{ required: true }]}>
              <InputNumber id="form-credits" min={1} max={10} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <Form.Item name="course_name" label="Tên Môn Học" rules={[{ required: true }]}>
            <Input id="form-course-name" placeholder="VD: Lập trình Web" />
          </Form.Item>
          <Form.Item name="department_id" label="Khoa">
            <Select id="form-dept" placeholder="Chọn khoa" allowClear>
              {departments.map((d: any) => (
                <Option key={d.id} value={d.id}>{d.dept_code} — {d.dept_name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Mô Tả">
            <Input.TextArea id="form-desc" rows={3} placeholder="Mô tả về môn học..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
