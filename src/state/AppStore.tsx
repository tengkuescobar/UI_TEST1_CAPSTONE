import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type {
  AppNotification,
  Application,
  ApplicationStatus,
  AuditEntry,
  Complaint,
  ComplaintCategory,
  ComplaintStatus,
  DemoUser,
  Role,
  Service,
  TimelineEntry,
  UploadedDoc,
} from '../types';
import { SERVICES } from '../data/services';
import {
  MOCK_APPLICATIONS,
  MOCK_AUDIT,
  MOCK_COMPLAINTS,
  MOCK_COMPLAINT_CATEGORIES,
  MOCK_NOTIFICATIONS,
  MOCK_USERS,
} from '../data/mock';
import { COMPLAINT_STATUS, ROLE_PERSONA } from '../data/status';

/**
 * Demo state store. Everything lives in browser memory and is mirrored to sessionStorage
 * so the demo survives a page refresh within the same tab. No server persistence.
 */

interface DemoState {
  role: Role;
  services: Service[];
  applications: Application[];
  complaints: Complaint[];
  categories: ComplaintCategory[];
  users: DemoUser[];
  notifications: AppNotification[];
  audit: AuditEntry[];
}

const STORAGE_KEY = 'kp-demo-state-v1';

const initialState = (): DemoState => ({
  role: 'pengunjung',
  services: structuredClone(SERVICES),
  applications: structuredClone(MOCK_APPLICATIONS),
  complaints: structuredClone(MOCK_COMPLAINTS),
  categories: structuredClone(MOCK_COMPLAINT_CATEGORIES),
  users: structuredClone(MOCK_USERS),
  notifications: structuredClone(MOCK_NOTIFICATIONS),
  audit: structuredClone(MOCK_AUDIT),
});

function load(): DemoState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState(), ...(JSON.parse(raw) as DemoState) };
  } catch {
    /* ignore corrupted storage */
  }
  return initialState();
}

let idCounter = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;
const now = () => new Date().toISOString();

export interface NewApplicationInput {
  serviceId: string;
  caseId: string;
  applicantName: string;
  applicantPhone: string;
  address: string;
  purpose: string;
  extra: Record<string, string>;
  documents: UploadedDoc[];
}

export interface NewComplaintInput {
  title: string;
  categoryId: string;
  location: string;
  description: string;
  attachmentName?: string;
}

