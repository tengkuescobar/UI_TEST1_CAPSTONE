/** Shared domain types for the prototype. All data is synthetic / mock. */

export type Role = 'pengunjung' | 'warga' | 'petugas' | 'lurah' | 'admin';

export type ServiceCategory = 'adminduk' | 'surat';

/**
 * information_only — guidance only; no submission is simulated (identity documents).
 * demo_submission  — prototype submission flow is enabled (administrative letters).
 */
export type ServiceMode = 'information_only' | 'demo_submission';

/** required: always needed. conditional_if_needed: "Jika diperlukan". conditional_specific: "Khusus kondisi tertentu". */
export type RequirementCondition = 'required' | 'if_needed' | 'specific_condition';

export interface Requirement {
  id: string;
  label: string;
  detail?: string;
  condition: RequirementCondition;
}

export interface ServiceCase {
  id: string;
  label: string;
  summary: string;
  requirements: Requirement[];
  procedureNotes?: string[];
  /** IDs of OfficialForm entries applicable to this case. */
  formIds: string[];
  relatedServiceIds?: string[];
}

export interface OfficialForm {
  id: string;
  code: string;
  title: string;
  description: string;
  url: string;
}

export interface ProcedureStep {
  title: string;
  description: string;
}

export interface ExtraField {
  id: string;
  label: string;
  type: 'text' | 'date' | 'textarea';
  hint?: string;
  required: boolean;
}

export interface Service {
  id: string;
  title: string;
  shortTitle: string;
  category: ServiceCategory;
  /** Optional grouping, e.g. Pindah Datang + Pindah Keluar → "Perpindahan Penduduk". */
  group?: string;
  description: string;
  serviceMode: ServiceMode;
  cases: ServiceCase[];
  procedureSteps: ProcedureStep[];
  /** IDs of all official forms related to the service. */
  officialForms: string[];
  notes: string[];
  /** Only for demo_submission services. */
  extraFields?: ExtraField[];
  needsLurahApproval?: boolean;
  /** True when requirements are illustrative and not taken from an official poster. */
  illustrativeRequirements?: boolean;
  active: boolean;
}

export type ApplicationStatus =
  | 'diajukan'
  | 'diverifikasi'
  | 'perlu_perbaikan'
  | 'menunggu_persetujuan'
  | 'disetujui'
  | 'selesai'
  | 'ditolak';

export type ComplaintStatus =
  | 'diterima'
  | 'diverifikasi'
  | 'ditindaklanjuti'
  | 'dirujuk'
  | 'selesai'
  | 'ditolak';

export interface UploadedDoc {
  requirementId: string;
  requirementLabel: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  /** Officer verification mark. */
  verified?: boolean;
}

export interface TimelineEntry {
  id: string;
  at: string;
  actor: string;
  role: Role;
  title: string;
  note?: string;
}

export interface Application {
  id: string;
  serviceId: string;
  caseId: string;
  applicantName: string;
  applicantPhone: string;
  address: string;
  purpose: string;
  extra: Record<string, string>;
  documents: UploadedDoc[];
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
  ownerId: string;
}

export interface Complaint {
  id: string;
  title: string;
  categoryId: string;
  location: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEntry[];
  ownerId: string;
  referredTo?: string;
  attachmentName?: string;
}

export interface ComplaintCategory {
  id: string;
  name: string;
  description: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: Exclude<Role, 'pengunjung'>;
  unit: string;
  active: boolean;
}

export interface AppNotification {
  id: string;
  role: Role;
  title: string;
  body: string;
  at: string;
  read: boolean;
  link?: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  role: Role;
  action: string;
  target: string;
}
