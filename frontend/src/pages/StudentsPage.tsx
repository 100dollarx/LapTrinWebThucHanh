import { useEffect, useState, useCallback } from 'react';
import {
  Table, Button, Input, Space, Tag, Popconfirm,
  Modal, Form, Select, DatePicker, message, Tooltip,
} from 'antd';
import {
  PlusOutlined, SearchOutlined, EditOutlined,
  DeleteOutlined, UserOutlined, ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { studentsApi } from '../api/students';
import { classesApi } from '../api/services';

const { Option } = Select;

const genderLabel: Record<string, { color: string; text: string }> = {
  male: { color: 'blue', text: 'Nam' },
  female: { color: 'pink', text: 'Nữ' },
  other: { color: 'default', text: 'Khác' },
};

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState<number | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [saving, setSaving] = useState(false);

  const PAGE_SIZE = 10;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await studentsApi.getAll({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        class_id: classFilter,
      });
      setStudents(res.data.data);
      setTotal(res.data.meta.total);
    } catch {
      messageApi.error('Không thể tải danh sách sinh viên');
    } finally {
      setLoading(false);
    }
  }, [page, search, classFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    classesApi.getAll().then((res) => setClasses(res.data));
  }, []);

  const openAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: any) => {
    setEditingStudent(record);
    form.setFieldsValue({
      ...record,
      date_of_birth: record.date_of_birth ? dayjs(record.date_of_birth) : null,
      class_id: record.class?.id || record.class_id,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await studentsApi.delete(id);
      messageApi.success('Đã xóa sinh viên');
      fetchStudents();
    } catch (e: any) {
      messageApi.error(e.response?.data?.message || 'Xóa thất bại');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const payload = {
        ...values,
        date_of_birth: values.date_of_birth
          ? values.date_of_birth.format('YYYY-MM-DD')
          : undefined,
      };
      if (editingStudent) {
        await studentsApi.update(editingStudent.id, payload);
        messageApi.success('Cập nhật thành công');
      } else {
        await studentsApi.create(payload);
        messageApi.success('Thêm sinh viên thành công');
      }
      setModalOpen(false);
      fetchStudents();
    } catch (e: any) {
      if (e?.errorFields) return; // validation errors
      messageApi.error(e.response?.data?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'MSSV',
      dataIndex: 'student_code',
      key: 'student_code',
      width: 120,
      render: (v: string) => (
        <span style={{ fontFamily: 'monospace', color: 'var(--primary-light)', fontWeight: 600 }}>
          {v}
        </span>
      ),
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (v: string) => (
        <Space>
          <UserOutlined style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontWeight: 500 }}>{v}</span>
        </Space>
      ),
    },
    {
      title: 'Giới Tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 90,
      render: (v: string) =>
        v ? (
          <Tag color={genderLabel[v]?.color}>{genderLabel[v]?.text}</Tag>
        ) : '—',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
      render: (v: string) => v || <span style={{ color: 'var(--text-muted)' }}>—</span>,
    },
    {
      title: 'Điện Thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      render: (v: string) => v || <span style={{ color: 'var(--text-muted)' }}>—</span>,
    },
    {
      title: 'Lớp',
      key: 'class',
      width: 130,
      render: (_: any, record: any) =>
        record.class ? (
          <Tag color="geekblue">{record.class.class_code}</Tag>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>—</span>
        ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 100,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              id={`edit-student-${record.id}`}
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
              style={{ color: 'var(--primary-light)' }}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa sinh viên"
            description={`Bạn có chắc muốn xóa "${record.full_name}"?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button
                id={`delete-student-${record.id}`}
                type="text"
                icon={<DeleteOutlined />}
                style={{ color: 'var(--danger)' }}
              />
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
          <h1 className="page-title">👨‍🎓 Quản Lý Sinh Viên</h1>
          <p className="page-subtitle">
            Tổng cộng <strong style={{ color: 'var(--primary-light)' }}>{total}</strong> sinh viên
          </p>
        </div>
        <Button
          id="add-student-btn"
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAdd}
          size="large"
        >
          Thêm Sinh Viên
        </Button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <Input
            id="student-search"
            prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
            placeholder="Tìm theo tên hoặc MSSV..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ width: 280 }}
            allowClear
          />
          <Select
            id="class-filter"
            placeholder="Lọc theo lớp"
            allowClear
            value={classFilter}
            onChange={(v) => { setClassFilter(v); setPage(1); }}
            style={{ width: 180 }}
          >
            {classes.map((c: any) => (
              <Option key={c.id} value={c.id}>{c.class_code} — {c.class_name}</Option>
            ))}
          </Select>
        </div>
        <Button icon={<ReloadOutlined />} onClick={fetchStudents}>
          Làm Mới
        </Button>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={students}
          loading={loading}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total,
            onChange: (p) => setPage(p),
            showTotal: (t) => `${t} sinh viên`,
            showSizeChanger: false,
          }}
          scroll={{ x: 800 }}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={editingStudent ? '✏️ Chỉnh Sửa Sinh Viên' : '➕ Thêm Sinh Viên'}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        okText={editingStudent ? 'Cập Nhật' : 'Thêm Mới'}
        cancelText="Hủy"
        confirmLoading={saving}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item
              name="student_code"
              label="MSSV"
              rules={[{ required: true, message: 'Nhập MSSV' }]}
            >
              <Input id="form-student-code" placeholder="VD: 52400001" disabled={!!editingStudent} />
            </Form.Item>
            <Form.Item
              name="full_name"
              label="Họ và Tên"
              rules={[{ required: true, message: 'Nhập họ tên' }]}
            >
              <Input id="form-full-name" placeholder="Nguyễn Văn An" />
            </Form.Item>
            <Form.Item name="gender" label="Giới Tính">
              <Select id="form-gender" placeholder="Chọn giới tính">
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>
            <Form.Item name="date_of_birth" label="Ngày Sinh">
              <DatePicker
                id="form-dob"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày sinh"
              />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input id="form-email" placeholder="sv@student.edu.vn" />
            </Form.Item>
            <Form.Item name="phone" label="Điện Thoại">
              <Input id="form-phone" placeholder="0901234567" />
            </Form.Item>
            <Form.Item name="class_id" label="Lớp Học">
              <Select id="form-class" placeholder="Chọn lớp" allowClear>
                {classes.map((c: any) => (
                  <Option key={c.id} value={c.id}>
                    {c.class_code} — {c.class_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="address" label="Địa Chỉ">
            <Input id="form-address" placeholder="123 Đường ABC, TP.HCM" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
