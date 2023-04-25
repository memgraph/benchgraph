==== Benchmark summary Pokec small: Neo4j 5.1 Community vs Memgraph 2.4 Community ====

<table>
  <tr>
    <th>Testcode</th>
    <th>Throughput</th>
    <th>Memory</th>
    <th>Max</th>
    <th>P99</th>
    <th>P90</th>
    <th>P75</th>
    <th>P50</th>
    <th>Mean</th>
  </tr>
  <tr>
    <td>pokec/small/basic/100_30_40_10_20_cold/12</td>
    <td bgcolor="green">3889.173QPS (+10279.70%)</td>
    <td bgcolor="green">165.684MiB (-92.85%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/100_30_40_10_20_hot/12</td>
    <td bgcolor="green">4251.122QPS (+4241.65%)</td>
    <td bgcolor="green">168.176MiB (-92.75%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/100_30_70_0_0_cold/12</td>
    <td bgcolor="green">5422.128QPS (+12187.34%)</td>
    <td bgcolor="green">173.945MiB (-92.50%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/100_30_70_0_0_hot/12</td>
    <td bgcolor="green">13720.586QPS (+6414.85%)</td>
    <td bgcolor="green">170.879MiB (-92.70%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/100_50_50_0_0_cold/12</td>
    <td bgcolor="green">5852.811QPS (+12575.78%)</td>
    <td bgcolor="green">161.051MiB (-93.08%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/100_50_50_0_0_hot/12</td>
    <td bgcolor="green">14071.495QPS (+7498.67%)</td>
    <td bgcolor="green">165.797MiB (-92.86%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/100_70_30_0_0_cold/12</td>
    <td bgcolor="green">5394.747QPS (+12235.76%)</td>
    <td bgcolor="green">181.270MiB (-92.18%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/100_70_30_0_0_hot/12</td>
    <td bgcolor="green">9398.095QPS (+5675.77%)</td>
    <td bgcolor="green">182.035MiB (-92.19%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/aggregate_aggregate_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">1747.763QPS (+4130.67%)</td>
    <td bgcolor="green">178.539MiB (-92.32%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/aggregate_aggregate_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">2025.229QPS (+1438.44%)</td>
    <td bgcolor="green">176.742MiB (-92.37%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/aggregate_aggregate_cold/12</td>
    <td bgcolor="green">1642.321QPS (+873.82%)</td>
    <td bgcolor="green">186.984MiB (-91.94%)</td>
    <td bgcolor="green">13.361ms (-99.23%)</td>
    <td bgcolor="green">5.807ms (-86.47%)</td>
    <td bgcolor="green">5.357ms (-68.63%)</td>
    <td bgcolor="green">5.121ms (-59.35%)</td>
    <td bgcolor="green">5.074ms (-44.86%)</td>
    <td bgcolor="green">5.207ms (-81.78%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/aggregate_aggregate_hot/12</td>
    <td bgcolor="green">1650.050QPS (+304.11%)</td>
    <td bgcolor="green">174.000MiB (-92.51%)</td>
    <td bgcolor="green">12.922ms (-95.18%)</td>
    <td bgcolor="green">9.564ms (-73.48%)</td>
    <td bgcolor="green">6.205ms (-54.43%)</td>
    <td bgcolor="green">5.855ms (-49.08%)</td>
    <td bgcolor="green">5.748ms (-31.94%)</td>
    <td bgcolor="green">5.917ms (-54.03%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/aggregate_count_aggregate_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">2092.705QPS (+4666.38%)</td>
    <td bgcolor="green">181.277MiB (-92.19%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/aggregate_count_aggregate_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">2514.831QPS (+2351.64%)</td>
    <td bgcolor="green">177.926MiB (-92.32%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/aggregate_count_aggregate_cold/12</td>
    <td bgcolor="green">2543.701QPS (+1122.88%)</td>
    <td bgcolor="green">170.059MiB (-92.67%)</td>
    <td bgcolor="green">11.608ms (-99.30%)</td>
    <td bgcolor="green">4.234ms (-83.34%)</td>
    <td bgcolor="green">3.472ms (-68.26%)</td>
    <td bgcolor="green">3.420ms (-55.68%)</td>
    <td bgcolor="green">3.370ms (-52.59%)</td>
    <td bgcolor="green">3.477ms (-85.81%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/aggregate_count_aggregate_hot/12</td>
    <td bgcolor="green">2514.801QPS (+399.29%)</td>
    <td bgcolor="green">168.336MiB (-92.77%)</td>
    <td bgcolor="green">7.056ms (-96.81%)</td>
    <td bgcolor="green">4.131ms (-81.63%)</td>
    <td bgcolor="green">3.510ms (-66.37%)</td>
    <td bgcolor="green">3.470ms (-57.70%)</td>
    <td bgcolor="green">3.432ms (-50.41%)</td>
    <td bgcolor="green">3.484ms (-65.24%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/aggregate_with_filter_aggregate_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">1209.352QPS (+3296.39%)</td>
    <td bgcolor="green">187.535MiB (-91.92%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/aggregate_with_filter_aggregate_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">1304.786QPS (+1301.58%)</td>
    <td bgcolor="green">177.320MiB (-92.36%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/aggregate_with_filter_aggregate_cold/12</td>
    <td bgcolor="green">1283.825QPS (+705.22%)</td>
    <td bgcolor="green">177.809MiB (-92.34%)</td>
    <td bgcolor="green">15.704ms (-99.10%)</td>
    <td bgcolor="green">11.318ms (-78.36%)</td>
    <td bgcolor="green">6.746ms (-60.17%)</td>
    <td bgcolor="green">6.598ms (-50.12%)</td>
    <td bgcolor="green">6.512ms (-23.21%)</td>
    <td bgcolor="green">6.693ms (-76.66%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/aggregate_with_filter_aggregate_hot/12</td>
    <td bgcolor="green">1307.721QPS (+247.50%)</td>
    <td bgcolor="green">173.508MiB (-92.52%)</td>
    <td bgcolor="green">10.479ms (-97.53%)</td>
    <td bgcolor="green">9.311ms (-75.48%)</td>
    <td bgcolor="green">7.082ms (-53.49%)</td>
    <td bgcolor="green">6.775ms (-41.72%)</td>
    <td bgcolor="green">6.630ms (-26.78%)</td>
    <td bgcolor="green">6.742ms (-54.39%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_1_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">6031.884QPS (+13112.28%)</td>
    <td bgcolor="green">161.453MiB (-93.04%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_1_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">11612.786QPS (+7621.39%)</td>
    <td bgcolor="green">165.746MiB (-92.86%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_1_analytical_cold/12</td>
    <td bgcolor="green">32027.829QPS (+11321.27%)</td>
    <td bgcolor="green">186.953MiB (-91.94%)</td>
    <td bgcolor="green">7.469ms (-99.56%)</td>
    <td bgcolor="green">1.086ms (-96.12%)</td>
    <td bgcolor="green">0.520ms (-93.85%)</td>
    <td bgcolor="green">0.427ms (-92.73%)</td>
    <td bgcolor="green">0.348ms (-92.90%)</td>
    <td bgcolor="green">0.460ms (-98.00%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_1_analytical_hot/12</td>
    <td bgcolor="green">32037.412QPS (+5015.94%)</td>
    <td bgcolor="green">184.078MiB (-92.07%)</td>
    <td bgcolor="green">2.465ms (-99.30%)</td>
    <td bgcolor="green">1.180ms (-95.53%)</td>
    <td bgcolor="green">0.523ms (-94.18%)</td>
    <td bgcolor="green">0.436ms (-93.14%)</td>
    <td bgcolor="green">0.335ms (-93.14%)</td>
    <td bgcolor="green">0.404ms (-95.64%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_1_with_filter_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">5857.172QPS (+12554.86%)</td>
    <td bgcolor="green">168.312MiB (-92.75%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_1_with_filter_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">10581.031QPS (+7836.41%)</td>
    <td bgcolor="green">160.805MiB (-93.07%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_1_with_filter_analytical_cold/12</td>
    <td bgcolor="green">32586.548QPS (+12843.56%)</td>
    <td bgcolor="green">199.316MiB (-91.42%)</td>
    <td bgcolor="green">7.921ms (-99.59%)</td>
    <td bgcolor="green">1.267ms (-96.77%)</td>
    <td bgcolor="green">0.564ms (-95.03%)</td>
    <td bgcolor="green">0.508ms (-92.84%)</td>
    <td bgcolor="green">0.421ms (-92.29%)</td>
    <td bgcolor="green">0.533ms (-97.91%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_1_with_filter_analytical_hot/12</td>
    <td bgcolor="green">32169.681QPS (+5429.83%)</td>
    <td bgcolor="green">181.422MiB (-92.17%)</td>
    <td bgcolor="green">2.641ms (-99.35%)</td>
    <td bgcolor="green">0.684ms (-98.27%)</td>
    <td bgcolor="green">0.505ms (-95.53%)</td>
    <td bgcolor="green">0.465ms (-93.08%)</td>
    <td bgcolor="green">0.356ms (-93.07%)</td>
    <td bgcolor="green">0.405ms (-96.05%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_2_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">3759.199QPS (+9483.69%)</td>
    <td bgcolor="green">177.566MiB (-92.33%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_2_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">4435.029QPS (+5160.33%)</td>
    <td bgcolor="green">179.469MiB (-92.26%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_2_analytical_cold/12</td>
    <td bgcolor="green">6140.922QPS (+6510.75%)</td>
    <td bgcolor="green">189.969MiB (-91.80%)</td>
    <td bgcolor="green">9.713ms (-99.49%)</td>
    <td bgcolor="green">6.098ms (-93.07%)</td>
    <td bgcolor="green">3.417ms (-87.57%)</td>
    <td bgcolor="green">2.516ms (-83.83%)</td>
    <td bgcolor="green">1.352ms (-86.12%)</td>
    <td bgcolor="green">1.817ms (-94.40%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_2_analytical_hot/12</td>
    <td bgcolor="green">6266.657QPS (+3748.92%)</td>
    <td bgcolor="green">188.562MiB (-91.88%)</td>
    <td bgcolor="green">6.235ms (-98.93%)</td>
    <td bgcolor="green">5.851ms (-93.06%)</td>
    <td bgcolor="green">3.627ms (-87.37%)</td>
    <td bgcolor="green">2.484ms (-85.28%)</td>
    <td bgcolor="green">1.290ms (-88.48%)</td>
    <td bgcolor="green">1.718ms (-91.62%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_2_with_filter_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">3591.738QPS (+9529.42%)</td>
    <td bgcolor="green">181.324MiB (-92.20%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_2_with_filter_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">4983.164QPS (+6692.28%)</td>
    <td bgcolor="green">171.832MiB (-92.58%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_2_with_filter_analytical_cold/12</td>
    <td bgcolor="green">7485.524QPS (+10279.67%)</td>
    <td bgcolor="green">184.480MiB (-92.06%)</td>
    <td bgcolor="green">8.595ms (-99.57%)</td>
    <td bgcolor="green">6.571ms (-93.62%)</td>
    <td bgcolor="green">3.089ms (-89.13%)</td>
    <td bgcolor="green">2.051ms (-84.83%)</td>
    <td bgcolor="green">1.227ms (-84.46%)</td>
    <td bgcolor="green">1.632ms (-95.06%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_2_with_filter_analytical_hot/12</td>
    <td bgcolor="green">7684.691QPS (+5549.02%)</td>
    <td bgcolor="green">190.809MiB (-91.77%)</td>
    <td bgcolor="green">6.724ms (-98.72%)</td>
    <td bgcolor="green">5.145ms (-95.11%)</td>
    <td bgcolor="green">2.911ms (-88.76%)</td>
    <td bgcolor="green">1.883ms (-86.61%)</td>
    <td bgcolor="green">1.232ms (-85.61%)</td>
    <td bgcolor="green">1.545ms (-91.84%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_3_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">921.535QPS (+3321.52%)</td>
    <td bgcolor="green">219.809MiB (-90.55%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_3_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">992.201QPS (+2199.34%)</td>
    <td bgcolor="green">211.145MiB (-90.93%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_3_analytical_cold/12</td>
    <td bgcolor="green">637.510QPS (+3009.67%)</td>
    <td bgcolor="green">327.672MiB (-85.89%)</td>
    <td bgcolor="green">125.046ms (-94.45%)</td>
    <td bgcolor="green">95.589ms (-62.62%)</td>
    <td bgcolor="green">27.073ms (-77.00%)</td>
    <td bgcolor="green">18.563ms (-74.34%)</td>
    <td bgcolor="green">10.859ms (-75.51%)</td>
    <td bgcolor="green">15.203ms (-80.74%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_3_analytical_hot/12</td>
    <td bgcolor="green">666.311QPS (+2088.91%)</td>
    <td bgcolor="green">326.562MiB (-85.93%)</td>
    <td bgcolor="green">129.365ms (-84.03%)</td>
    <td bgcolor="green">96.279ms (-61.41%)</td>
    <td bgcolor="green">28.008ms (-74.37%)</td>
    <td bgcolor="green">18.503ms (-74.52%)</td>
    <td bgcolor="green">10.830ms (-77.25%)</td>
    <td bgcolor="green">15.085ms (-76.15%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_3_with_filter_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">637.001QPS (+2201.09%)</td>
    <td bgcolor="green">236.051MiB (-89.86%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_3_with_filter_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">648.992QPS (+1641.69%)</td>
    <td bgcolor="green">232.445MiB (-89.98%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_3_with_filter_analytical_cold/12</td>
    <td bgcolor="green">723.913QPS (+3567.66%)</td>
    <td bgcolor="green">302.707MiB (-86.96%)</td>
    <td bgcolor="green">52.629ms (-97.64%)</td>
    <td bgcolor="green">43.885ms (-85.58%)</td>
    <td bgcolor="green">23.564ms (-70.26%)</td>
    <td bgcolor="green">15.904ms (-72.17%)</td>
    <td bgcolor="green">8.578ms (-74.94%)</td>
    <td bgcolor="green">11.817ms (-81.63%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_3_with_filter_analytical_hot/12</td>
    <td bgcolor="green">738.864QPS (+2103.62%)</td>
    <td bgcolor="green">279.297MiB (-87.97%)</td>
    <td bgcolor="green">56.216ms (-93.26%)</td>
    <td bgcolor="green">41.433ms (-87.04%)</td>
    <td bgcolor="green">23.750ms (-70.96%)</td>
    <td bgcolor="green">15.768ms (-71.41%)</td>
    <td bgcolor="green">8.313ms (-75.09%)</td>
    <td bgcolor="green">11.564ms (-76.74%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_4_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">94.016QPS (+446.59%)</td>
    <td bgcolor="green">889.969MiB (-65.47%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_4_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">96.519QPS (+347.57%)</td>
    <td bgcolor="green">910.461MiB (-67.51%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_4_analytical_cold/12</td>
    <td bgcolor="green">44.134QPS (+591.53%)</td>
    <td bgcolor="green">1071.566MiB (-55.64%)</td>
    <td bgcolor="green">1771.453ms (-33.24%)</td>
    <td bgcolor="green">1006.273ms (-55.23%)</td>
    <td bgcolor="green">456.093ms (-28.17%)</td>
    <td bgcolor="green">226.458ms (-34.59%)</td>
    <td bgcolor="green">105.948ms (-37.88%)</td>
    <td bgcolor="green">195.854ms (-38.49%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_4_analytical_hot/12</td>
    <td bgcolor="green">44.628QPS (+402.21%)</td>
    <td bgcolor="green">1062.504MiB (-61.20%)</td>
    <td bgcolor="green">1712.303ms (-23.17%)</td>
    <td bgcolor="green">993.564ms (-30.60%)</td>
    <td bgcolor="green">452.268ms (-27.93%)</td>
    <td bgcolor="green">225.833ms (-35.37%)</td>
    <td bgcolor="green">107.924ms (-37.44%)</td>
    <td bgcolor="green">192.966ms (-36.41%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_4_with_filter_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">50.746QPS (+301.12%)</td>
    <td bgcolor="green">909.152MiB (-68.69%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_4_with_filter_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">52.914QPS (+233.25%)</td>
    <td bgcolor="green">945.742MiB (-66.94%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_4_with_filter_analytical_cold/12</td>
    <td bgcolor="green">50.943QPS (+1154.67%)</td>
    <td bgcolor="green">686.367MiB (-70.43%)</td>
    <td bgcolor="green">4336.900ms (-23.11%)</td>
    <td bgcolor="green">915.601ms (-71.10%)</td>
    <td bgcolor="green">519.487ms (-36.70%)</td>
    <td bgcolor="green">219.941ms (-38.44%)</td>
    <td bgcolor="green">106.916ms (-45.62%)</td>
    <td bgcolor="green">212.004ms (-40.38%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/expansion_4_with_filter_analytical_hot/12</td>
    <td bgcolor="green">45.731QPS (+580.41%)</td>
    <td bgcolor="green">708.352MiB (-69.48%)</td>
    <td bgcolor="green">4346.829ms (-26.14%)</td>
    <td bgcolor="green">914.314ms (-47.96%)</td>
    <td bgcolor="green">515.113ms (-38.88%)</td>
    <td bgcolor="green">219.955ms (-41.58%)</td>
    <td bgcolor="green">103.211ms (-47.92%)</td>
    <td bgcolor="green">213.389ms (-39.24%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/min_max_avg_aggregate_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">1400.655QPS (+3195.30%)</td>
    <td bgcolor="green">173.461MiB (-92.57%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/min_max_avg_aggregate_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">1589.416QPS (+1512.76%)</td>
    <td bgcolor="green">170.723MiB (-92.65%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/min_max_avg_aggregate_cold/12</td>
    <td bgcolor="green">1162.203QPS (+406.96%)</td>
    <td bgcolor="green">177.117MiB (-92.38%)</td>
    <td bgcolor="green">15.309ms (-99.09%)</td>
    <td bgcolor="green">7.986ms (-73.06%)</td>
    <td bgcolor="green">7.489ms (-36.27%)</td>
    <td bgcolor="green">7.300ms (-24.72%)</td>
    <td bgcolor="green">7.232ms (-16.42%)</td>
    <td bgcolor="green">7.342ms (-72.16%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/min_max_avg_aggregate_hot/12</td>
    <td bgcolor="green">1213.036QPS (+158.56%)</td>
    <td bgcolor="green">173.770MiB (-92.51%)</td>
    <td bgcolor="green">10.212ms (-96.61%)</td>
    <td bgcolor="green">7.826ms (-83.99%)</td>
    <td bgcolor="green">7.315ms (-36.71%)</td>
    <td bgcolor="green">7.246ms (-20.75%)</td>
    <td bgcolor="green">7.197ms (-8.61%)</td>
    <td bgcolor="green">7.238ms (-41.71%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">2337.431QPS (+5894.09%)</td>
    <td bgcolor="green">174.164MiB (-92.55%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">3182.771QPS (+3833.54%)</td>
    <td bgcolor="green">187.027MiB (-91.98%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_analytical_cold/12</td>
    <td bgcolor="green">5905.769QPS (+7926.35%)</td>
    <td bgcolor="green">198.312MiB (-91.45%)</td>
    <td bgcolor="green">13.788ms (-99.26%)</td>
    <td bgcolor="green">6.114ms (-92.78%)</td>
    <td bgcolor="green">3.986ms (-85.28%)</td>
    <td bgcolor="green">2.779ms (-83.90%)</td>
    <td bgcolor="green">1.738ms (-84.80%)</td>
    <td bgcolor="green">2.075ms (-93.78%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_analytical_hot/12</td>
    <td bgcolor="green">6080.485QPS (+4033.97%)</td>
    <td bgcolor="green">204.016MiB (-91.23%)</td>
    <td bgcolor="green">6.623ms (-98.74%)</td>
    <td bgcolor="green">6.003ms (-93.84%)</td>
    <td bgcolor="green">3.945ms (-82.99%)</td>
    <td bgcolor="green">2.684ms (-83.77%)</td>
    <td bgcolor="green">1.765ms (-82.06%)</td>
    <td bgcolor="green">2.008ms (-89.50%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_with_data_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">1706.300QPS (+4348.34%)</td>
    <td bgcolor="green">180.508MiB (-92.23%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_with_data_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">1783.632QPS (+2098.45%)</td>
    <td bgcolor="green">189.191MiB (-91.86%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_with_data_analytical_cold/12</td>
    <td bgcolor="green">1881.357QPS (+7358.08%)</td>
    <td bgcolor="green">206.215MiB (-91.17%)</td>
    <td bgcolor="green">19.225ms (-99.07%)</td>
    <td bgcolor="green">10.029ms (-92.61%)</td>
    <td bgcolor="green">5.748ms (-80.90%)</td>
    <td bgcolor="green">3.627ms (-77.44%)</td>
    <td bgcolor="green">1.927ms (-79.46%)</td>
    <td bgcolor="green">2.993ms (-91.46%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_with_data_analytical_hot/12</td>
    <td bgcolor="green">1901.208QPS (+3395.74%)</td>
    <td bgcolor="green">212.703MiB (-90.83%)</td>
    <td bgcolor="green">13.330ms (-98.17%)</td>
    <td bgcolor="green">11.506ms (-90.13%)</td>
    <td bgcolor="green">5.726ms (-82.32%)</td>
    <td bgcolor="green">3.720ms (-75.81%)</td>
    <td bgcolor="green">1.994ms (-77.98%)</td>
    <td bgcolor="green">2.910ms (-86.52%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_with_data_and_filter_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">1918.603QPS (+5060.57%)</td>
    <td bgcolor="green">180.660MiB (-92.25%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_with_data_and_filter_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">2207.646QPS (+2710.27%)</td>
    <td bgcolor="green">194.809MiB (-91.61%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_with_data_and_filter_analytical_cold/12</td>
    <td bgcolor="green">2673.975QPS (+3334.34%)</td>
    <td bgcolor="green">199.031MiB (-91.45%)</td>
    <td bgcolor="green">12.382ms (-99.34%)</td>
    <td bgcolor="green">8.692ms (-90.46%)</td>
    <td bgcolor="green">5.025ms (-85.54%)</td>
    <td bgcolor="green">3.295ms (-78.66%)</td>
    <td bgcolor="green">2.374ms (-75.21%)</td>
    <td bgcolor="green">2.683ms (-91.98%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_with_data_and_filter_analytical_hot/12</td>
    <td bgcolor="green">2686.283QPS (+1865.41%)</td>
    <td bgcolor="green">197.965MiB (-91.46%)</td>
    <td bgcolor="green">8.667ms (-98.51%)</td>
    <td bgcolor="green">7.081ms (-93.20%)</td>
    <td bgcolor="green">4.887ms (-88.95%)</td>
    <td bgcolor="green">3.335ms (-82.50%)</td>
    <td bgcolor="green">2.172ms (-81.96%)</td>
    <td bgcolor="green">2.608ms (-88.89%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_with_filter_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">2564.164QPS (+6409.39%)</td>
    <td bgcolor="green">186.008MiB (-91.98%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_with_filter_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">3437.138QPS (+3967.26%)</td>
    <td bgcolor="green">188.113MiB (-91.92%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_with_filter_analytical_cold/12</td>
    <td bgcolor="green">7124.463QPS (+8189.17%)</td>
    <td bgcolor="green">201.184MiB (-91.32%)</td>
    <td bgcolor="green">12.334ms (-99.39%)</td>
    <td bgcolor="green">8.660ms (-92.42%)</td>
    <td bgcolor="green">2.629ms (-86.26%)</td>
    <td bgcolor="green">1.638ms (-84.79%)</td>
    <td bgcolor="green">1.088ms (-85.81%)</td>
    <td bgcolor="green">1.531ms (-95.27%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/neighbours_2_with_filter_analytical_hot/12</td>
    <td bgcolor="green">7164.850QPS (+4070.37%)</td>
    <td bgcolor="green">200.977MiB (-91.34%)</td>
    <td bgcolor="green">8.513ms (-98.47%)</td>
    <td bgcolor="green">7.160ms (-93.38%)</td>
    <td bgcolor="green">2.773ms (-85.23%)</td>
    <td bgcolor="green">1.584ms (-84.30%)</td>
    <td bgcolor="green">1.094ms (-84.46%)</td>
    <td bgcolor="green">1.461ms (-91.45%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/pattern_cycle_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">5540.934QPS (+12843.93%)</td>
    <td bgcolor="green">175.047MiB (-92.44%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/pattern_cycle_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">12217.603QPS (+9686.62%)</td>
    <td bgcolor="green">170.453MiB (-92.67%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/pattern_cycle_analytical_cold/12</td>
    <td bgcolor="green">24094.027QPS (+9777.40%)</td>
    <td bgcolor="green">188.777MiB (-91.86%)</td>
    <td bgcolor="green">8.039ms (-99.54%)</td>
    <td bgcolor="green">1.448ms (-96.18%)</td>
    <td bgcolor="green">0.724ms (-93.68%)</td>
    <td bgcolor="green">0.545ms (-93.57%)</td>
    <td bgcolor="green">0.472ms (-91.79%)</td>
    <td bgcolor="green">0.588ms (-97.64%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/pattern_cycle_analytical_hot/12</td>
    <td bgcolor="green">24895.757QPS (+4471.87%)</td>
    <td bgcolor="green">174.668MiB (-92.51%)</td>
    <td bgcolor="green">2.063ms (-99.48%)</td>
    <td bgcolor="green">1.481ms (-96.17%)</td>
    <td bgcolor="green">0.694ms (-94.00%)</td>
    <td bgcolor="green">0.576ms (-93.23%)</td>
    <td bgcolor="green">0.466ms (-92.68%)</td>
    <td bgcolor="green">0.529ms (-95.58%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/pattern_long_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">5504.991QPS (+11751.06%)</td>
    <td bgcolor="green">171.887MiB (-92.63%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/pattern_long_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">9542.405QPS (+8420.74%)</td>
    <td bgcolor="green">175.293MiB (-92.45%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/pattern_long_analytical_cold/12</td>
    <td bgcolor="green">33793.634QPS (+5091.63%)</td>
    <td bgcolor="green">200.137MiB (-91.38%)</td>
    <td bgcolor="green">8.692ms (-99.55%)</td>
    <td bgcolor="green">1.234ms (-93.33%)</td>
    <td bgcolor="green">0.525ms (-92.72%)</td>
    <td bgcolor="green">0.461ms (-91.34%)</td>
    <td bgcolor="green">0.420ms (-90.15%)</td>
    <td bgcolor="green">0.542ms (-97.77%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/pattern_long_analytical_hot/12</td>
    <td bgcolor="green">33371.211QPS (+2593.89%)</td>
    <td bgcolor="green">194.586MiB (-91.62%)</td>
    <td bgcolor="green">2.517ms (-99.52%)</td>
    <td bgcolor="green">1.138ms (-93.19%)</td>
    <td bgcolor="green">0.518ms (-92.31%)</td>
    <td bgcolor="green">0.461ms (-91.58%)</td>
    <td bgcolor="green">0.414ms (-91.13%)</td>
    <td bgcolor="green">0.458ms (-95.59%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/pattern_short_analytical_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">4770.479QPS (+9760.19%)</td>
    <td bgcolor="green">169.930MiB (-92.69%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/pattern_short_analytical_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">11308.486QPS (+6495.50%)</td>
    <td bgcolor="green">162.824MiB (-92.99%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/pattern_short_analytical_cold/12</td>
    <td bgcolor="green">35484.560QPS (+4462.64%)</td>
    <td bgcolor="green">196.160MiB (-91.54%)</td>
    <td bgcolor="green">7.908ms (-99.54%)</td>
    <td bgcolor="green">1.204ms (-91.11%)</td>
    <td bgcolor="green">0.435ms (-94.44%)</td>
    <td bgcolor="green">0.394ms (-94.02%)</td>
    <td bgcolor="green">0.338ms (-94.23%)</td>
    <td bgcolor="green">0.454ms (-98.03%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/pattern_short_analytical_hot/12</td>
    <td bgcolor="green">36515.177QPS (+2121.36%)</td>
    <td bgcolor="green">186.449MiB (-91.96%)</td>
    <td bgcolor="green">1.885ms (-99.37%)</td>
    <td bgcolor="green">1.063ms (-90.59%)</td>
    <td bgcolor="green">0.430ms (-93.41%)</td>
    <td bgcolor="green">0.363ms (-93.63%)</td>
    <td bgcolor="green">0.321ms (-93.41%)</td>
    <td bgcolor="green">0.364ms (-95.45%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/single_edge_write_write_cold/12</td>
    <td bgcolor="green">31680.710QPS (+17707.06%)</td>
    <td bgcolor="green">215.395MiB (-90.76%)</td>
    <td bgcolor="green">9.127ms (-99.50%)</td>
    <td bgcolor="green">1.173ms (-94.97%)</td>
    <td bgcolor="green">0.472ms (-97.09%)</td>
    <td bgcolor="green">0.430ms (-97.13%)</td>
    <td bgcolor="green">0.406ms (-96.07%)</td>
    <td bgcolor="green">0.511ms (-98.32%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/single_edge_write_write_hot/12</td>
    <td bgcolor="green">32721.490QPS (+9524.19%)</td>
    <td bgcolor="green">210.508MiB (-90.92%)</td>
    <td bgcolor="green">2.953ms (-99.17%)</td>
    <td bgcolor="green">1.144ms (-95.99%)</td>
    <td bgcolor="green">0.498ms (-97.08%)</td>
    <td bgcolor="green">0.452ms (-96.65%)</td>
    <td bgcolor="green">0.414ms (-96.49%)</td>
    <td bgcolor="green">0.448ms (-97.19%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/single_vertex_property_update_update_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">1884.386QPS (+4375.75%)</td>
    <td bgcolor="green">168.961MiB (-92.73%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/single_vertex_property_update_update_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">2176.923QPS (+1954.48%)</td>
    <td bgcolor="green">167.184MiB (-92.79%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/single_vertex_property_update_update_cold/12</td>
    <td bgcolor="green">2138.481QPS (+1174.01%)</td>
    <td bgcolor="green">173.711MiB (-92.51%)</td>
    <td bgcolor="green">9.712ms (-99.46%)</td>
    <td bgcolor="green">4.728ms (-82.52%)</td>
    <td bgcolor="green">3.987ms (-77.50%)</td>
    <td bgcolor="green">3.947ms (-73.99%)</td>
    <td bgcolor="green">3.874ms (-66.61%)</td>
    <td bgcolor="green">3.956ms (-87.38%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/single_vertex_property_update_update_hot/12</td>
    <td bgcolor="green">2173.149QPS (+617.72%)</td>
    <td bgcolor="green">168.191MiB (-92.78%)</td>
    <td bgcolor="green">6.220ms (-98.56%)</td>
    <td bgcolor="green">4.554ms (-83.45%)</td>
    <td bgcolor="green">4.033ms (-77.70%)</td>
    <td bgcolor="green">3.946ms (-73.38%)</td>
    <td bgcolor="green">3.891ms (-70.06%)</td>
    <td bgcolor="green">3.939ms (-77.12%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/single_vertex_read_read_100_30_0_0_0_70_cold/12</td>
    <td bgcolor="green">5464.708QPS (+11499.09%)</td>
    <td bgcolor="green">168.496MiB (-92.74%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/single_vertex_read_read_100_30_0_0_0_70_hot/12</td>
    <td bgcolor="green">10976.641QPS (+5471.01%)</td>
    <td bgcolor="green">163.621MiB (-92.94%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/single_vertex_read_read_cold/12</td>
    <td bgcolor="green">36729.555QPS (+4292.98%)</td>
    <td bgcolor="green">169.859MiB (-92.69%)</td>
    <td bgcolor="green">6.619ms (-99.59%)</td>
    <td bgcolor="green">1.151ms (-91.62%)</td>
    <td bgcolor="green">0.452ms (-93.93%)</td>
    <td bgcolor="green">0.396ms (-93.13%)</td>
    <td bgcolor="green">0.354ms (-92.85%)</td>
    <td bgcolor="green">0.442ms (-97.96%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/single_vertex_read_read_hot/12</td>
    <td bgcolor="green">37923.704QPS (+1682.48%)</td>
    <td bgcolor="green">167.059MiB (-92.83%)</td>
    <td bgcolor="green">1.573ms (-99.38%)</td>
    <td bgcolor="green">1.048ms (-90.55%)</td>
    <td bgcolor="green">0.437ms (-93.67%)</td>
    <td bgcolor="green">0.364ms (-93.74%)</td>
    <td bgcolor="green">0.324ms (-93.43%)</td>
    <td bgcolor="green">0.368ms (-95.29%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/single_vertex_write_write_cold/12</td>
    <td bgcolor="green">35692.163QPS (+16422.45%)</td>
    <td bgcolor="green">199.426MiB (-91.40%)</td>
    <td bgcolor="green">6.834ms (-99.59%)</td>
    <td bgcolor="green">1.268ms (-94.16%)</td>
    <td bgcolor="green">0.462ms (-95.80%)</td>
    <td bgcolor="green">0.391ms (-96.10%)</td>
    <td bgcolor="green">0.349ms (-96.35%)</td>
    <td bgcolor="green">0.462ms (-98.25%)</td>
  </tr>
  <tr>
    <td>pokec/small/basic/single_vertex_write_write_hot/12</td>
    <td bgcolor="green">36193.696QPS (+6799.59%)</td>
    <td bgcolor="green">197.113MiB (-91.51%)</td>
    <td bgcolor="green">1.690ms (-99.39%)</td>
    <td bgcolor="green">1.035ms (-93.75%)</td>
    <td bgcolor="green">0.408ms (-96.79%)</td>
    <td bgcolor="green">0.364ms (-96.50%)</td>
    <td bgcolor="green">0.312ms (-96.86%)</td>
    <td bgcolor="green">0.347ms (-97.25%)</td>
  </tr>
</table>
