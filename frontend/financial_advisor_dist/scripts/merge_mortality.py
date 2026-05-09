"""Merge TMPI 2023 male/female CSV into single mortality_bpjs.csv"""
import pandas as pd

src_dir = r"C:\Users\User\Downloads\Mortalitas\TMPI 23"
dst = r"C:\Users\User\.gemini\antigravity\scratch\financial_advisor\data\raw\mortality_bpjs.csv"

df_m = pd.read_csv(f"{src_dir}\\Tabel Mortalitas Penduduk Indonesia Laki-laki (TMPI) 2023.csv")
df_f = pd.read_csv(f"{src_dir}\\Tabel Mortalitas Penduduk Indonesia Perempuan (TMPI) 2023.csv")

merged = df_m[["x", "qx"]].rename(columns={"x": "age", "qx": "qx_male"})
merged["qx_female"] = df_f["qx"]
merged["px_male"]   = df_m["px"]
merged["px_female"] = df_f["px"]
merged["ex_male"]   = df_m["ex"]
merged["ex_female"] = df_f["ex"]
merged["Ex_male"]   = df_m["Ex"]
merged["Ex_female"] = df_f["Ex"]
merged["dx_male"]   = df_m["dx"]
merged["dx_female"] = df_f["dx"]

merged.to_csv(dst, index=False)

print(f"Saved {len(merged)} rows (age {merged.age.min()} to {merged.age.max()})")
print(f"qx_male range:   {merged.qx_male.min():.6f} - {merged.qx_male.max():.6f}")
print(f"qx_female range: {merged.qx_female.min():.6f} - {merged.qx_female.max():.6f}")
print()
print("Crosscheck ex at age 0:")
m_ex0 = merged.loc[merged.age == 0, "ex_male"].values[0]
f_ex0 = merged.loc[merged.age == 0, "ex_female"].values[0]
print(f"  Male   ex=0: {m_ex0} (BPS summary: 73.74)")
print(f"  Female ex=0: {f_ex0} (BPS summary: 78.37)")
print()
print("Sample at age 25:")
print(merged[merged.age == 25].to_string(index=False))
print()
print("Done! mortality_bpjs.csv updated with TMPI 2023 data.")
