import { useEffect, useState } from 'react';
import {
  Table, Button, Input, Space, Tag, Popconfirm,
  Modal, Form, Select, message, Tooltip,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, ReloadOutlined,
} from '@ant-design/icons';
import { classesApi, departmentsApi } from '../api/services';

const { Option } = Select;

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [saving, setSaving] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await classesApi.getAll();
      setClasses(res.data);
    } catch { messageApi.error('Lỗi tải dữ liệu'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchClasses(); }, []);
  useEffect(() => {
    departmentsApi.getAll().then((res) => setDepartments(res.data));
  }, []);

  const openAdd = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (r: any) => {
    setEditing(r);
    form.setFieldsValue({ ...r, department_id: r.department?.id || r.department_id });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try { await classesApi.delete(id); messageApi.success('Đã xóa lớp'); fetchClasses(); }
    catch (e: any) { messageApi.error(e.response?.data?.message || 'Xóa thất bại'); }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      if (editing) { await classesApi.update(editing.id, values); messageApi.success('Cập nhật thành công'); }
      else { await classesApi.create(values); messageApi.success('Thêm lớp thành công'); }
      setModalOpen(false); fetchClasses();
    } catch (e: any) {
      if (e?.errorFields) return;
      messageApi.error(e.response?.data?.message || 'Lưu thất bại');
    } finally { setSaving(false); }
  };

  const columns = [
    {
      title: 'Mã Lớp', dataIndex: 'class_code', key: 'class_code', width: 130,
      render: (v: string) => <span style={{ fontFamily: 'monospace', color: 'var(--success)', fontWeight: 600 }}>{v}</span>,
    },
    {
      title: 'Tên Lớp', dataIndex: 'class_name', key: 'class_name',
      render: (v: string) => <Space><TeamOutlined style={{ color: 'var(--text-muted)' }} /><span style={{ fontWeight: 500 }}>{v}</span></Space>,
    },
    {
      title: 'Khoa', key: 'department',
      render: (_: any, r: any) => r.department
        ? <Tag color="gold">{r.department.dept_name}</Tag>
        : <span style={{ color: 'var(--text-muted)' }}>—</span>,
    },
    {
      title: 'Thao Tác', key: 'actions', width: 100,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} style={{ color: 'var(--primary-light)' }} />
          </Tooltip>
          <Popconfirm title="Xóa lớp?" description={`Xóa lớp "${record.class_name}"?`}
            onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
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
          <h1 className="page-title">🏫 Quản Lý Lớp Học</h1>
          <p className="page-subtitle">Tổng cộng <strong style={{ color: 'var(--success)' }}>{classes.length}</strong> lớp học</p>
        </div>
        <Button id="add-class-btn" type="primary" icon={<PlusOutlined />} onClick={openAdd} size="large">Thêm Lớp</Button>
      </div>
      <div className="toolbar">
        <div className="toolbar-left" />
        <Button icon={<ReloadOutlined />} onClick={fetchClasses}>Làm Mới</Button>
      </div>
      <div className="table-container">
        <Table rowKey="id" columns={columns} dataSource={classes} loading={loading}
          pagination={{ pageSize: 10, showTotal: (t) => `${t} lớp học` }} />
      </div>
      <Modal title={editing ? '✏️ Chỉnh Sửa Lớp' : '➕ Thêm Lớp Học'} open={modalOpen}
        onOk={handleSave} onCancel={() => setModalOpen(false)}
        okText={editing ? 'Cập Nhật' : 'Thêm Mới'} cancelText="Hủy"
        confirmLoading={saving} width={480} destroyOnClose>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="class_code" label="Mã Lớp" rules={[{ required: true }]}>
            <Input placeholder="CNTT2022A" disabled={!!editing} />
          </Form.Item>
          <Form.Item name="class_name" label="Tên Lớp" rules={[{ required: true }]}>
            <Input placeholder="Công nghệ Thông tin 2022 - Nhóm A" />
          </Form.Item>
          <Form.Item name="department_id" label="Khoa">
            <Select placeholder="Chọn khoa" allowClear>
              {departments.map((d: any) => (
                <Option key={d.id} value={d.id}>{d.dept_code} — {d.dept_name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
