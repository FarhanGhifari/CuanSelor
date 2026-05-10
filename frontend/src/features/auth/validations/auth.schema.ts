import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal 8 karakter"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;


export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;


export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Harus mengandung setidaknya satu huruf kapital")
      .regex(/[0-9]/, "Harus mengandung setidaknya satu angka"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;



export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, "Nama lengkap wajib diisi")
    .min(2, "Nama minimal 2 karakter"),
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .min(8, "Password minimal 8 karakter"),
  confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  birthDate: z
    .string()
    .min(1, "Tanggal lahir wajib diisi"),
  gender: z.enum(["male", "female"], {
    message: "Jenis kelamin wajib dipilih",
  }),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Password tidak cocok",
  path:    ["confirmPassword"],
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;

export const financialInfoSchema = z.object({
  profession: z
    .string()
    .min(1, "Pekerjaan wajib diisi"),
  monthlyIncome: z
    .string()
    .min(1, "Pendapatan bulanan wajib diisi"),
  monthlyExpense: z
    .string()
    .min(1, "Pengeluaran bulanan wajib diisi"),
  currentSavings: z
    .string()
    .min(1, "Total tabungan wajib diisi"),
  totalDebt: z
    .string()
    .min(1, "Total utang wajib diisi"),
  retirementAge: z
    .string()
    .min(1, "Target usia pensiun wajib diisi"),
  dependents: z
    .string()
    .min(1, "Jumlah tanggungan wajib diisi"),
  riskProfile: z
    .enum(["conservative", "moderate", "aggressive"], {
      message: "Profil risiko wajib dipilih",
    }),
});

export type FinancialInfoInput = z.infer<typeof financialInfoSchema>;
export type RegisterInput = PersonalInfoInput & FinancialInfoInput;