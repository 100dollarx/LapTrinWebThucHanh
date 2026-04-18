import { useEffect, useMemo, useState } from 'react';
import {
  Table, Button, Select, Tag, Modal, Form, InputNumber,
  message, Tooltip, Empty, Avatar, Divider, Badge,
} from 'antd';
import {
  EditOutlined, ReloadOutlined, TrophyOutlined,
  UserOutlined, BookOutlined, BarChartOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, Cell, Legend,
} from 'recharts';
import { gradesApi, enrollmentsApi } from '../api/services';
import { studentsApi } from '../api/students';

/* ── Màu điểm ── */
const gradeColor: Record<string, string> = {
  'A+': '#22c55e', 'A': '#16a34a', 'B+': '#3b82f6', 'B': '#2563eb',
  'C+': '#f59e0b', 'C': '#d97706', 'D+': '#f97316', 'D': '#ea580c', 'F': '#ef4444',
};

const BAR_COLORS = ['#FFB22C', '#854836', '#22c55e', '#3b82f6', '#f97316', '#8b5cf6', '#ec4899'];

/* ── Component: Biểu đồ điểm ── */
function GradeChart({ grades }: { grades: any[] }) {
  const hasData = grades.some(g => g.total_score != null);

  const barData = useMemo(() =>
    grades
      .filter(g => g.total_score != null)
      .map(g => ({
        name: g.enrollment?.course?.course_code || 'N/A',
        fullName: g.enrollment?.course?.course_name || 'N/A',
        GK: g.midterm_score != null ? Number(g.midterm_score) : null,
        CK: g.final_score   != null ? Number(g.final_score)   : null,
        Tổng: g.total_score != null ? Number(Number(g.total_score).toFixed(2)) : null,
        letter: g.grade_letter,
      })),
  [grades]);

  const radarData = useMemo(() =>
    grades
      .filter(g => g.total_score != null)
      .map(g => ({
        subject: g.enrollment?.course?.course_code || 'N/A',
        score:   Math.round((Number(g.total_score) / 10) * 100),
      })),
  [grades]);

  if (!hasData) {
    return (
      <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        <BarChartOutlined style={{ fontSize: 32, marginBottom: 8, display: 'block' }} />
        Chưa có dữ liệu điểm để hiển thị biểu đồ
      </div>
    );
  }

  return (
    <div>
      {/* Bar Chart — điểm GK / CK / Tổng */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>
          📊 So sánh điểm các môn
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <RTooltip
              contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
              formatter={(val: any, name: string) => [val?.toFixed(2) ?? '—', name]}
              labelFormatter={(label: string) => {
                const item = barData.find(d => d.name === label);
                return item?.fullName || label;
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="GK"   name="Giữa Kỳ"  fill="#854836" radius={[3,3,0,0]} maxBarSize={24} />
            <Bar dataKey="CK"   name="Cuối Kỳ"  fill="#FFB22C" radius={[3,3,0,0]} maxBarSize={24} />
            <Bar dataKey="Tổng" name="Điểm Tổng" radius={[3,3,0,0]} maxBarSize={24}>
              {barData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry.Tổng != null && entry.Tổng >= 8.5 ? '#22c55e' :
                    entry.Tổng != null && entry.Tổng >= 7   ? '#3b82f6' :
                    entry.Tổng != null && entry.Tổng >= 5   ? '#f59e0b' : '#ef4444'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart — hình nhện năng lực */}
      {radarData.length >= 3 && (
        <>
          <Divider style={{ borderColor: 'var(--border)', margin: '12px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>
            🕸️ Phổ năng lực học tập
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: 'var(--text-muted)' }} />
              <Radar name="Điểm %" dataKey="score"
                stroke="#FFB22C" fill="#FFB22C" fillOpacity={0.25} strokeWidth={2} />
              <RTooltip
                contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                formatter={(v: any) => [`${v}%`, 'Điểm']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────
   Main GradesPage
   ────────────────────────────────────────── */
export default function GradesPage() {
  const [grades,    setGrades]    = useState<any[]>([]);
  const [students,  setStudents]  = useState<any[]>([]);
  const [allEnrollments, setAllEnrollments] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [studLoading, setStudLoading] = useState(false);

  // Lựa chọn sinh viên (bên trái)
  const [selectedStudentId, setSelectedStudentId] = useState<number | undefined>();
  // Lựa chọn môn trong bảng phải
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | undefined>();

  const [modalOpen,    setModalOpen]    = useState(false);
  const [editingGrade, setEditingGrade] = useState<any>(null);
  const [showChart,    setShowChart]    = useState(false);
  const [form]                          = Form.useForm();
  const [messageApi, contextHolder]     = message.useMessage();
  const [saving, setSaving]             = useState(false);

  /* ── Fetch ── */
  const fetchGrades = async () => {
    setLoading(true);
    try {
      const res = selectedStudentId
        ? await gradesApi.getByStudent(selectedStudentId)
        : await gradesApi.getAll();
      setGrades(res.data);
    } catch { messageApi.error('Lỗi tải bảng điểm'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchGrades(); }, [selectedStudentId]);

  useEffect(() => {
    setStudLoading(true);
    studentsApi.getAll({ limit: 1000 })
      .then(r => setStudents(r.data.data || []))
      .finally(() => setStudLoading(false));
    enrollmentsApi.getAll().then(r => setAllEnrollments(r.data));
  }, []);

  /* ── Computed ── */
  const studentOptions = useMemo(() =>
    students.map((s: any) => ({ value: s.id, label: `${s.full_name} (${s.student_code})` })),
  [students]);

  const selectedStudentObj = students.find(s => s.id === selectedStudentId);

  // Danh sách enrollment đang học của sinh viên đã chọn (để nhập điểm)
  const studentEnrollments = useMemo(() => {
    if (!selectedStudentId) return [];
    return allEnrollments.filter(
      e => Number(e.student_id) === Number(selectedStudentId) && e.status === 'enrolled'
    );
  }, [allEnrollments, selectedStudentId]);

  // Danh sách môn đã có điểm (để không cho nhập trùng)
  const gradedEnrollmentIds = useMemo(() =>
    grades.map(g => g.enrollment_id),
  [grades]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    if (!grades.length) return null;
    const scored = grades.filter(g => g.total_score != null);
    const avg    = scored.length ? scored.reduce((s, g) => s + Number(g.total_score), 0) / scored.length : 0;
    const passed = scored.filter(g => Number(g.total_score) >= 5).length;
    const best   = scored.reduce((best, g) => Number(g.total_score) > Number(best?.total_score ?? -1) ? g : best, null as any);
    return { total: grades.length, scored: scored.length, avg, passed, best };
  }, [grades]);

  /* ── Handlers ── */
  const openAdd = () => {
    setEditingGrade(null);
    form.resetFields();
    if (selectedEnrollmentId) {
      form.setFieldValue('enrollment_id', selectedEnrollmentId);
    }
    setModalOpen(true);
  };

  const openEdit = (record: any) => {
    setEditingGrade(record);
    form.setFieldsValue({
      enrollment_id:  record.enrollment_id,
      midterm_score:  record.midterm_score != null ? Number(record.midterm_score) : undefined,
      final_score:    record.final_score   != null ? Number(record.final_score)   : undefined,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      if (editingGrade) {
        await gradesApi.update(editingGrade.id, values);
        messageApi.success('Đã cập nhật điểm');
      } else {
        await gradesApi.create(values);
        messageApi.success('Đã nhập điểm thành công');
      }
      setModalOpen(false);
      fetchGrades();
    } catch (e: any) {
      if (e?.errorFields) return;
      messageApi.error(e.response?.data?.message || 'Lỗi lưu điểm');
    } finally { setSaving(false); }
  };

  /* ── Table columns ── */
  const columns = [
    {
      title: 'Môn Học', key: 'course',
      render: (_: any, r: any) => {
        const c = r.enrollment?.course;
        return c ? (
          <div>
            <div style={{ fontWeight: 600 }}>{c.course_name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.course_code} · {c.credits} TC</div>
          </div>
        ) : '—';
      },
    },
    {
      title: 'Học Kỳ', key: 'semester', width: 130,
      render: (_: any, r: any) => r.enrollment?.semester
        ? <Tag color="geekblue">{r.enrollment.semester}</Tag> : '—',
    },
    {
      title: 'GK (40%)', dataIndex: 'midterm_score', width: 100,
      render: (v: number) => v != null
        ? <span style={{ color: '#854836', fontWeight: 600 }}>{Number(v).toFixed(1)}</span>
        : <span style={{ color: 'var(--text-muted)' }}>—</span>,
    },
    {
      title: 'CK (60%)', dataIndex: 'final_score', width: 100,
      render: (v: number) => v != null
        ? <span style={{ color: '#FFB22C', fontWeight: 600 }}>{Number(v).toFixed(1)}</span>
        : <span style={{ color: 'var(--text-muted)' }}>—</span>,
    },
    {
      title: 'Tổng', dataIndex: 'total_score', width: 85,
      render: (v: number) => v != null
        ? <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: 15 }}>{Number(v).toFixed(2)}</span>
        : <span style={{ color: 'var(--text-muted)' }}>—</span>,
    },
    {
      title: 'Xếp Loại', dataIndex: 'grade_letter', width: 95,
      render: (v: string) => v
        ? <Tag style={{ fontWeight: 700, fontSize: 13, background: gradeColor[v] + '22', color: gradeColor[v], border: `1px solid ${gradeColor[v]}55` }}>{v}</Tag>
        : <span style={{ color: 'var(--text-muted)' }}>—</span>,
    },
    {
      title: '', key: 'actions', width: 60,
      render: (_: any, record: any) => (
        <Tooltip title="Sửa điểm">
          <Button type="text" icon={<EditOutlined />}
            onClick={() => openEdit(record)} style={{ color: 'var(--primary)' }} />
        </Tooltip>
      ),
    },
  ];

  /* ── Render ── */
  return (
    <div className="page-container fade-in">
      {contextHolder}

      <div className="page-header">
        <div>
          <h1 className="page-title">🏆 Bảng Điểm</h1>
          <p className="page-subtitle">
            {selectedStudentId
              ? <>Sinh viên: <strong style={{ color: 'var(--primary)' }}>{selectedStudentObj?.full_name}</strong> · {grades.length} môn</>
              : <>Tất cả — <strong style={{ color: 'var(--primary)' }}>{grades.length}</strong> bản ghi điểm</>
            }
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {selectedStudentId && grades.length > 0 && (
            <Button
              icon={<BarChartOutlined />}
              onClick={() => setShowChart(true)}
              style={{ borderColor: 'var(--primary)', color: 'var(--accent)' }}
            >
              Biểu Đồ Điểm
            </Button>
          )}
          <Button icon={<ReloadOutlined />} onClick={fetchGrades}>Làm Mới</Button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          LAYOUT 2 CỘT: Trái (SV) | Phải (Môn + Bảng)
          ══════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, alignItems: 'start' }}>

        {/* ── CỘT TRÁI: Chọn sinh viên ── */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          position: 'sticky',
          top: 72,
        }}>
          {/* Header panel */}
          <div style={{
            background: '#1a0f05',
            padding: '12px 14px',
            borderBottom: '2px solid var(--primary)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#FFB22C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <UserOutlined /> Chọn Sinh Viên
            </div>
          </div>

          <div style={{ padding: 12 }}>
            <Select
              showSearch allowClear
              placeholder="Tìm sinh viên..."
              optionFilterProp="label"
              options={studentOptions}
              value={selectedStudentId}
              onChange={v => { setSelectedStudentId(v); setSelectedEnrollmentId(undefined); }}
              loading={studLoading}
              style={{ width: '100%' }}
              size="large"
            />
          </div>

          {/* Info card sinh viên */}
          {selectedStudentObj ? (
            <div style={{ padding: '0 12px 12px' }}>
              <div style={{
                padding: '12px',
                background: 'rgba(255,178,44,0.07)',
                border: '1px solid rgba(255,178,44,0.25)',
                borderRadius: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Avatar size={40} style={{ background: 'linear-gradient(135deg,#FFB22C,#854836)', color: '#1a0f05', fontWeight: 700, fontSize: 16 }}>
                    {selectedStudentObj.full_name?.[0]}
                  </Avatar>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{selectedStudentObj.full_name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selectedStudentObj.student_code}</div>
                  </div>
                </div>

                {/* Thống kê nhanh */}
                {stats && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {[
                      { label: 'Số môn', value: stats.total },
                      { label: 'Đã chấm', value: stats.scored },
                      { label: 'TB điểm', value: stats.avg.toFixed(2) },
                      { label: 'Đạt', value: `${stats.passed}/${stats.scored}` },
                    ].map(item => (
                      <div key={item.label} style={{
                        background: 'var(--bg-surface)',
                        borderRadius: 6, padding: '6px 8px', textAlign: 'center',
                        border: '1px solid var(--border-light)',
                      }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>{item.value}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Danh sách môn đang học để chọn nhập điểm */}
              {studentEnrollments.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
                    <BookOutlined /> Chọn môn để nhập điểm
                  </div>
                  <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                    {studentEnrollments.map(e => {
                      const hasGrade = gradedEnrollmentIds.includes(e.id);
                      const isSelected = selectedEnrollmentId === e.id;
                      return (
                        <div
                          key={e.id}
                          onClick={() => !hasGrade && setSelectedEnrollmentId(isSelected ? undefined : e.id)}
                          style={{
                            padding: '8px 10px',
                            marginBottom: 4,
                            borderRadius: 6,
                            cursor: hasGrade ? 'default' : 'pointer',
                            border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-light)'}`,
                            background: isSelected
                              ? 'rgba(255,178,44,0.1)'
                              : hasGrade ? 'rgba(34,197,94,0.06)' : 'var(--bg-elevated)',
                            opacity: hasGrade ? 0.75 : 1,
                            transition: 'all 0.15s',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: isSelected ? 'var(--accent)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {e.course?.course_name || 'N/A'}
                              </div>
                              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                                {e.course?.course_code} · {e.semester}
                              </div>
                            </div>
                            {hasGrade
                              ? <CheckCircleOutlined style={{ color: 'var(--success)', fontSize: 14, flexShrink: 0 }} />
                              : isSelected
                                ? <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 4 }} />
                                : null
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedEnrollmentId && (
                    <Button type="primary" block style={{ marginTop: 10 }}
                      icon={<TrophyOutlined />} onClick={openAdd}>
                      Nhập Điểm Môn Này
                    </Button>
                  )}
                </div>
              )}

              {studentEnrollments.length === 0 && (
                <div style={{ padding: '12px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                  Không có môn đang học
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              <UserOutlined style={{ fontSize: 28, marginBottom: 8, display: 'block' }} />
              Chọn sinh viên để xem bảng điểm
            </div>
          )}
        </div>

        {/* ── CỘT PHẢI: Bảng điểm ── */}
        <div>
          <div className="table-container">
            <Table
              rowKey="id"
              columns={columns}
              dataSource={grades}
              loading={loading}
              pagination={{ pageSize: 15, showTotal: t => `${t} bản ghi` }}
              scroll={{ x: 700 }}
              locale={{ emptyText: (
                <Empty
                  description={selectedStudentId ? 'Chưa có điểm nào' : 'Chọn sinh viên ở bên trái để xem điểm'}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}}
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          MODAL: Nhập / Sửa điểm
          ══════════════════════════════ */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#FFB22C,#854836)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
              {editingGrade ? '✏️' : '➕'}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{editingGrade ? 'Sửa Điểm' : 'Nhập Điểm'}</div>
              {selectedStudentObj && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                  {selectedStudentObj.full_name} ({selectedStudentObj.student_code})
                </div>
              )}
            </div>
          </div>
        }
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        okText={editingGrade ? 'Cập Nhật' : 'Lưu Điểm'}
        cancelText="Hủy"
        confirmLoading={saving}
        width={460}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          {!editingGrade && (
            <Form.Item name="enrollment_id" label="Môn Học"
              rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}>
              <Select
                showSearch placeholder="Chọn môn học..."
                optionFilterProp="label"
                size="large"
                options={studentEnrollments.map(e => ({
                  value: e.id,
                  label: `${e.course?.course_name} (${e.course?.course_code}) — ${e.semester}`,
                  disabled: gradedEnrollmentIds.includes(e.id),
                }))}
                notFoundContent="Không có môn đang học"
              />
            </Form.Item>
          )}

          {editingGrade && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(255,178,44,0.07)', borderRadius: 8, border: '1px solid rgba(255,178,44,0.25)', fontSize: 13 }}>
              <strong>{editingGrade.enrollment?.course?.course_name}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{' '}({editingGrade.enrollment?.course?.course_code})</span>
            </div>
          )}

          <div style={{ padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 8, marginBottom: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
            <TrophyOutlined style={{ marginRight: 6, color: 'var(--primary)' }} />
            Điểm tổng = GK × 40% + CK × 60% — tính tự động
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item name="midterm_score" label="Điểm Giữa Kỳ (0–10)">
              <InputNumber min={0} max={10} step={0.5} style={{ width: '100%' }} size="large"
                placeholder="GK" addonBefore="GK" />
            </Form.Item>
            <Form.Item name="final_score" label="Điểm Cuối Kỳ (0–10)">
              <InputNumber min={0} max={10} step={0.5} style={{ width: '100%' }} size="large"
                placeholder="CK" addonBefore="CK" />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* ══════════════════════════════
          MODAL: Biểu đồ điểm
          ══════════════════════════════ */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChartOutlined style={{ color: 'var(--primary)', fontSize: 20 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Biểu Đồ Điểm</div>
              {selectedStudentObj && (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>
                  {selectedStudentObj.full_name} · {grades.length} môn
                </div>
              )}
            </div>
          </div>
        }
        open={showChart}
        onCancel={() => setShowChart(false)}
        footer={null}
        width={640}
        destroyOnClose
      >
        <GradeChart grades={grades} />
      </Modal>
    </div>
  );
}
