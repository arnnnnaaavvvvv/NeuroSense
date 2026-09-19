import json

cases_spec = {
    'sam40_sub01_math_stress': {
        'abs': {'Delta': 18.4, 'Theta': 39.5, 'Alpha': 40.7, 'Beta': 69.8, 'Gamma': 8.9},
        'ref': {'Beta': 27.3, 'Alpha': 37.1, 'Theta': 18.8, 'Gamma': 4.5}
    },
    'sam40_sub01_relax_baseline': {
        'abs': {'Delta': 14.2, 'Theta': 22.1, 'Alpha': 68.4, 'Beta': 17.0, 'Gamma': 4.7},
        'rel': {'Delta': 11.2, 'Theta': 17.5, 'Alpha': 54.1, 'Beta': 13.4, 'Gamma': 3.8},
        'ref': {'Beta': 13.4, 'Alpha': 54.1, 'Theta': 17.5, 'Gamma': 3.8}
    },
    'student_sub11_stroop_stress': {
        'abs': {'Delta': 15.2, 'Theta': 59.2, 'Alpha': 33.0, 'Beta': 53.5, 'Gamma': 7.4},
        'ref': {'Theta': 25.8, 'Beta': 24.3, 'Alpha': 30.2, 'Gamma': 4.1}
    },
    'dasps_s01_high_anxiety': {
        'abs': {'Delta': 12.1, 'Theta': 35.1, 'Alpha': 28.5, 'Beta': 71.9, 'Gamma': 9.3},
        'ref': {'Beta': 30.8, 'Alpha': 31.8, 'Theta': 19.4, 'Gamma': 5.2}
    },
    'dasps_s01_relax_baseline': {
        'abs': {'Delta': 13.9, 'Theta': 19.6, 'Alpha': 64.5, 'Beta': 16.8, 'Gamma': 4.2},
        'ref': {'Beta': 14.1, 'Alpha': 54.2, 'Theta': 16.5, 'Gamma': 3.5}
    },
}

for cid, cdata in cases_spec.items():
    tot = round(sum(cdata['abs'].values()), 1)
    rels = {b: round(v / tot * 100, 1) for b, v in cdata['abs'].items()}
    # adjust alpha slightly if rounding diff exists
    diff = round(100.0 - sum(rels.values()), 1)
    if diff != 0:
        rels['Alpha'] = round(rels['Alpha'] + diff, 1)
    s = round(sum(rels.values()), 1)
    bar = round(cdata['abs']['Beta'] / cdata['abs']['Alpha'], 2)
    print(f'{cid}:')
    print(f'  Total abs: {tot:.1f}, Rels: {rels}, Sum: {s}%')
    print(f'  Beta/Alpha ratio: {cdata["abs"]["Beta"]} / {cdata["abs"]["Alpha"]} = {bar}')
    for b, ref in cdata['ref'].items():
        cur = rels[b]
        dev = round((cur - ref) / ref * 100, 1)
        print(f'    {b}: cur={cur}%, ref={ref}%, dev={dev:+0.1f}%')
