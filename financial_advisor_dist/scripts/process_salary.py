import pandas as pd
import numpy as np

# Baca file CSV
file_path = r'C:\Users\User\Downloads\Mortalitas\gaji\Rata-rata gaji tahunan per sektor 2015-2025 (1).xlsx - Rata-rata gaji tahunan per sekt.csv'
df = pd.read_csv(file_path, skiprows=2, nrows=18, header=None)

# The columns based on the file content are:
# Sektor, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025
df.columns = ['Sektor', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']

df.set_index('Sektor', inplace=True)

print('\n--- Pertumbuhan Gaji per Sektor (CCGR) ---')
# Hitung CCGR 10 Tahun (2015-2025)
df['CCGR_10Y'] = (np.log(df['2025'] / df['2015'])) / 10
# Hitung CCGR Pre-Pandemic (2015-2019)
df['CCGR_Pre'] = (np.log(df['2019'] / df['2015'])) / 4
# Hitung CCGR Post-Pandemic (2022-2025)
df['CCGR_Post'] = (np.log(df['2025'] / df['2022'])) / 3

for sector, row in df.iterrows():
    print(f"{sector[:40]:<40} : 10Y={row['CCGR_10Y']*100:.2f}%  Pre={row['CCGR_Pre']*100:.2f}%  Post={row['CCGR_Post']*100:.2f}%")

print('\n--- Copy Paste to config.py ---')
print('SECTOR_SALARY_GROWTH = {')
for sector, row in df.iterrows():
    rate = row['CCGR_10Y']
    # Tambahkan Gen-Z Career Premium 1.5%
    final_rate = round(rate + 0.015, 4)
    print(f'    "{sector}": {final_rate},')
print('}')
