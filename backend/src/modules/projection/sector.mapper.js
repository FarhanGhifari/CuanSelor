// Sektor dari frontend sudah sesuai dengan nama di streamlit-ds/data/processed/salary_growth.csv
// Jadi tidak perlu mapping lagi, langsung pass-through
const VALID_SECTORS = [
  "Pertanian, Kehutanan, dan Perikanan",
  "Pertambangan dan Penggalian",
  "Industri",
  "Penyediaan Listrik, Gas, Uap/Air Panas, dan Udara Dingin",
  "Penyediaan Air, Pengelolaan Air Limbah, Penanganan Limbah, dan Remediasi",
  "Konstruksi",
  "Perdagangan Besar dan Eceran",
  "Transportasi dan Penyimpanan",
  "Penyediaan Akomodasi dan Penyediaan Makan Minum",
  "Aktivitas Penerbitan dan Telekomunikasi",
  "Aktivitas Keuangan dan Asuransi",
  "Aktivitas Real Estat",
  "Aktivitas Profesional, Ilmiah, dan Teknis dan Aktivitas Administratif dan Penunjang Usaha",
  "Administrasi Pemerintahan dan Pertahanan, serta Jaminan Sosial Wajib",
  "Pendidikan",
  "Aktivitas Kesehatan Manusia dan Aktivitas Sosial",
  "Kesenian, Aktivitas Jasa Lainnya, Aktivitas Rumah Tangga, dan Aktivitas Badan Internasional",
  "Rata-rata",
];

export function mapSectorToBps(frontendSector) {
  // Jika sektor valid, return as-is
  if (VALID_SECTORS.includes(frontendSector)) {
    return frontendSector;
  }
  // Fallback ke Rata-rata jika tidak valid
  return "Rata-rata";
}
