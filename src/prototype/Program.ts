///<reference path='References.ts' />
///<reference path='..\compiler\parser.ts' />

var stringTable = new StringTable();

var specificFile = 
    // "S7.9_A5.7_T1"; 
    undefined;

var negative262ExpectedResults = {
    'Sbp_12.5_A9_T3.js': false,
    'Sbp_12.6.1_A13_T3.js': false,
    'Sbp_12.6.2_A13_T3.js': false,
    'Sbp_12.6.4_A13_T3.js': false,
    'Sbp_7.8.4_A6.1_T4.js': false,
    'Sbp_7.8.4_A6.2_T1.js': false,
    'Sbp_7.8.4_A6.2_T2.js': false,
    'Sbp_A1_T1.js': true,
    'Sbp_A2_T1.js': true,
    'Sbp_A2_T2.js': true,
    'Sbp_A3_T1.js': true,
    'Sbp_A3_T2.js': true,
    'Sbp_A4_T1.js': true,
    'Sbp_A4_T2.js': true,
    'Sbp_A5_T1.js': true,
    'Sbp_A5_T2.js': true,
    'S7.2_A5_T1.js': false,
    'S7.2_A5_T2.js': false,
    'S7.2_A5_T3.js': false,
    'S7.2_A5_T4.js': false,
    'S7.2_A5_T5.js': false,
    'S7.3_A2.1_T1.js': true,
    'S7.3_A2.1_T2.js': false,
    'S7.3_A2.2_T1.js': true,
    'S7.3_A2.2_T2.js': false,
    'S7.3_A2.3.js': true,
    'S7.3_A2.4.js': true,
    'S7.3_A3.1_T1.js': true,
    'S7.3_A3.1_T2.js': true,
    'S7.3_A3.1_T3.js': false,
    'S7.3_A3.2_T1.js': true,
    'S7.3_A3.2_T2.js': true,
    'S7.3_A3.2_T3.js': false,
    'S7.3_A3.3_T1.js': true,
    'S7.3_A3.3_T2.js': true,
    'S7.3_A3.4_T1.js': true,
    'S7.3_A3.4_T2.js': true,
    'S7.3_A6_T1.js': false,
    'S7.3_A6_T2.js': false,
    'S7.3_A6_T3.js': false,
    'S7.3_A6_T4.js': false,
    'S7.4_A2_T2.js': false,
    'S7.4_A3.js': false,
    'S7.4_A4_T1.js': false,
    'S7.4_A4_T4.js': false,
    'S7.6.1.1_A1.1.js': false,
    'S7.6.1.1_A1.10.js': false,
    'S7.6.1.1_A1.11.js': false,
    'S7.6.1.1_A1.12.js': false,
    'S7.6.1.1_A1.13.js': false,
    'S7.6.1.1_A1.14.js': false,
    'S7.6.1.1_A1.15.js': false,
    'S7.6.1.1_A1.16.js': false,
    'S7.6.1.1_A1.17.js': false,
    'S7.6.1.1_A1.18.js': true,
    'S7.6.1.1_A1.19.js': false,
    'S7.6.1.1_A1.2.js': false,
    'S7.6.1.1_A1.20.js': false,
    'S7.6.1.1_A1.21.js': false,
    'S7.6.1.1_A1.22.js': false,
    'S7.6.1.1_A1.23.js': false,
    'S7.6.1.1_A1.24.js': false,
    'S7.6.1.1_A1.25.js': false,
    'S7.6.1.1_A1.3.js': false,
    'S7.6.1.1_A1.4.js': false,
    'S7.6.1.1_A1.5.js': false,
    'S7.6.1.1_A1.6.js': false,
    'S7.6.1.1_A1.7.js': false,
    'S7.6.1.1_A1.8.js': false,
    'S7.6.1.1_A1.9.js': false,
    'S7.6.1.2_A1.10.js': false,
    'S7.6.1.2_A1.11.js': false,
    'S7.6.1.2_A1.15.js': false,
    'S7.6.1.2_A1.16.js': false,
    'S7.6.1.2_A1.18.js': false,
    'S7.6.1.2_A1.21.js': false,
    'S7.6.1.2_A1.22.js': false,
    'S7.6.1.2_A1.23.js': false,
    'S7.6.1.2_A1.24.js': false,
    'S7.6.1.2_A1.26.js': false,
    'S7.6.1.2_A1.27.js': false,
    'S7.6.1.2_A1.5.js': false,
    'S7.6.1.2_A1.6.js': false,
    'S7.6.1.2_A1.7.js': false,
    'S7.6.1.2_A1.9.js': false,
    '7.6.1.2-1gs.js': false,
    'S7.6.1_A1.1.js': true,
    'S7.6.1_A1.2.js': true,
    'S7.6.1_A1.3.js': true,
    'S7.7_A2_T1.js': false,
    'S7.7_A2_T10.js': false,
    'S7.7_A2_T2.js': false,
    'S7.7_A2_T3.js': false,
    'S7.7_A2_T4.js': false,
    'S7.7_A2_T5.js': false,
    'S7.7_A2_T6.js': false,
    'S7.7_A2_T7.js': false,
    'S7.7_A2_T8.js': false,
    'S7.7_A2_T9.js': false,
    '7.8.3-1gs.js': true,
    '7.8.3-2gs.js': true,
    '7.8.3-3gs.js': true,
    'S7.8.3_A4.1_T1.js': true,
    'S7.8.3_A4.1_T2.js': true,
    'S7.8.3_A4.1_T3.js': true,
    'S7.8.3_A4.1_T4.js': true,
    'S7.8.3_A4.1_T5.js': true,
    'S7.8.3_A4.1_T6.js': true,
    'S7.8.3_A4.1_T7.js': true,
    'S7.8.3_A4.1_T8.js': true,
    'S7.8.3_A6.1_T1.js': false,
    'S7.8.3_A6.1_T2.js': false,
    'S7.8.3_A6.2_T1.js': false,
    'S7.8.3_A6.2_T2.js': false,
    '7.8.4-1gs.js': true,
    'S7.8.4_A1.1_T1.js': false,
    'S7.8.4_A1.1_T2.js': false,
    'S7.8.4_A1.2_T1.js': false,
    'S7.8.4_A1.2_T2.js': false,
    'S7.8.4_A3.1_T1.js': false,
    'S7.8.4_A3.1_T2.js': false,
    'S7.8.4_A3.2_T1.js': false,
    'S7.8.4_A3.2_T2.js': false,
    'S7.8.4_A4.3_T1.js': true,
    'S7.8.4_A4.3_T2.js': true,
    'S7.8.4_A7.1_T4.js': false,
    'S7.8.4_A7.2_T1.js': false,
    'S7.8.4_A7.2_T2.js': false,
    'S7.8.4_A7.2_T3.js': false,
    'S7.8.4_A7.2_T4.js': false,
    'S7.8.4_A7.2_T5.js': false,
    'S7.8.4_A7.2_T6.js': false,
    '7.8.5-1gs.js': false,
    'S7.8.5_A1.2_T1.js': false,
    'S7.8.5_A1.2_T2.js': false,
    'S7.8.5_A1.2_T3.js': false,
    'S7.8.5_A1.2_T4.js': false,
    'S7.8.5_A1.3_T1.js': false,
    'S7.8.5_A1.3_T3.js': false,
    'S7.8.5_A1.5_T1.js': false,
    'S7.8.5_A1.5_T3.js': false,
    'S7.8.5_A2.2_T1.js': false,
    'S7.8.5_A2.2_T2.js': false,
    'S7.8.5_A2.3_T1.js': false,
    'S7.8.5_A2.3_T3.js': false,
    'S7.8.5_A2.5_T1.js': false,
    'S7.8.5_A2.5_T3.js': false,
    'S7.9.2_A1_T1.js': false,
    'S7.9.2_A1_T3.js': false,
    'S7.9.2_A1_T6.js': false,
    'S7.9_A10_T2.js': false,
    'S7.9_A10_T4.js': false,
    'S7.9_A10_T6.js': false,
    'S7.9_A10_T8.js': false,
    'S7.9_A11_T4.js': false,
    'S7.9_A11_T8.js': false,
    'S7.9_A4.js': false,
    'S7.9_A5.1_T1.js': false,
    'S7.9_A5.3_T1.js': false,
    'S7.9_A5.7_T1.js': false,
    'S7.9_A6.2_T1.js': false,
    'S7.9_A6.2_T10.js': false,
    'S7.9_A6.2_T2.js': false,
    'S7.9_A6.2_T3.js': false,
    'S7.9_A6.2_T4.js': false,
    'S7.9_A6.2_T5.js': false,
    'S7.9_A6.2_T6.js': false,
    'S7.9_A6.2_T7.js': false,
    'S7.9_A6.2_T8.js': false,
    'S7.9_A6.2_T9.js': false,
    'S7.9_A6.3_T1.js': false,
    'S7.9_A6.3_T2.js': false,
    'S7.9_A6.3_T3.js': false,
    'S7.9_A6.3_T4.js': false,
    'S7.9_A6.3_T5.js': false,
    'S7.9_A6.3_T6.js': false,
    'S7.9_A6.3_T7.js': false,
    'S7.9_A6.4_T1.js': false,
    'S7.9_A6.4_T2.js': false,
    'S7.9_A7_T7.js': true,
    'S7.9_A9_T6.js': false,
    'S7.9_A9_T7.js': false,
    'S7.9_A9_T8.js': false,
    'S8.2_A2.js': false,
    'S8.3_A2.1.js': true,
    'S8.3_A2.2.js': true,
    'S8.4_A13_T1.js': false,
    'S8.4_A13_T2.js': false,
    'S8.4_A13_T3.js': false,
    'S8.4_A14_T1.js': false,
    'S8.4_A14_T2.js': false,
    'S8.4_A14_T3.js': false,
    'S8.4_A7.1.js': true,
    'S8.4_A7.2.js': true,
    'S8.4_A7.3.js': true,
    'S8.4_A7.4.js': true,
    'S8.6.2_A7.js': true,
    '8.7.2-3-a-1gs.js': true,
    '8.7.2-3-a-2gs.js': true,
    'S8.7.2_A1_T1.js': true,
    'S8.7.2_A1_T2.js': true,
    '10.1.1-2gs.js': false,
    '10.1.1-5gs.js': false,
    '10.1.1-8gs.js': false,
    '10.4.2.1-1gs.js': true,
    '10.5-1gs.js': true,
    '10.6-2gs.js': true,
    'S11.1.1_A1.js': true,
    '11.1.5-1gs.js': true,
    '11.1.5-2gs.js': true,
    '11.13.1-4-28gs.js': true,
    '11.13.1-4-29gs.js': true,
    'S11.13.1_A2.1_T3.js': true,
    '11.13.2-6-1gs.js': true,
    'S11.13.2_A2.2_T1.js': true,
    'S11.13.2_A2.2_T10.js': true,
    'S11.13.2_A2.2_T11.js': true,
    'S11.13.2_A2.2_T2.js': true,
    'S11.13.2_A2.2_T3.js': true,
    'S11.13.2_A2.2_T4.js': true,
    'S11.13.2_A2.2_T5.js': true,
    'S11.13.2_A2.2_T6.js': true,
    'S11.13.2_A2.2_T7.js': true,
    'S11.13.2_A2.2_T8.js': true,
    'S11.13.2_A2.2_T9.js': true,
    'S11.2.4_A1.3_T1.js': false,
    '11.3.1-2-1gs.js': true,
    'S11.3.1_A1.1_T1.js': true,
    'S11.3.1_A1.1_T2.js': true,
    'S11.3.1_A1.1_T3.js': true,
    'S11.3.1_A1.1_T4.js': true,
    'S11.3.1_A2.1_T3.js': true,
    'S11.3.2_A1.1_T1.js': true,
    'S11.3.2_A1.1_T2.js': true,
    'S11.3.2_A1.1_T3.js': true,
    'S11.3.2_A1.1_T4.js': true,
    'S11.3.2_A2.1_T3.js': true,
    '11.4.1-5-a-5gs.js': true,
    'S11.4.2_A2_T2.js': true,
    'S11.4.4_A2.1_T3.js': true,
    '11.4.5-2-2gs.js': true,
    'S11.4.5_A2.1_T3.js': true,
    'S12.1_A4_T1.js': false,
    'S12.1_A4_T2.js': false,
    '12.10.1-11gs.js': true,
    'S12.11_A2_T1.js': true,
    'S12.11_A3_T1.js': false,
    'S12.11_A3_T2.js': false,
    'S12.11_A3_T3.js': false,
    'S12.11_A3_T4.js': false,
    'S12.11_A3_T5.js': false,
    'S12.13_A1.js': true,
    '12.14.1-1gs.js': true,
    'S12.14_A16_T1.js': false,
    'S12.14_A16_T10.js': false,
    'S12.14_A16_T11.js': false,
    'S12.14_A16_T12.js': false,
    'S12.14_A16_T13.js': false,
    'S12.14_A16_T14.js': false,
    'S12.14_A16_T15.js': false,
    'S12.14_A16_T2.js': false,
    'S12.14_A16_T3.js': false,
    'S12.14_A16_T4.js': false,
    'S12.14_A16_T5.js': false,
    'S12.14_A16_T6.js': false,
    'S12.14_A16_T7.js': false,
    'S12.14_A16_T8.js': false,
    'S12.14_A16_T9.js': false,
    '12.2.1-1gs.js': true,
    '12.2.1-4gs.js': true,
    'S12.2_A8_T1.js': false,
    'S12.2_A8_T2.js': false,
    'S12.2_A8_T3.js': false,
    'S12.2_A8_T4.js': false,
    'S12.2_A8_T5.js': false,
    'S12.2_A8_T6.js': false,
    'S12.2_A8_T7.js': false,
    'S12.2_A8_T8.js': false,
    'S12.4_A1.js': false,
    'S12.5_A11.js': false,
    'S12.5_A2.js': true,
    'S12.5_A6_T1.js': false,
    'S12.5_A6_T2.js': false,
    'S12.5_A8.js': false,
    'S12.6.1_A12.js': false,
    'S12.6.1_A15.js': false,
    'S12.6.1_A6_T1.js': false,
    'S12.6.1_A6_T2.js': false,
    'S12.6.1_A6_T3.js': false,
    'S12.6.1_A6_T4.js': false,
    'S12.6.1_A6_T5.js': false,
    'S12.6.1_A6_T6.js': false,
    'S12.6.2_A15.js': false,
    'S12.6.2_A6_T1.js': false,
    'S12.6.2_A6_T2.js': false,
    'S12.6.2_A6_T3.js': false,
    'S12.6.2_A6_T4.js': false,
    'S12.6.2_A6_T5.js': false,
    'S12.6.2_A6_T6.js': false,
    'S12.6.3_A11.1_T3.js': true,
    'S12.6.3_A11_T3.js': true,
    'S12.6.3_A12.1_T3.js': true,
    'S12.6.3_A12_T3.js': true,
    'S12.6.3_A4.1.js': false,
    'S12.6.3_A4_T1.js': false,
    'S12.6.3_A4_T2.js': false,
    'S12.6.3_A7.1_T1.js': false,
    'S12.6.3_A7.1_T2.js': false,
    'S12.6.3_A7_T1.js': false,
    'S12.6.3_A7_T2.js': false,
    'S12.6.3_A8.1_T1.js': false,
    'S12.6.3_A8.1_T2.js': false,
    'S12.6.3_A8.1_T3.js': false,
    'S12.6.3_A8_T1.js': false,
    'S12.6.3_A8_T2.js': false,
    'S12.6.3_A8_T3.js': false,
    'S12.6.4_A15.js': false,
    'S12.7_A1_T1.js': true,
    'S12.7_A1_T2.js': true,
    'S12.7_A1_T3.js': true,
    'S12.7_A1_T4.js': true,
    'S12.7_A5_T1.js': true,
    'S12.7_A5_T2.js': true,
    'S12.7_A5_T3.js': true,
    'S12.7_A6.js': true,
    'S12.7_A8_T1.js': true,
    'S12.7_A8_T2.js': true,
    'S12.8_A1_T1.js': true,
    'S12.8_A1_T2.js': true,
    'S12.8_A1_T3.js': true,
    'S12.8_A1_T4.js': true,
    'S12.8_A5_T1.js': true,
    'S12.8_A5_T2.js': true,
    'S12.8_A5_T3.js': true,
    'S12.8_A6.js': true,
    'S12.8_A8_T1.js': true,
    'S12.8_A8_T2.js': true,
    'S12.9_A1_T1.js': true,
    'S12.9_A1_T10.js': true,
    'S12.9_A1_T2.js': true,
    'S12.9_A1_T3.js': true,
    'S12.9_A1_T4.js': true,
    'S12.9_A1_T5.js': true,
    'S12.9_A1_T6.js': true,
    'S12.9_A1_T7.js': true,
    'S12.9_A1_T8.js': true,
    'S12.9_A1_T9.js': true,
    '13.0_4-17gs.js': true,
    '13.0_4-5gs.js': true,
    'S13_A7_T3.js': false,
    '13.1-13gs.js': true,
    '13.1-1gs.js': true,
    '13.1-4gs.js': true,
    '13.1-5gs.js': true,
    '13.1-8gs.js': true,
    '13.2-19-b-3gs.js': true,
    '14.1-4gs.js': true,
    '14.1-5gs.js': true,
    'S15.1.2.1_A2_T2.js': true,
    'S15.1_A1_T1.js': true,
    'S15.1_A1_T2.js': true,
    'S15.1_A2_T1.js': true,
    'S15.2.4.3_A12.js': true,
    'S15.2.4.3_A13.js': true,
    'S15.2.4.4_A12.js': true,
    'S15.2.4.4_A13.js': true,
    'S15.2.4.4_A14.js': true,
    'S15.2.4.4_A15.js': true,
    'S15.2.4.5_A12.js': true,
    'S15.2.4.5_A13.js': true,
    'S15.2.4.6_A12.js': true,
    'S15.2.4.6_A13.js': true,
    'S15.2.4.7_A12.js': true,
    'S15.2.4.7_A13.js': true,
    '15.3.2.1-10-4gs.js': true,
    '15.3.2.1-10-6gs.js': true,
    'S15.3.4.2_A12.js': true,
    'S15.3.4.2_A13.js': true,
    'S15.3.4.2_A14.js': true,
    'S15.3.4.2_A15.js': true,
    'S15.3.4.2_A16.js': true,
    'S15.3.4.3_A13.js': true,
    'S15.3.4.3_A14.js': true,
    'S15.3.4.3_A15.js': true,
    'S15.3.4.4_A13.js': true,
    'S15.3.4.4_A14.js': true,
    'S15.3.4.4_A15.js': true,
    'S15.3.4.5_A1.js': true,
    'S15.3.4.5_A13.js': true,
    'S15.3.4.5_A14.js': true,
    'S15.3.4.5_A15.js': true,
    'S15.3.4.5_A2.js': true,
    '15.3.5.4_2-10gs.js': true,
    '15.3.5.4_2-11gs.js': true,
    '15.3.5.4_2-13gs.js': true,
    '15.3.5.4_2-15gs.js': true,
    '15.3.5.4_2-16gs.js': true,
    '15.3.5.4_2-17gs.js': true,
    '15.3.5.4_2-18gs.js': true,
    '15.3.5.4_2-19gs.js': true,
    '15.3.5.4_2-1gs.js': true,
    '15.3.5.4_2-20gs.js': true,
    '15.3.5.4_2-21gs.js': true,
    '15.3.5.4_2-22gs.js': true,
    '15.3.5.4_2-23gs.js': true,
    '15.3.5.4_2-24gs.js': true,
    '15.3.5.4_2-25gs.js': true,
    '15.3.5.4_2-26gs.js': true,
    '15.3.5.4_2-27gs.js': true,
    '15.3.5.4_2-28gs.js': true,
    '15.3.5.4_2-29gs.js': true,
    '15.3.5.4_2-2gs.js': true,
    '15.3.5.4_2-30gs.js': true,
    '15.3.5.4_2-31gs.js': true,
    '15.3.5.4_2-32gs.js': true,
    '15.3.5.4_2-33gs.js': true,
    '15.3.5.4_2-34gs.js': true,
    '15.3.5.4_2-35gs.js': true,
    '15.3.5.4_2-36gs.js': true,
    '15.3.5.4_2-37gs.js': true,
    '15.3.5.4_2-38gs.js': true,
    '15.3.5.4_2-39gs.js': true,
    '15.3.5.4_2-3gs.js': true,
    '15.3.5.4_2-40gs.js': true,
    '15.3.5.4_2-41gs.js': true,
    '15.3.5.4_2-42gs.js': true,
    '15.3.5.4_2-43gs.js': true,
    '15.3.5.4_2-44gs.js': true,
    '15.3.5.4_2-45gs.js': true,
    '15.3.5.4_2-46gs.js': true,
    '15.3.5.4_2-47gs.js': true,
    '15.3.5.4_2-48gs.js': true,
    '15.3.5.4_2-49gs.js': true,
    '15.3.5.4_2-4gs.js': true,
    '15.3.5.4_2-50gs.js': true,
    '15.3.5.4_2-51gs.js': true,
    '15.3.5.4_2-52gs.js': true,
    '15.3.5.4_2-53gs.js': true,
    '15.3.5.4_2-54gs.js': true,
    '15.3.5.4_2-55gs.js': true,
    '15.3.5.4_2-56gs.js': true,
    '15.3.5.4_2-57gs.js': true,
    '15.3.5.4_2-58gs.js': true,
    '15.3.5.4_2-59gs.js': true,
    '15.3.5.4_2-5gs.js': true,
    '15.3.5.4_2-60gs.js': true,
    '15.3.5.4_2-61gs.js': true,
    '15.3.5.4_2-62gs.js': true,
    '15.3.5.4_2-63gs.js': true,
    '15.3.5.4_2-64gs.js': true,
    '15.3.5.4_2-65gs.js': true,
    '15.3.5.4_2-66gs.js': true,
    '15.3.5.4_2-67gs.js': true,
    '15.3.5.4_2-68gs.js': true,
    '15.3.5.4_2-69gs.js': true,
    '15.3.5.4_2-6gs.js': true,
    '15.3.5.4_2-70gs.js': true,
    '15.3.5.4_2-71gs.js': true,
    '15.3.5.4_2-72gs.js': true,
    '15.3.5.4_2-73gs.js': true,
    '15.3.5.4_2-74gs.js': true,
    '15.3.5.4_2-7gs.js': true,
    '15.3.5.4_2-8gs.js': true,
    '15.3.5.4_2-94gs.js': true,
    '15.3.5.4_2-95gs.js': true,
    '15.3.5.4_2-96gs.js': true,
    '15.3.5.4_2-97gs.js': true,
    '15.3.5.4_2-9gs.js': true,
    '15.3.5-1gs.js': true,
    '15.3.5-2gs.js': true,
};

