import pandas as pd
import numpy as np
from scipy.stats import linregress

file_path = r'C:\Users\User\Downloads\Mortalitas\gaji\Rata-rata gaji tahunan per sektor 2015-2025 (1).xlsx - Rata-rata gaji tahunan per sekt.csv'
df = pd.read_csv(file_path, skiprows=2, nrows=18, header=None)
df.columns = ['Sektor', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']
df.set_index('Sektor', inplace=True)

x = np.arange(11)

print('SECTOR_SALARY_GROWTH = {')
for sector, row in df.iterrows():
    ccgr = (np.log(row['2025'] / row['2015'])) / 10
    
    ln_y = np.log(row.values.astype(float))
    slope, _, _, _, _ = linregress(x, ln_y)
    trendline_growth = np.exp(slope) - 1
    
    print(f'    "{sector}": {{')
    print(f'        "normal": {round(ccgr, 4)},')
    print(f'        "with_pandemic_risk": {round(trendline_growth, 4)}')
    print('    },')
print('}')
