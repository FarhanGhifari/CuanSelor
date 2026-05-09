import streamlit as st
import sys
import os
import pandas as pd
import plotly.express as px

# Pastikan path python mengenali folder src
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.calculator import RetirementCalculator, UserProfile
from src.config import SECTOR_SALARY_GROWTH, RISK_PROFILES
from src.actuarial import get_mortality_table

st.set_page_config(
    page_title="Gen Z Retirement Calculator",
    page_icon="🔮",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- Custom CSS ---
st.markdown("""
<style>
    .metric-card {
        background-color: #1e1e1e;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    .metric-value {
        font-size: 24px;
        font-weight: bold;
        color: #00ffcc;
    }
    .metric-label {
        font-size: 14px;
        color: #aaaaaa;
    }
    .ruin-high { color: #ff4b4b !important; }
    .ruin-low { color: #00ffcc !important; }
</style>
""", unsafe_allow_html=True)

# --- HEADER ---
st.title("🔮 AI Financial Advisor: Retirement Calculator")
st.markdown("Kalkulator pensiun **probabilistik** berbasis *Monte Carlo Simulation* (10.000 iterasi). Memperhitungkan data aktuaria BPJS (TMPI 2023), model inflasi stokastik BPS, dan volatilitas pasar nyata.")

# --- SIDEBAR INPUTS ---
with st.sidebar:
    st.header("1. Data Pribadi")
    name = st.text_input("Nama", value="Rizky")
    age = st.number_input("Usia Saat Ini", min_value=18, max_value=60, value=25)
    gender = st.selectbox("Jenis Kelamin", options=["male", "female"], format_func=lambda x: "Laki-laki" if x == "male" else "Perempuan")
    
    st.header("2. Finansial")
    monthly_salary = st.number_input("Gaji Bulanan (Rp)", min_value=1_000_000, value=8_000_000, step=1_000_000)
    annual_bonus_months = st.slider("Bonus/THR (Berapa kali gaji per tahun?)", min_value=0.0, max_value=6.0, value=1.0, step=0.5)
    savings_rate = st.slider("Persentase Nabung/Investasi (%)", min_value=0, max_value=100, value=20) / 100.0
    current_assets = st.number_input("Dana Investasi Saat Ini (Uang Dingin Rp)", min_value=0, value=0, step=5_000_000, help="Uang yang memang dialokasikan murni untuk masa tua, bukan dana darurat.")
    
    st.header("3. Target Pensiun & Usia Harapan Hidup")
    retirement_age = st.number_input("Target Usia Pensiun", min_value=age+1, max_value=80, value=55)
    replacement_ratio = st.slider("Target Gaya Hidup Pensiun (% dari gaji terakhir)", min_value=30, max_value=150, value=70, step=5, help="Standar: 70%. Frugal: 40-50%. Mewah: >100%.")
    has_health_insurance = st.checkbox("Sudah Punya Asuransi Kesehatan Purna Jual?", value=False, help="Jika tidak dicentang, dana pensiun akan dihantam inflasi medis tinggi (>10%/thn) di atas usia 65 tahun.")
    
    # Hitung umur harapan hidup secara dinamis
    mt = get_mortality_table()
    act_sum = mt.get_planning_summary(age, retirement_age, gender)
    default_p90 = act_sum["p90_survival_age"]
    p50_age = act_sum["p50_survival_age"]
    exp_age = act_sum["expected_death_age"]
    
    st.info(f"💡 **Aktuaria Info**: Rata-rata meninggal di usia **{exp_age:.1f}**, tapi 50% bertahan hingga **{p50_age}**, dan 10% bertahan hingga **{default_p90}**.")
    
    custom_planning_age = st.slider("Rencanakan Dana Hingga Usia", min_value=retirement_age+1, max_value=110, value=default_p90, help="Saran aktuaris: Gunakan P90 agar aman dari risiko umur panjang.")
    
    risk_options = list(RISK_PROFILES.keys())
    risk_format = {k: RISK_PROFILES[k]["label"] for k in risk_options}
    risk_profile = st.selectbox("Profil Risiko Investasi", options=risk_options, format_func=lambda x: risk_format[x], index=1)
    
    st.header("4. Asumsi Lanjutan (Advanced)")
    sector_list = list(SECTOR_SALARY_GROWTH.keys())
    sector = st.selectbox("Sektor Pekerjaan (BPS)", options=sector_list, index=sector_list.index("Rata-Rata"))
    
    include_pandemic_risk = st.checkbox("Gunakan Risiko Pandemi/Krisis (Trendline Growth)", value=True, help="Jika dicentang, menggunakan growth rate pesimis (historis termasuk masa drop covid).")
    
    custom_deposit = st.number_input("Bunga Deposito / Bank Digital (% per tahun)", min_value=1.0, max_value=15.0, value=5.0, step=0.5)

    run_sim = st.button("🚀 Jalankan Simulasi (Monte Carlo)", use_container_width=True, type="primary")

# --- MAIN LOGIC ---
if run_sim:
    profile = UserProfile(
        name=name,
        age=age,
        gender=gender,
        monthly_salary=monthly_salary,
        savings_rate=savings_rate,
        retirement_age=retirement_age,
        risk_profile=risk_profile,
        sector=sector,
        include_pandemic_risk=include_pandemic_risk,
        custom_deposit_rate=custom_deposit,
        custom_planning_age=custom_planning_age,
        current_assets=float(current_assets),
        annual_bonus_months=float(annual_bonus_months),
        replacement_ratio=replacement_ratio / 100.0,
        has_health_insurance=has_health_insurance
    )
    
    with st.spinner('Memutar waktu 10.000 alam semesta paralel... Mohon tunggu (~5 detik)'):
        calc = RetirementCalculator(n_simulations=10_000)
        res = calc.calculate(profile)
        
    st.success("Simulasi selesai!")
    
    # 1. Ringkasan Aktuaria & Asumsi
    st.subheader("📊 Fundamental Asumsi Anda")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown(f"<div class='metric-card'><div class='metric-label'>Usia Harapan Hidup (P50)</div><div class='metric-value'>{res.actuarial_summary['p50_survival_age']} Tahun</div></div>", unsafe_allow_html=True)
    with col2:
        st.markdown(f"<div class='metric-card'><div class='metric-label'>Horizon Pensiun Paling Ekstrem (P90)</div><div class='metric-value'>{res.actuarial_summary['p90_survival_age']} Tahun</div><small style='color:#ccc'>Kita merencanakan dana sampai usia ini.</small></div>", unsafe_allow_html=True)
    with col3:
        st.markdown(f"<div class='metric-card'><div class='metric-label'>Status Risiko Umur Panjang</div><div class='metric-value' style='color:#ff4b4b'>{'Tinggi' if res.actuarial_summary['longevity_risk_flag'] else 'Aman'}</div></div>", unsafe_allow_html=True)

    # 2. Hasil Proyeksi
    st.subheader("💰 Hasil Proyeksi Dana Saat Pensiun (Umur {age} → {ret_age})".format(age=age, ret_age=retirement_age))
    
    tab1, tab2, tab3, tab4 = st.tabs(["Skenario Median (P50)", "Skenario Pesimis (P10)", "Skenario Optimis (P90)", "📈 Visualisasi Grafik"])
    
    def render_scenario_tab(scen_key):
        # res.projection is a dict where values are dicts (since we serialize with asdict)
        data = res.projection[scen_key]
        ruin_prob = data['ruin_probability']
        fund_ret = data['fund_at_retirement']
        ann_with = data['annual_withdrawal_capacity']
        dep_age = data.get('fund_depleted_age')

        ruin_color = "ruin-high" if ruin_prob > 0.5 else "ruin-low"
        
        c1, c2 = st.columns(2)
        with c1:
            st.metric("Dana Terkumpul (Nominal)", f"Rp {fund_ret:,.0f}".replace(",", "."))
            st.metric("Kapasitas Penarikan Bulanan (Real)", f"Rp {(ann_with/12):,.0f}".replace(",", ".") + " / bulan")
            if dep_age:
                st.warning(f"⚠️ Dana diperkirakan **HABIS** di usia **{dep_age}** tahun.")
            else:
                st.success("✅ Dana cukup seumur hidup (hingga usia P90).")
        with c2:
            st.markdown(f"""
            <div style='text-align:center; padding: 20px; background:#2b2b2b; border-radius:10px;'>
                <h4>Peluang Kebangkrutan (Ruin Prob)</h4>
                <h1 class='{ruin_color}' style='font-size:48px;'>{ruin_prob*100:.1f}%</h1>
                <p>Peluang dana habis sebelum usia {custom_planning_age} tahun.</p>
            </div>
            """, unsafe_allow_html=True)
            
    with tab1: render_scenario_tab("median_p50")
    with tab2: render_scenario_tab("pessimistic_p10")
    with tab3: render_scenario_tab("optimistic_p90")
    
    with tab4:
        st.markdown("### 📈 Visualisasi Distribusi Monte Carlo (Nilai dalam Rupiah)")
        st.info("💡 Grafik di bawah menunjukkan estimasi saldo tabungan Anda dalam mata uang Rupiah (IDR) seiring bertambahnya usia.")
        plan_horizon = custom_planning_age
        
        def build_trajectory(scen_key, label_name):
            data = res.projection[scen_key]
            traj = {}
            # Phase 1: Accumulation
            for y in range(age, retirement_age + 1):
                progress = (y - age) / max(retirement_age - age, 1)
                val = current_assets * (1 - progress) + data['fund_at_retirement'] * (progress ** 2)
                traj[y] = val
                
            # Phase 2: Decumulation
            depleted_age = data.get('fund_depleted_age')
            end_age = depleted_age if depleted_age else plan_horizon
            
            if end_age > retirement_age:
                for y in range(retirement_age + 1, end_age + 1):
                    progress = (y - retirement_age) / max(end_age - retirement_age, 1)
                    val = data['fund_at_retirement'] * ((1 - progress) ** 1.5)
                    traj[y] = val
                    
            if end_age < plan_horizon:
                for y in range(end_age + 1, plan_horizon + 1):
                    traj[y] = 0.0
            
            return pd.Series(traj, name=label_name)

        s_p10 = build_trajectory("pessimistic_p10", "P10 (Pesimis)")
        s_p50 = build_trajectory("median_p50", "P50 (Median)")
        s_p90 = build_trajectory("optimistic_p90", "P90 (Optimis)")
        
        df_plot = pd.concat([s_p90, s_p50, s_p10], axis=1).reset_index().rename(columns={"index": "Umur"})
        # Mengubah bentuk data untuk Plotly
        df_melt = df_plot.melt(id_vars=["Umur"], var_name="Skenario", value_name="Saldo")
        
        fig = px.line(df_melt, x="Umur", y="Saldo", color="Skenario",
                      title="Proyeksi Dana Pensiun (Rupiah)",
                      labels={"Saldo": "Saldo Dana (Rp)"})
        
        # Format axes dan tooltip
        fig.update_layout(
            hovermode="x unified",
            yaxis_tickformat=",.0f"
        )
        fig.update_traces(
            hovertemplate="Rp %{y:,.0f}<extra></extra>"
        )
        # Hack untuk mengganti koma jadi titik di plotly
        # Format string 'separators' adalah '{decimal}{thousands}'
        # Standar Indonesia: koma untuk desimal, titik untuk ribuan -> ',.'
        st.plotly_chart(fig, use_container_width=True, config={'separators': ',.'})
        st.caption(f"*Grafik ini adalah interpolasi visual untuk menggambarkan rentang (range) kemungkinan perjalanan dana Anda dari umur {age} ke {plan_horizon}.")

    st.divider()

    # 3. Insights & A/B Testing
    colA, colB = st.columns(2)
    
    with colA:
        st.subheader("🔬 A/B Test: Strategi Investasi")
        ab = res.ab_test_result
        st.markdown(f"Apakah strategi **Glide Path** (otomatis pindah ke aset konservatif mendekati pensiun) lebih baik dari strategi Statis (Fixed)?")
        st.info(f"**Pemenang: {ab['winner']}**")
        st.markdown(f"- **Ruin Prob (Fixed):** {ab['strategy_a_fixed']['ruin_probability']*100:.1f}%\n- **Ruin Prob (Glide Path):** {ab['strategy_b_glide_path']['ruin_probability']*100:.1f}%")
        st.caption(f"P-Value: {ab['p_value']} (Signifikan: {ab['statistically_significant']})")
        
    with colB:
        st.subheader("💡 Actionable Insights")
        for i, insight in enumerate(res.actionable_insights, 1):
            st.markdown(f"**{i}.** {insight}")
            
else:
    st.info("👈 Silakan isi parameter di sidebar dan klik **Jalankan Simulasi** untuk melihat hasil.")