class Program {
    runAllTests(environment: IEnvironment, useTypeScript: bool, verify: bool): void {
        environment.standardOut.WriteLine("");

        this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\scanner\\ecmascript5",
            filePath => this.runScanner(environment, filePath, LanguageVersion.EcmaScript5, useTypeScript, verify));
        // this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\scanner\\ecmascript3",
        //    filePath => this.runScanner(environment, filePath, LanguageVersion.EcmaScript3, useTypeScript, verify));
            
        this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\parser\\ecmascript5",
            filePath => this.runParser(environment, filePath, LanguageVersion.EcmaScript5, useTypeScript, verify, /*allowErrors:*/ true));
        // this.runTests(environment, "C:\\fidelity\\src\\prototype\\tests\\parser\\ecmascript3",
        //    filePath => this.runParser(environment, filePath, LanguageVersion.EcmaScript3, useTypeScript, verify, /*allowErrors:*/ true));

        this.runTests(environment, "C:\\temp\\monoco-files",
            filePath => this.runParser(environment, filePath, LanguageVersion.EcmaScript5, useTypeScript, /*verify: */ false, /*allowErrors:*/ false));

        environment.standardOut.WriteLine("");
    }

    private runTests(
        environment: IEnvironment,
        path: string,
        action: (filePath: string) => void) {

        var testFiles = environment.listFiles(path, null, { recursive: true });
        for (var index in testFiles) {
            var filePath = testFiles[index];

            try {
                action(filePath);
            }
            catch (e) {
                environment.standardOut.WriteLine("Exception: " + filePath);
            }
        }
    }

    runParser(environment: IEnvironment,
              filePath: string,
              languageVersion: LanguageVersion,
              useTypeScript: bool,
              verify: bool,
              allowErrors: bool): void {
        if (!StringUtilities.endsWith(filePath, ".ts")) {
            return;
        }

        if (filePath.indexOf("RealSource") >= 0) {
            return;
        }

        if (specificFile !== undefined && filePath.indexOf(specificFile) < 0) {
            return;
        }

        // environment.standardOut.WriteLine("Running Parser: " + filePath);
        var contents = environment.readFile(filePath, 'utf-8');
        totalSize += contents.length;

        if (useTypeScript) {
            var text1 = new TypeScript.StringSourceText(contents);
            var parser1 = new TypeScript.Parser(); 
            parser1.errorRecovery = true;
            var unit1 = parser1.parse(text1, filePath, 0);
        }
        else {
            var text = new StringText(contents);
            var scanner = new Scanner(text, languageVersion, /* new StringTable() */ stringTable);
            var parser = new Parser(scanner);
            var unit = parser.parseSyntaxTree();

            if (!allowErrors) {
                if (unit.diagnostics() && unit.diagnostics().length) {
                    throw new Error("File had unexpected error!");
                }
            }

            // var json = JSON2.stringify(unit);
            
            if (verify) {
                var actualResult = JSON2.stringify(unit, null, 4);
                var expectedFile = filePath + ".expected";
                var actualFile = filePath + ".actual";

                var expectedResult = environment.readFile(expectedFile, 'utf-8');

                if (expectedResult !== actualResult) {
                    environment.standardOut.WriteLine(" !! Test Failed. Results written to: " + actualFile);
                    environment.writeFile(actualFile, actualResult, true);
                }
            }
        }
    }

    runScanner(environment: IEnvironment, filePath: string, languageVersion: LanguageVersion, useTypeScript: bool, verify: bool): void {
        if (!StringUtilities.endsWith(filePath, ".ts")) {
            return;
        }

        if (useTypeScript) {
            return;
        }

        if (specificFile !== undefined && filePath.indexOf(specificFile) < 0) {
            return;
        }

        // environment.standardOut.WriteLine("Running Scanner: " + filePath);

        var contents = environment.readFile(filePath, 'utf-8');
        var text = new StringText(contents);
        var scanner = Scanner.create(text, languageVersion);

        var tokens: ISyntaxToken[] = [];
        var textArray: string[] = [];
        var diagnostics: SyntaxDiagnostic[] = [];

        while (true) {
            var token = scanner.scan(diagnostics);
            tokens.push(token);
            
            if (verify) {
                var tokenText = token.text();
                var tokenFullText = token.fullText(text);

                textArray.push(tokenFullText);

                if (tokenFullText.substr(token.start() - token.fullStart(), token.width()) !== tokenText) {
                    throw new Error("Token invariant broken!");
                }
            }

            if (token.kind === SyntaxKind.EndOfFileToken) {
                break;
            }
        }

        if (verify) {
            var fullText = textArray.join("");

            if (contents !== fullText) {
                throw new Error("Full text didn't match!");
            }

            var result = diagnostics.length === 0 ? <any>tokens : { diagnostics: diagnostics, tokens: tokens };
        
            var actualResult = JSON2.stringify(result, null, 4);
            var expectedFile = filePath + ".expected";
            var actualFile = filePath + ".actual";

            var expectedResult = environment.readFile(expectedFile, 'utf-8');
            
            if (expectedResult !== actualResult) {
                environment.standardOut.WriteLine(" !! Test Failed. Results written to: " + actualFile);
                environment.writeFile(actualFile, actualResult, true);
            }
        }
    }

    run(environment: IEnvironment, useTypeScript: bool): void {
        for (var index in environment.arguments) {
            var filePath: string = environment.arguments[index];

            this.runParser(environment, filePath, LanguageVersion.EcmaScript5, useTypeScript, /*verify:*/ false, /*allowErrors:*/ false);
        }
    }

    run262(environment: IEnvironment, useTypeScript: bool): void {
        var path = "C:\\temp\\test262\\suite";
        var testFiles = environment.listFiles(path, null, { recursive: true });

        var testCount = 0;
        var failCount = 0;
        var skippedTests:string[] = [];

        for (var index in testFiles) {
            var filePath: string = testFiles[index];

            try {
                // All 262 files are utf8.  But they dont' have a BOM.  Force them to be read in
                // as UTF8.
                var contents = environment.readFile(filePath, 'utf-8');
                var isNegative = contents.indexOf("@negative") >= 0

                testCount++;

                //if (isNegative) {
                //    skippedTests.push(filePath);
                //    // environment.standardOut.Write("S");
                //    continue;
                //}
                //else {
                //    // environment.standardOut.Write(".");
                //}

                var stringText = new StringText(contents);
                var scanner = new Scanner(stringText, LanguageVersion.EcmaScript5, stringTable);
                var parser = new Parser(scanner);

                var syntaxTree = parser.parseSyntaxTree();
                //environment.standardOut.Write(".");

                if (isNegative) {
                    var fileName = filePath.substr(filePath.lastIndexOf("\\") + 1);
                    var canParseSuccessfully = <bool>negative262ExpectedResults[fileName];

                    if (canParseSuccessfully) {
                        // We expected to parse this successfully.  Report an error if we didn't.
                        if (syntaxTree.diagnostics() && syntaxTree.diagnostics().length > 0) {
                            environment.standardOut.WriteLine("Negative test. Unexpected failure: " + filePath);
                            failCount++;
                        }
                    }
                    else {
                        // We expected to fail on this.  Report an error if we don't.
                        if (syntaxTree.diagnostics() === null || syntaxTree.diagnostics().length === 0) {
                            environment.standardOut.WriteLine("Negative test. Unexpected success: " + filePath);
                            failCount++;
                        }
                    }
                }
                else {
                    // Not a negative test.  We can't have any errors or skipped tokens.
                    if (syntaxTree.diagnostics() && syntaxTree.diagnostics().length > 0) {
                        environment.standardOut.WriteLine("Unexpected failure: " + filePath);
                        failCount++;
                    }
                }
            }
            catch (e) {
                failCount++;
                environment.standardOut.WriteLine("Exception: " + filePath);
            }
        }

        environment.standardOut.WriteLine("");
        environment.standardOut.WriteLine("Test 262 results:");
        environment.standardOut.WriteLine("Test Count: " + testCount);
        environment.standardOut.WriteLine("Skip Count: " + skippedTests.length);
        environment.standardOut.WriteLine("Fail Count: " + failCount);

        for (var i = 0; i < skippedTests.length; i++) {
            environment.standardOut.WriteLine(skippedTests[i]);
        }
    }
}

// (<any>WScript).StdIn.ReadLine();
var totalSize = 0;
var program = new Program();
var start: number, end: number;

if (true) {
    start = new Date().getTime();
    program.runAllTests(Environment, false, true);
    program.run(Environment, false);
    end = new Date().getTime();
    Environment.standardOut.WriteLine("Total time: " + (end - start));
    Environment.standardOut.WriteLine("Total size: " + totalSize);
}

if (false) {
    start = new Date().getTime();
    program.runAllTests(Environment, true, false);
    program.run(Environment, true);
    end = new Date().getTime();
    Environment.standardOut.WriteLine("Total time: " + (end - start));
}

if (true && specificFile === undefined) {
    start = new Date().getTime();
    program.run262(Environment, false);
    end = new Date().getTime();
    Environment.standardOut.WriteLine("Total time: " + (end - start));
}