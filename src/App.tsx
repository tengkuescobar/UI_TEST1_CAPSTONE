import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppStoreProvider } from './state/AppStore';
import { ToastProvider } from './state/ToastContext';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { ServiceCatalogPage } from './pages/public/ServiceCatalogPage';
import { ServiceDetailPage } from './pages/public/ServiceDetailPage';
import { PublicTrackingPage } from './pages/public/PublicTrackingPage';
import { GuidePage } from './pages/public/GuidePage';
import { LoginPage } from './pages/public/LoginPage';

// Citizen (Warga) Pages
import { WargaDashboard } from './pages/warga/WargaDashboard';
import { WargaApplications } from './pages/warga/WargaApplications';
import { WargaNewApplication } from './pages/warga/WargaNewApplication';
import { WargaApplicationDetail } from './pages/warga/WargaApplicationDetail';
import { WargaComplaints } from './pages/warga/WargaComplaints';
import { WargaNewComplaint } from './pages/warga/WargaNewComplaint';
import { WargaComplaintDetail } from './pages/warga/WargaComplaintDetail';
import { WargaProfile } from './pages/warga/WargaProfile';

// Officer (Petugas) Pages
import { PetugasDashboard } from './pages/petugas/PetugasDashboard';
import { PetugasApplications } from './pages/petugas/PetugasApplications';
import { PetugasApplicationDetail } from './pages/petugas/PetugasApplicationDetail';
import { PetugasComplaints } from './pages/petugas/PetugasComplaints';
import { PetugasComplaintDetail } from './pages/petugas/PetugasComplaintDetail';

// Leader (Lurah) Pages
import { LurahDashboard } from './pages/lurah/LurahDashboard';
import { LurahApprovals } from './pages/lurah/LurahApprovals';
import { LurahApprovalDetail } from './pages/lurah/LurahApprovalDetail';
import { LurahReports } from './pages/lurah/LurahReports';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminAudit } from './pages/admin/AdminAudit';

// 404 Page
import { Link } from 'react-router-dom';
import { PublicNavbar } from './components/layout/PublicNavbar';
import { PublicFooter } from './components/layout/PublicFooter';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <PublicNavbar />
      <main className="container-page flex-1 py-20 text-center">
        <h1 className="text-4xl font-extrabold text-primary-dark">404</h1>
        <p className="text-base font-bold text-ink mt-2">Halaman Tidak Ditemukan</p>
        <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
          Tautan yang Anda tuju mungkin sudah dipindahkan atau tidak tersedia pada sistem demo ini.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-[var(--radius-ui)] bg-primary px-5 text-sm font-bold text-white"
        >
          Kembali ke Beranda
        </Link>
      </main>
      <PublicFooter />
    </div>
  );
}

export function App() {
  return (
    <AppStoreProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/layanan" element={<ServiceCatalogPage />} />
            <Route path="/layanan/:id" element={<ServiceDetailPage />} />
            <Route path="/lacak" element={<PublicTrackingPage />} />
            <Route path="/panduan" element={<GuidePage />} />
            <Route path="/pengaduan" element={<WargaNewComplaint />} />
            <Route path="/masuk" element={<LoginPage />} />
            <Route path="/daftar" element={<LoginPage />} />

            {/* Warga Routes */}
            <Route path="/warga" element={<WargaDashboard />} />
            <Route path="/warga/pengajuan" element={<WargaApplications />} />
            <Route path="/warga/pengajuan/baru" element={<WargaNewApplication />} />
            <Route path="/warga/pengajuan/:id" element={<WargaApplicationDetail />} />
            <Route path="/warga/pengaduan" element={<WargaComplaints />} />
            <Route path="/warga/pengaduan/baru" element={<WargaNewComplaint />} />
            <Route path="/warga/pengaduan/:id" element={<WargaComplaintDetail />} />
            <Route path="/warga/profil" element={<WargaProfile />} />

            {/* Petugas Routes */}
            <Route path="/petugas" element={<PetugasDashboard />} />
            <Route path="/petugas/pengajuan" element={<PetugasApplications />} />
            <Route path="/petugas/pengajuan/:id" element={<PetugasApplicationDetail />} />
            <Route path="/petugas/pengaduan" element={<PetugasComplaints />} />
            <Route path="/petugas/pengaduan/:id" element={<PetugasComplaintDetail />} />

            {/* Lurah Routes */}
            <Route path="/lurah" element={<LurahDashboard />} />
            <Route path="/lurah/persetujuan" element={<LurahApprovals />} />
            <Route path="/lurah/persetujuan/:id" element={<LurahApprovalDetail />} />
            <Route path="/lurah/laporan" element={<LurahReports />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/pengguna" element={<AdminUsers />} />
            <Route path="/admin/layanan" element={<AdminServices />} />
            <Route path="/admin/kategori" element={<AdminCategories />} />
            <Route path="/admin/audit" element={<AdminAudit />} />

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppStoreProvider>
  );
}

export default App;
