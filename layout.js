// Manual X positioning for the corrected family tree.
// Slot units; rendered pixels = slot * COL_W (set in app).
window.LAYOUT = (() => {
  const X = {
    // ── Gen 1 ───────────────────────────────
    jose_mir_gomez:           1,
    maria_concepcion_cruz:    2,
    francisco_narbona_pina:  14,
    ana_sierra:              15,
    antonio_lotti_mercader:  16,
    josefina_navarrete:      17,
    antonio_pio_varona:      18,
    isidora_varona:          19,
    delfin_pupo:             20,
    manuela_gonzalez:        21,

    // ── Gen 2 ───────────────────────────────
    emiliano_mir:             1,
    antonia_nazco:            2,
    jesus_de_la_rosa:         3,
    gregoria_mulet:           4,
    jose_marrero:             5,
    rosalia_gongora:          6,
    alberto_osorio:           7,
    maria_cabrera:            8,
    miguel_narbona:          16,
    antonia_lotti:           17,
    torcuato_varona:         18,
    balbina_pupo:            19,

    // ── Gen 3 ───────────────────────────────
    gerardo_mir_nasco:        3,
    elpidia_de_la_rosa_mulet: 4,
    pastor_marrero:           5,
    victoria_osorio:          6,
    federico_lr_nl:          17,
    clemencia_evp:           18,
    daniel_alvarez:          19,
    carmen_gonzalez:         20,

    // ── Gen 4 ───────────────────────────────
    gerardo_mir_de_la_rosa:   4,
    librada_marrero:          5,
    federico_me_nv:          18,
    ana_odelta:              19,

    // ── Gen 5 ───────────────────────────────
    // Children of Gerardo De La Rosa × Librada
    jose_mir:                 0,
    gerardo_mir:              2,
    unknown_mir:              3,
    padre_de_ernesto:         6,
    beatriz_mir:              8,
    carlos_mir:              11,
    // Children of Federico M.E. × Ana Odelta — and their spouses interleaved
    clemencia_narbona:       12,
    federico_narbona:        16,
    eunice_narbona:          17,
    jesus_diego:             21,
    idolka_narbona:          22,
    rene_narbona:            25,
    luisa_sesin:             26,
    pedro_narbona:           29,
    manuel_monteagudo_sr:    30.5,
    carmen_narbona:          31.5,

    // ── Gen 6 ───────────────────────────────
    dania_mir:                0,
    ernesto_infanzon_mir:     6,

    // Raisa's two partners flank her; Manuel Almeida (1st) sits left, Guillermo right
    manuel_almeida:          10,
    raisa_mir:               11,
    guillermo_silvestre_diaz:12,
    // Ioana × Manuel Ramirez
    manuel_ramirez:          13.5,
    ioana_mir_narbona:       14.5,

    // Children of Federico Narbona × Eunice — five
    katia_narbona:           16.5,
    luis_gomez_sr:           15.5,
    padre_de_alejandro:      18,
    miosotis_narbona:        19.5,
    erik_narbona:            21,
    federico_javier_narbona: 22.5,

    // Idolka × Jesus Diego
    david_diego:             20.5,

    // René × Luisa
    federico_narbona_sesin:  24,
    madre_de_sheila:         25.5,
    aimee_narbona_sesin:     27.5,
    jorge_felix_rios:        26.5,

    // Pedro's daughter
    yahimara_narbona:        29,

    // Carmen × Manuel Sr
    manuel_monteagudo_jr:    31,

    // ── Gen 7 ───────────────────────────────
    gabriela_diaz:           11.5,
    carlos_manuel_ramirez:   14,
    natalie_sixto:           15.5,
    luis_gomez_jr:           16.5,
    alejandro:               18,
    sheila_narbona:          25.5,
    jorge_luis_rios:         26.5,
    zaray_rios:              27.5,
  };

  const generations = [1,2,3,4,5,6,7];

  let minYear = Infinity, maxYear = -Infinity;
  for (const id of Object.keys(window.FAMILY.people)) {
    const p = window.FAMILY.people[id];
    if (p.b != null) minYear = Math.min(minYear, p.b);
    if (p.d != null) maxYear = Math.max(maxYear, p.d);
    else maxYear = Math.max(maxYear, 2026);
  }

  return { X, generations, minYear, maxYear };
})();
