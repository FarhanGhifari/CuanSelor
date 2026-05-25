const sectorMapping = {
  "Pemerintahan / PNS": "Administrasi Pemerintahan dan Pertahanan, serta Jaminan Sosial Wajib",
  "BUMN / BUMD": "Rata-rata",
  "Swasta - Keuangan": "Aktivitas Keuangan dan Asuransi",
  "Swasta - Teknologi": "Aktivitas Penerbitan dan Telekomunikasi",
  "Swasta - Manufaktur": "Industri",
  "Swasta - Kesehatan": "Aktivitas Kesehatan Manusia dan Aktivitas Sosial",
  "Swasta - Pendidikan": "Pendidikan",
  "Wiraswasta / Freelance": "Rata-rata",
  "Profesional (Dokter/Pengacara)":
    "Aktivitas Profesional, Ilmiah, dan Teknis dan Aktivitas Administratif dan Penunjang Usaha",
  Lainnya: "Rata-rata",
};

export function mapSectorToBps(frontendSector) {
  return sectorMapping[frontendSector] || "Rata-rata";
}