interface StoreApi extends DemoState {
  persona: { id: string; name: string };
  setRole: (role: Role) => void;
  resetDemo: () => void;
  submitApplication: (input: NewApplicationInput) => string;
  resubmitApplication: (id: string, documents: UploadedDoc[], note?: string) => void;
  startVerification: (id: string) => void;
  toggleDocVerified: (id: string, requirementId: string) => void;
  requestRevision: (id: string, note: string) => void;
  forwardToLurah: (id: string, note?: string) => void;
  lurahApprove: (id: string, note?: string) => void;
  lurahReturn: (id: string, note: string) => void;
  completeApplication: (id: string) => void;
  rejectApplication: (id: string, note: string) => void;
  createComplaint: (input: NewComplaintInput) => string;
  updateComplaint: (id: string, status: ComplaintStatus, note: string, referredTo?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: (role: Role) => void;
  saveUser: (user: DemoUser) => void;
  toggleUserActive: (id: string) => void;
  updateService: (service: Service) => void;
  addCategory: (c: Omit<ComplaintCategory, 'id'>) => void;
  removeCategory: (id: string) => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(load);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable (private mode); demo still works in memory */
    }
  }, [state]);

  const persona = ROLE_PERSONA[state.role];

  /** Core mutation helper: applies an update and appends audit + notifications. */
  const commit = useCallback(
    (
      update: (s: DemoState) => Partial<DemoState>,
      audit?: { action: string; target: string },
      notify?: Array<Omit<AppNotification, 'id' | 'at' | 'read'>>,
    ) => {
      setState((s) => {
        const actor = ROLE_PERSONA[s.role];
        const patch = update(s);
        const next: DemoState = { ...s, ...patch };
        if (audit) {
          next.audit = [{ id: uid('a'), at: now(), actor: actor.name, role: s.role, ...audit }, ...next.audit];
        }
        if (notify?.length) {
          next.notifications = [
            ...notify.map((n) => ({ ...n, id: uid('n'), at: now(), read: false })),
            ...next.notifications,
          ];
        }
        return next;
      });
    },
    [],
  );

  const entry = useCallback(
    (title: string, note?: string): TimelineEntry => {
      const s = stateRef.current;
      return { id: uid('tl'), at: now(), actor: ROLE_PERSONA[s.role].name, role: s.role, title, note };
    },
    [],
  );

  const patchApp = useCallback(
    (
      id: string,
      status: ApplicationStatus,
      title: string,
      note: string | undefined,
      audit: string,
      notify?: Array<Omit<AppNotification, 'id' | 'at' | 'read'>>,
    ) => {
      const tl = entry(title, note);
      commit(
        (s) => ({
          applications: s.applications.map((a) =>
            a.id === id ? { ...a, status, updatedAt: tl.at, timeline: [...a.timeline, tl] } : a,
          ),
        }),
        { action: audit, target: id },
        notify,
      );
    },
    [commit, entry],
  );

  const api = useMemo<StoreApi>(
    () => ({
      ...state,
      persona,
      setRole: (role) => setState((s) => ({ ...s, role })),
      resetDemo: () => {
        const fresh = initialState();
        setState({ ...fresh, role: stateRef.current.role });
      },

      submitApplication: (input) => {
        const s = stateRef.current;
        const max = s.applications.reduce((m, a) => Math.max(m, Number(a.id.split('-').pop()) || 0), 0);
        const id = `SRT-2026-${String(max + 1).padStart(4, '0')}`;
        const tl = entry('Pengajuan dikirim');
        const app: Application = {
          ...input,
          id,
          status: 'diajukan',
          createdAt: tl.at,
          updatedAt: tl.at,
          ownerId: ROLE_PERSONA[s.role].id,
          timeline: [tl],
        };
        commit(
          (st) => ({ applications: [app, ...st.applications] }),
          { action: 'Mengirim pengajuan', target: id },
          [
            { role: 'petugas', title: 'Pengajuan baru masuk', body: `${id} menunggu pemeriksaan.`, link: `/petugas/pengajuan/${id}` },
            { role: 'warga', title: 'Pengajuan berhasil dikirim', body: `${id} telah diterima sistem demo.`, link: `/warga/pengajuan/${id}` },
          ],
        );
        return id;
      },

      resubmitApplication: (id, documents, note) => {
        const tl = entry('Perbaikan dikirim ulang', note);
        commit(
          (s) => ({
            applications: s.applications.map((a) =>
              a.id === id
                ? { ...a, documents, status: 'diajukan', updatedAt: tl.at, timeline: [...a.timeline, tl] }
                : a,
            ),
          }),
          { action: 'Mengirim perbaikan', target: id },
          [{ role: 'petugas', title: 'Perbaikan dokumen diterima', body: `${id} telah diperbaiki pemohon.`, link: `/petugas/pengajuan/${id}` }],
        );
      },

      startVerification: (id) => patchApp(id, 'diverifikasi', 'Verifikasi dimulai', undefined, 'Memulai verifikasi', [
        { role: 'warga', title: 'Pengajuan sedang diverifikasi', body: `${id} sedang diperiksa petugas.`, link: `/warga/pengajuan/${id}` },
      ]),

      toggleDocVerified: (id, requirementId) =>
        commit((s) => ({
          applications: s.applications.map((a) =>
            a.id === id
              ? {
                  ...a,
                  documents: a.documents.map((d) =>
                    d.requirementId === requirementId ? { ...d, verified: !d.verified } : d,
                  ),
                }
              : a,
          ),
        })),

      requestRevision: (id, note) => patchApp(id, 'perlu_perbaikan', 'Diminta perbaikan dokumen', note, 'Meminta perbaikan', [
        { role: 'warga', title: 'Perbaikan diperlukan', body: `${id}: ${note}`, link: `/warga/pengajuan/${id}` },
      ]),

      forwardToLurah: (id, note) => patchApp(id, 'menunggu_persetujuan', 'Dokumen terverifikasi, diteruskan ke Lurah', note, 'Meneruskan ke Lurah', [
        { role: 'lurah', title: 'Persetujuan diperlukan', body: `${id} menunggu persetujuan Anda.`, link: `/lurah/persetujuan/${id}` },
        { role: 'warga', title: 'Menunggu persetujuan Lurah', body: `${id} telah diverifikasi petugas.`, link: `/warga/pengajuan/${id}` },
      ]),

      lurahApprove: (id, note) => patchApp(id, 'disetujui', 'Disetujui Lurah', note, 'Menyetujui dokumen', [
        { role: 'petugas', title: 'Disetujui Lurah', body: `${id} disetujui dan kembali ke antrean petugas untuk diselesaikan.`, link: `/petugas/pengajuan/${id}` },
        { role: 'warga', title: 'Pengajuan disetujui Lurah', body: `${id} sedang disiapkan petugas.`, link: `/warga/pengajuan/${id}` },
      ]),

      lurahReturn: (id, note) => patchApp(id, 'diverifikasi', 'Dikembalikan Lurah ke petugas', note, 'Mengembalikan ke petugas', [
        { role: 'petugas', title: 'Dikembalikan oleh Lurah', body: `${id}: ${note}`, link: `/petugas/pengajuan/${id}` },
      ]),

      completeApplication: (id) => patchApp(id, 'selesai', 'Surat selesai dan siap diambil', undefined, 'Menyelesaikan pengajuan', [
        { role: 'warga', title: 'Surat siap diambil', body: `${id} telah selesai. Silakan datang ke kantor kelurahan.`, link: `/warga/pengajuan/${id}` },
      ]),

      rejectApplication: (id, note) => patchApp(id, 'ditolak', 'Pengajuan ditolak', note, 'Menolak pengajuan', [
        { role: 'warga', title: 'Pengajuan ditolak', body: `${id}: ${note}`, link: `/warga/pengajuan/${id}` },
      ]),

      createComplaint: (input) => {
        const s = stateRef.current;
        const max = s.complaints.reduce((m, c) => Math.max(m, Number(c.id.split('-').pop()) || 0), 0);
        const id = `ADU-2026-${String(max + 1).padStart(4, '0')}`;
        const tl = entry('Pengaduan dibuat');
        const complaint: Complaint = {
          ...input,
          id,
          status: 'diterima',
          createdAt: tl.at,
          updatedAt: tl.at,
          ownerId: ROLE_PERSONA[s.role].id,
          timeline: [tl],
        };
        commit(
          (st) => ({ complaints: [complaint, ...st.complaints] }),
          { action: 'Membuat pengaduan', target: id },
          [{ role: 'petugas', title: 'Pengaduan baru', body: `${id} menunggu verifikasi.`, link: `/petugas/pengaduan/${id}` }],
        );
        return id;
      },

      updateComplaint: (id, status, note, referredTo) => {
        const label = COMPLAINT_STATUS[status].label;
        const tl = entry(referredTo ? `Dirujuk ke ${referredTo}` : label, note || undefined);
        commit(
          (s) => ({
            complaints: s.complaints.map((c) =>
              c.id === id
                ? { ...c, status, referredTo: referredTo ?? c.referredTo, updatedAt: tl.at, timeline: [...c.timeline, tl] }
                : c,
            ),
          }),
          { action: `Memperbarui pengaduan: ${label}`, target: id },
          [{ role: 'warga', title: `Pengaduan ${label.toLowerCase()}`, body: `${id} diperbarui petugas.`, link: `/warga/pengaduan/${id}` }],
        );
      },

      markNotificationRead: (id) =>
        setState((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllRead: (role) =>
        setState((s) => ({ ...s, notifications: s.notifications.map((n) => (n.role === role ? { ...n, read: true } : n)) })),

      saveUser: (user) => {
        const exists = stateRef.current.users.some((u) => u.id === user.id);
        commit(
          (s) => ({ users: exists ? s.users.map((u) => (u.id === user.id ? user : u)) : [user, ...s.users] }),
          { action: exists ? 'Memperbarui pengguna/peran' : 'Menambah pengguna', target: user.name },
        );
      },
      toggleUserActive: (id) => {
        const u = stateRef.current.users.find((x) => x.id === id);
        commit(
          (s) => ({ users: s.users.map((x) => (x.id === id ? { ...x, active: !x.active } : x)) }),
          { action: u?.active ? 'Menonaktifkan akun' : 'Mengaktifkan akun', target: u?.name ?? id },
        );
      },

      updateService: (service) =>
        commit(
          (s) => ({ services: s.services.map((x) => (x.id === service.id ? service : x)) }),
          { action: 'Memperbarui konfigurasi layanan', target: service.title },
        ),

      addCategory: (c) =>
        commit(
          (s) => ({ categories: [...s.categories, { ...c, id: uid('cat') }] }),
          { action: 'Menambah kategori pengaduan', target: c.name },
        ),
      removeCategory: (id) => {
        const c = stateRef.current.categories.find((x) => x.id === id);
        commit(
          (s) => ({ categories: s.categories.filter((x) => x.id !== id) }),
          { action: 'Menghapus kategori pengaduan', target: c?.name ?? id },
        );
      },
    }),
    [state, persona, commit, entry, patchApp],
  );

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore harus digunakan di dalam AppStoreProvider');
  return ctx;
}
