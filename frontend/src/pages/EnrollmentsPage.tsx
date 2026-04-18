import { useEffect, useMemo, useState } from 'react';
import {
  Table, Button, Select, Tag, Popconfirm, Modal, Form,
  message, Tooltip, Alert, Badge, Input, Checkbox, Divider, Avatar,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, ReloadOutlined,
  EditOutlined, CalendarOutlined, CheckCircleOutlined,
  WarningOutlined, SearchOutlined, UserOutlined, BookOutlined,
} from '@ant-design/icons';
import { enrollmentsApi, coursesApi } from '../api/services';
import { studentsApi } from '../api/students';

const { Option } = Select;

const statusConfig: Record<string, { color: string; label: string }> = {
  enrolled:  { color: 'blue',  label: 'Đang học'   },
  completed: { color: 'green', label: 'Hoàn thành' },
  dropped:   { color: 'red',   label: 'Đã hủy'     },
};

const SEMESTER_OPTIONS = [
  'HK1-2023-2024', 'HK2-2023-2024', 'HK-He-2024',
  'HK1-2024-2025', 'HK2-2024-2025', 'HK-He-2025',
  'HK1-2025-2026', 'HK2-2025-2026',
];
const DEFAULT_SEMESTER = 'HK2-2025-2026';

/* ── Component: Danh sách môn checkbox ── */
function CourseSelector({
  courses, selectedIds, onChange,
}: {
  courses: any[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.toLowerCase();
    return courses.filter(c =>
      c.course_name.toLowerCase().includes(q) ||
      c.course_code.toLowerCase().includes(q)
    );
  }, [courses, search]);

  const toggle = (id: number) => {
    onChange(selectedIds.includes(id)
      ? selectedIds.filter(x => x !== id)
      : [...selectedIds, id]
    );
  };

  const filteredIds    = filtered.map(c => c.id);
  const allChecked     = filteredIds.length > 0 && filteredIds.every(id => selectedIds.includes(id));
  const partialChecked = filteredIds.some(id => selectedIds.includes(id)) && !allChecked;

  const toggleAll = () => {
    if (allChecked) {
      onChange(selectedIds.filter(id => !filteredIds.includes(id)));
    } else {
      onChange(Array.from(new Set([...selectedIds, ...filteredIds])));
    }
  };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      {/* Header: search + chọn tất cả */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px',
        background: '#1a0f05',
        borderBottom: '2px solid var(--primary)',
      }}>
        <Checkbox
          checked={allChecked}
          indeterminate={partialChecked}
          onChange={toggleAll}
        >
          <span style={{ color: '#FFB22C', fontSize: 12, fontWeight: 600 }}>
            Tất cả ({filtered.length})
          </span>
        </Checkbox>
        <Input
          prefix={<SearchOutlined style={{ color: 'rgba(255,178,44,0.5)' }} />}
          placeholder="Tìm theo tên hoặc mã môn..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          allowClear
          size="small"
          style={{ flex: 1, fontSize: 13, background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,178,44,0.3)', color: '#fff' }}
        />
      </div>

      {/* Danh sách */}
      <div style={{ maxHeight: 310, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 28, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Không tìm thấy môn học phù hợp
          </div>
        ) : (
          filtered.map((c, idx) => {
            const checked = selectedIds.includes(c.id);
            return (
              <div
                key={c.id}
                onClick={() => toggle(c.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 14px',
                  cursor: 'pointer',
                  background: checked
                    ? 'rgba(255,178,44,0.09)'
                    : idx % 2 === 0 ? '#fff' : '#faf8f5',
                  borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-light)' : 'none',
                  borderLeft: `3px solid ${checked ? 'var(--primary)' : 'transparent'}`,
                  transition: 'background 0.12s, border-left-color 0.12s',
                }}
              >
                <Checkbox
                  checked={checked}
                  onClick={e => e.stopPropagation()}
                  onChange={() => toggle(c.id)}
                />

                {/* Icon */}
                <div style={{
                  width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                  background: checked ? 'rgba(255,178,44,0.18)' : 'rgba(133,72,54,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>
                  📚
                </div>

                {/* Tên + mã */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600, fontSize: 13.5,
                    color: checked ? 'var(--accent)' : 'var(--text-primary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {c.course_name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    Mã:&nbsp;<strong style={{ color: 'var(--accent)' }}>{c.course_code}</strong>
                    {c.department?.dept_name && (
                      <>&nbsp;·&nbsp;Khoa: {c.department.dept_name}</>
                    )}
                  </div>
                </div>

                {/* Tín chỉ badge */}
                <div style={{
                  flexShrink: 0,
                  background: checked ? 'var(--primary)' : 'var(--bg-elevated)',
                  color: checked ? '#1a0f05' : 'var(--text-secondary)',
                  fontWeight: 700, fontSize: 12,
                  borderRadius: 6, padding: '3px 10px',
                  border: `1px solid ${checked ? 'var(--primary)' : 'var(--border)'}`,
                  whiteSpace: 'nowrap',
                }}>
                  {c.credits} TC
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {selectedIds.length > 0 && (
        <div style={{
          padding: '8px 14px',
          background: 'rgba(255,178,44,0.06)',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>
            Đã chọn <strong style={{ color: 'var(--primary)' }}>{selectedIds.length}</strong> môn · Tổng{' '}
            <strong style={{ color: 'var(--accent)' }}>
              {courses.filter(c => selectedIds.includes(c.id)).reduce((s, c) => s + (c.credits || 0), 0)}
            </strong> tín chỉ
          </span>
          <Button size="small" type="link" danger onClick={() => onChange([])}
            style={{ fontSize: 12, padding: 0, height: 'auto' }}>
            Bỏ chọn tất cả
          </Button>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function EnrollmentsPage() {
  const [enrollments, setEnrollments]         = useState<any[]>([]);
  const [students, setStudents]               = useState<any[]>([]);
  const [courses, setCourses]                 = useState<any[]>([]);
  const [loading, setLoading]                 = useState(false);
  const [modalOpen, setModalOpen]             = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [editingRecord, setEditingRecord]     = useState<any>(null);
  const [filterSemester, setFilterSemester]   = useState<string | undefined>();
  const [filterStudent, setFilterStudent]     = useState<number | undefined>(); // lọc bảng
  const [saving, setSaving]                   = useState(false);

  // state cho modal đăng ký
  const [selStudent,   setSelStudent]   = useState<number | undefined>();
  const [selSemester,  setSelSemester]  = useState<string>(DEFAULT_SEMESTER);
  const [selCourseIds, setSelCourseIds] = useState<number[]>([]);
  const [batchResult,  setBatchResult]  = useState<any>(null);

  const [statusForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchAll = async () => {
    setLoading(true);
    try { setEnrollments((await enrollmentsApi.getAll()).data); }
    catch { messageApi.error('Lỗi tải dữ liệu'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    studentsApi.getAll({ limit: 1000 }).then(r => setStudents(r.data.data || []));
    coursesApi.getAll().then(r => setCourses(r.data));
  }, []);

  const filteredEnrollments = useMemo(() => {
    let result = enrollments;
    if (filterSemester) result = result.filter(e => e.semester === filterSemester);
    if (filterStudent)  result = result.filter(e => Number(e.student_id) === Number(filterStudent));
    return result;
  }, [enrollments, filterSemester, filterStudent]);

  const studentOptions = useMemo(() =>
    students.map((s: any) => ({ value: s.id, label: `${s.full_name} (${s.student_code})` })),
  [students]);

  const selectedStudent = students.find(s => s.id === selStudent);

  const openModal = () => {
    setSelStudent(undefined);
    setSelSemester(DEFAULT_SEMESTER);
    setSelCourseIds([]);
    setBatchResult(null);
    setModalOpen(true);
  };

  const handleBatchSave = async () => {
    if (!selStudent)             { messageApi.warning('Vui lòng chọn sinh viên'); return; }
    if (!selSemester)            { messageApi.warning('Vui lòng chọn học kỳ');    return; }
    if (selCourseIds.length === 0){ messageApi.warning('Chọn ít nhất 1 môn học'); return; }

    setSaving(true); setBatchResult(null);
    try {
      const res    = await enrollmentsApi.batchCreate({ student_id: selStudent, course_ids: selCourseIds, semester: selSemester });
      const result = res.data;
      setBatchResult(result);
      fetchAll();
      if (result.success > 0 && result.skipped === 0) {
        messageApi.success(`✅ Đã đăng ký thành công ${result.success} môn!`);
        setTimeout(() => setModalOpen(false), 1200);
      } else if (result.success > 0) {
        messageApi.warning(`⚠️ ${result.success} môn mới · ${result.skipped} đã tồn tại`);
      } else {
        messageApi.warning('Tất cả môn đã được đăng ký trước đó');
      }
    } catch (e: any) {
      messageApi.error(e.response?.data?.message || 'Lỗi đăng ký');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try { await enrollmentsApi.delete(id); messageApi.success('Đã xóa'); fetchAll(); }
    catch (e: any) { messageApi.error(e.response?.data?.message || 'Lỗi'); }
  };

  const openStatusModal = (record: any) => {
    setEditingRecord(record);
    statusForm.setFieldsValue({ status: record.status });
    setStatusModalOpen(true);
  };

  const handleStatusSave = async () => {
    try {
      const values = await statusForm.validateFields();
      setSaving(true);
      await enrollmentsApi.update(editingRecord.id, values);
      messageApi.success('Đã cập nhật trạng thái');
      setStatusModalOpen(false);
      fetchAll();
    } catch (e: any) {
      if (e?.errorFields) return;
      messageApi.error(e.response?.data?.message || 'Lỗi cập nhật');
    } finally { setSaving(false); }
  };

  const columns = [
    {
      title: 'Sinh Viên', key: 'student',
      render: (_: any, r: any) => r.student
        ? <div>
            <div style={{ fontWeight: 600 }}>{r.student.full_name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.student.student_code}</div>
          </div>
        : '—',
    },
    {
      title: 'Môn Học', key: 'course',
      render: (_: any, r: any) => r.course
        ? <div>
            <div style={{ fontWeight: 600 }}>{r.course.course_name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.course.course_code} · {r.course.credits} TC</div>
          </div>
        : '—',
    },
    {
      title: 'Học Kỳ', dataIndex: 'semester', key: 'semester', width: 140,
      render: (v: string) => <Tag color="geekblue">{v}</Tag>,
    },
    {
      title: 'Trạng Thái', dataIndex: 'status', key: 'status', width: 130,
      render: (v: string) => v ? <Tag color={statusConfig[v]?.color}>{statusConfig[v]?.label}</Tag> : '—',
    },
    {
      title: 'Ngày ĐK', dataIndex: 'enrolled_at', key: 'enrolled_at', width: 110,
      render: (v: string) => new Date(v).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao Tác', key: 'actions', width: 100,
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: 4 }}>
          <Tooltip title="Đổi trạng thái">
            <Button type="text" icon={<EditOutlined />} style={{ color: 'var(--primary)' }} onClick={() => openStatusModal(record)} />
          </Tooltip>
          <Popconfirm title="Xóa đăng ký?" description="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Không" okButtonProps={{ danger: true }}>
            <Tooltip title="Xóa">
              <Button type="text" icon={<DeleteOutlined />} style={{ color: 'var(--danger)' }} />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container fade-in">
      {contextHolder}

      <div className="page-header">
        <div>
          <h1 className="page-title">📋 Đăng Ký Môn Học</h1>
          <p className="page-subtitle">
            Hiển thị <strong style={{ color: 'var(--primary)' }}>{filteredEnrollments.length}</strong> đăng ký
            {filterSemester && <> · <strong style={{ color: 'var(--secondary)' }}>{filterSemester}</strong></>}
          </p>
        </div>
        <Button id="add-enrollment-btn" type="primary" icon={<PlusOutlined />} onClick={openModal} size="large">
          Đăng Ký Môn Học
        </Button>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <Select showSearch allowClear placeholder="🔍 Lọc theo sinh viên..."
            value={filterStudent} onChange={setFilterStudent}
            optionFilterProp="label" options={studentOptions}
            style={{ width: 240 }} suffixIcon={<UserOutlined />}
          />
          <Select showSearch allowClear placeholder="📅 Lọc theo học kỳ..."
            value={filterSemester} onChange={setFilterSemester}
            style={{ width: 185 }} suffixIcon={<CalendarOutlined />}>
            {SEMESTER_OPTIONS.map(s => <Option key={s} value={s}>{s}</Option>)}
          </Select>
        </div>
        <Button icon={<ReloadOutlined />} onClick={fetchAll}>Làm Mới</Button>
      </div>

      <div className="table-container">
        <Table rowKey="id" columns={columns} dataSource={filteredEnrollments}
          loading={loading}
          pagination={{ pageSize: 15, showTotal: t => `${t} đăng ký` }}
          scroll={{ x: 850 }} />
      </div>

      {/* ═══════════════════════════
          MODAL ĐĂNG KÝ
          ═══════════════════════════ */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'linear-gradient(135deg,#FFB22C,#854836)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
            }}>📝</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Đăng Ký Môn Học</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>
                Chọn sinh viên và các môn muốn đăng ký cùng lúc
              </div>
            </div>
          </div>
        }
        open={modalOpen}
        onOk={handleBatchSave}
        onCancel={() => setModalOpen(false)}
        okText={selCourseIds.length > 0 ? `🚀 Đăng Ký ${selCourseIds.length} Môn` : '🚀 Đăng Ký'}
        cancelText="Hủy"
        confirmLoading={saving}
        width={680}
        destroyOnClose
      >
        {/* Bước 1 */}
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            📌 Bước 1 — Thông tin đăng ký
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Học Kỳ <span style={{ color: 'var(--danger)' }}>*</span>
              </div>
              <Select value={selSemester} onChange={setSelSemester}
                style={{ width: '100%' }} suffixIcon={<CalendarOutlined />} size="large">
                {SEMESTER_OPTIONS.map(s => (
                  <Option key={s} value={s}>
                    {s === DEFAULT_SEMESTER ? `${s} ✦ hiện tại` : s}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Sinh Viên <span style={{ color: 'var(--danger)' }}>*</span>
              </div>
              <Select showSearch placeholder="Tìm và chọn sinh viên..."
                optionFilterProp="label" options={studentOptions}
                value={selStudent} onChange={setSelStudent}
                style={{ width: '100%' }} size="large" suffixIcon={<UserOutlined />} />
            </div>
          </div>

          {selectedStudent && (
            <div style={{
              marginTop: 12, padding: '10px 14px',
              background: 'rgba(255,178,44,0.08)',
              border: '1px solid rgba(255,178,44,0.3)',
              borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Avatar style={{ background: 'linear-gradient(135deg,#FFB22C,#854836)', color: '#1a0f05', fontWeight: 700 }}>
                {selectedStudent.full_name?.[0]}
              </Avatar>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{selectedStudent.full_name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  MSSV: <strong>{selectedStudent.student_code}</strong>
                  {selectedStudent.class?.class_name && <> · Lớp: {selectedStudent.class.class_name}</>}
                </div>
              </div>
              <CheckCircleOutlined style={{ color: 'var(--success)', fontSize: 20 }} />
            </div>
          )}
        </div>

        {/* Bước 2 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📚 Bước 2 — Chọn Môn Học
            </div>
            {selCourseIds.length > 0 && (
              <Tag style={{
                background: 'rgba(255,178,44,0.12)',
                border: '1px solid var(--primary)',
                color: 'var(--accent)', fontWeight: 600, fontSize: 12,
              }}>
                <BookOutlined /> {selCourseIds.length} môn ·{' '}
                {courses.filter(c => selCourseIds.includes(c.id)).reduce((s, c) => s + (c.credits || 0), 0)} TC
              </Tag>
            )}
          </div>

          <CourseSelector courses={courses} selectedIds={selCourseIds} onChange={setSelCourseIds} />
        </div>

        {/* Kết quả */}
        {batchResult && (
          <div style={{ marginTop: 14 }}>
            <Divider style={{ margin: '8px 0', borderColor: 'var(--border)' }} />
            {batchResult.success > 0 && (
              <Alert type="success" showIcon style={{ marginBottom: 8 }}
                message={<span><CheckCircleOutlined /> Đã đăng ký thành công <strong>{batchResult.success}</strong> môn mới</span>} />
            )}
            {batchResult.skipped > 0 && (
              <Alert type="warning" showIcon
                message={`${batchResult.skipped} môn đã tồn tại (bỏ qua)`}
                description={
                  <ul style={{ margin: '4px 0 0', paddingLeft: 16, fontSize: 12 }}>
                    {batchResult.results.filter((r: any) => r.status === 'skipped').map((r: any) => {
                      const c = courses.find((c: any) => c.id === r.course_id);
                      return (
                        <li key={r.course_id}>
                          <WarningOutlined style={{ color: '#faad14' }} />{' '}
                          {c ? `${c.course_name} (${c.course_code})` : `Môn #${r.course_id}`}
                        </li>
                      );
                    })}
                  </ul>
                }
              />
            )}
          </div>
        )}
      </Modal>

      {/* Modal đổi trạng thái */}
      <Modal title="🔄 Cập Nhật Trạng Thái"
        open={statusModalOpen} onOk={handleStatusSave}
        onCancel={() => setStatusModalOpen(false)}
        okText="Lưu" cancelText="Hủy"
        confirmLoading={saving} width={360} destroyOnClose>
        <Form form={statusForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="status" label="Trạng Thái Mới" rules={[{ required: true }]}>
            <Select size="large">
              <Option value="enrolled">🔵 Đang học</Option>
              <Option value="completed">🟢 Hoàn thành</Option>
              <Option value="dropped">🔴 Đã hủy</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
