import { useEffect, useState } from 'react';
import {
  Table, Button, Space, Tag, Popconfirm, Modal, Form, Input, message, Tooltip,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ApartmentOutlined, ReloadOutlined } from '@ant-design/icons';
import { departmentsApi } from '../api/services';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [saving, setSaving] = useState(false);

  const fetchDepts = async () => {
    setLoading(true);
    try { const res = await departmentsApi.getAll(); setDepartments(res.data); }
    catch { messageApi.error('Lỗi tải dữ liệu'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDepts(); }, []);

  const openAdd = () => { setEditing(null); form.resetFields(); setModalOpen(true); };
  const openEdit = (r: any) => { setEditing(r); form.setFieldsValue(r); setModalOpen(true); };

  const handleDelete = async (id: number) => {
    try { await departmentsApi.delete(id); messageApi.success('Đã xóa khoa'); fetchDepts(); }
    catch (e: any) { messageApi.error(e.response?.data?.message || 'Xóa thất bại'); }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      if (editing) { await departmentsApi.update(editing.id, values); messageApi.success('Đã cập nhật'); }
      else { await departmentsApi.create(values); messageApi.success('Đã thêm khoa'); }
      setModalOpen(false); fetchDepts();
    } catch (e: any) {
      if (e?.errorFields) return;
      messageApi.error(e.response?.data?.message || 'Lưu thất bại');
    } finally { setSaving(false); }
  };

  const columns = [
    {
      title: 'Mã Khoa', dataIndex: 'dept_code', key: 'dept_code', width: 120,
      render: (v: string) => <Tag color="orange" style={{ fontFamily: 'monospace', fontWeight: 700 }}>{v}</Tag>,
    },
    {
      title: 'Tên Khoa', dataIndex: 'dept_name', key: 'dept_name',
      render: (v: string) => <Space><ApartmentOutlined style={{ color: 'var(--text-muted)' }} /><span style={{ fontWeight: 500 }}>{v}</span></Space>,
    },
    {
      title: 'Ngày Tạo', dataIndex: 'created_at', key: 'created_at', width: 160,
      render: (v: string) => new Date(v).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao Tác', key: 'actions', width: 100,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} style={{ color: 'var(--primary-light)' }} />
          </Tooltip>
          <Popconfirm title="Xóa khoa?" description={`Xóa khoa "${record.dept_name}"?`}
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
          <h1 className="page-title">🏛️ Quản Lý Khoa</h1>
          <p className="page-subtitle">Tổng cộng <strong style={{ color: 'var(--warning)' }}>{departments.length}</strong> khoa</p>
        </div>
        <Button id="add-dept-btn" type="primary" icon={<PlusOutlined />} onClick={openAdd} size="large">Thêm Khoa</Button>
      </div>
      <div className="toolbar">
        <div className="toolbar-left" />
        <Button icon={<ReloadOutlined />} onClick={fetchDepts}>Làm Mới</Button>
      </div>
      <div className="table-container">
        <Table rowKey="id" columns={columns} dataSource={departments} loading={loading}
          pagination={{ pageSize: 10, showTotal: (t) => `${t} khoa` }} />
      </div>
      <Modal title={editing ? '✏️ Chỉnh Sửa Khoa' : '➕ Thêm Khoa'} open={modalOpen}
        onOk={handleSave} onCancel={() => setModalOpen(false)}
        okText={editing ? 'Cập Nhật' : 'Thêm Mới'} cancelText="Hủy"
        confirmLoading={saving} width={440} destroyOnClose>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="dept_code" label="Mã Khoa" rules={[{ required: true }]}>
            <Input placeholder="VD: CNTT" disabled={!!editing} />
          </Form.Item>
          <Form.Item name="dept_name" label="Tên Khoa" rules={[{ required: true }]}>
            <Input placeholder="VD: Công nghệ Thông tin" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
