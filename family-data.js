// Mir Family Tree — data extracted from screenshots (revised pass)
// Generations are numbered 1 (oldest) → 7 (youngest).
// Dates are estimates (~) until real dates are filled in.

window.FAMILY = (() => {
  const P = {};
  const add = (id, o) => { P[id] = { id, place: 'Cuba', ...o }; };

  // ── Generation 1 ────────────────────────────────────────────────────────
  add('jose_mir_gomez',           { name:'Jose Mir',        sur:'Gomez',          g:'m', gen:1, b:1858, d:1928 });
  add('maria_concepcion_cruz',    { name:'Maria de la Concepción', sur:'Cruz',    g:'f', gen:1, b:1862, d:1935 });
  add('francisco_narbona_pina',   { name:'Francisco Narbona', sur:'Piña',         g:'m', gen:1, b:1860, d:1930 });
  add('ana_sierra',               { name:'Ana',             sur:'Sierra',         g:'f', gen:1, b:1865, d:1940 });
  add('antonio_lotti_mercader',   { name:'Antonio Lotti',   sur:'Mercader',       g:'m', gen:1, b:1862, d:1932 });
  add('josefina_navarrete',       { name:'Josefina',        sur:'Navarrete',      g:'f', gen:1, b:1866, d:1938 });
  add('antonio_pio_varona',       { name:'Antonio Pio',     sur:'Varona',         g:'m', gen:1, b:1860, d:1930 });
  add('isidora_varona',           { name:'Isidora',         sur:'Varona',         g:'f', gen:1, b:1864, d:1934 });
  add('delfin_pupo',              { name:'Delfín',          sur:'Pupo',           g:'m', gen:1, b:1863, d:1933 });
  add('manuela_gonzalez',         { name:'Manuela',         sur:'González',       g:'f', gen:1, b:1867, d:1940 });

  // ── Generation 2 (in-laws sit in gen 2, parents unknown) ────────────────
  add('emiliano_mir',             { name:'Emiliano Mir',    sur:'de la Cruz',     g:'m', gen:2, b:1888, d:1958 });
  add('antonia_nazco',            { name:'Antonia',         sur:'Nazco',          g:'f', gen:2, b:1892, d:1962 });
  add('jesus_de_la_rosa',         { name:'Jesús',           sur:'De la Rosa',     g:'m', gen:2, b:1888, d:1955 });
  add('gregoria_mulet',           { name:'Gregoria',        sur:'Mulet',          g:'f', gen:2, b:1892, d:1960 });
  add('jose_marrero',             { name:'José',            sur:'Marrero',        g:'m', gen:2, b:1890, d:1958 });
  add('rosalia_gongora',          { name:'Rosalía',         sur:'Góngora',        g:'f', gen:2, b:1893, d:1962 });
  add('alberto_osorio',           { name:'Alberto',         sur:'Osorio',         g:'m', gen:2, b:1891, d:1960 });
  add('maria_cabrera',            { name:'Maria',           sur:'Cabrera',        g:'f', gen:2, b:1894, d:1965 });
  add('miguel_narbona',           { name:'Miguel María Blas', sur:'Narbona',      g:'m', gen:2, b:1890, d:1960 });
  add('antonia_lotti',            { name:'Antonia',         sur:'Lotti',          g:'f', gen:2, b:1894, d:1965 });
  add('torcuato_varona',          { name:'Torcuato',        sur:'Varona',         g:'m', gen:2, b:1890, d:1960 });
  add('balbina_pupo',             { name:'Balbina',         sur:'Pupo',           g:'f', gen:2, b:1894, d:1965 });

  // ── Generation 3 ────────────────────────────────────────────────────────
  add('gerardo_mir_nasco',        { name:'Gerardo Mir',     sur:'Nasco',          g:'m', gen:3, b:1915, d:1985 });
  add('elpidia_de_la_rosa_mulet', { name:'Elpidia De la Rosa', sur:'Mulet',       g:'f', gen:3, b:1918, d:1988 });
  add('pastor_marrero',           { name:'Pastor',          sur:'Marrero',        g:'m', gen:3, b:1916, d:1990 });
  add('victoria_osorio',          { name:'Victoria',        sur:'Osorio',         g:'f', gen:3, b:1920, d:1992 });
  add('federico_lr_nl',           { name:'Federico L. R.',  sur:'N. L.',          g:'m', gen:3, b:1918, d:1988 });
  add('clemencia_evp',            { name:'Clemencia',       sur:'E. V. P.',       g:'f', gen:3, b:1922, d:1992 });
  add('daniel_alvarez',           { name:'Daniel',          sur:'Álvarez',        g:'m', gen:3, b:1920, d:1990 });
  add('carmen_gonzalez',          { name:'Carmen',          sur:'González',       g:'f', gen:3, b:1923, d:1995 });

  // ── Generation 4 ────────────────────────────────────────────────────────
  add('gerardo_mir_de_la_rosa',   { name:'Gerardo Mir',     sur:'De La Rosa',     g:'m', gen:4, b:1942, d:2018 });
  add('librada_marrero',          { name:'Librada Elisa',   sur:'Marrero',        g:'f', gen:4, b:1945, d:2020 });
  add('federico_me_nv',           { name:'Federico M. E.',  sur:'N. V.',          g:'m', gen:4, b:1944 });
  add('ana_odelta',               { name:'Ana Odelta Álvarez', sur:'González',    g:'f', gen:4, b:1948 });

  // ── Generation 5 ────────────────────────────────────────────────────────
  // Children of Gerardo Mir De La Rosa × Librada (left branch)
  add('jose_mir',                 { name:'José',            sur:'Mir',            g:'m', gen:5, b:1965 });
  add('gerardo_mir',              { name:'Gerardo',         sur:'Mir',            g:'m', gen:5, b:1968 });
  add('unknown_mir',              { name:'Unknown',         sur:'',               g:'f', gen:5, b:1970 });
  add('padre_de_ernesto',         { name:'Padre de',        sur:'Ernesto',        g:'m', gen:5, b:1972 });
  add('beatriz_mir',              { name:'Beatriz',         sur:'Mir',            g:'f', gen:5, b:1974 });
  add('carlos_mir',               { name:'Carlos',          sur:'Mir',            g:'m', gen:5, b:1976 });
  // Children of Federico M.E. × Ana Odelta (right branch) — six in total
  add('clemencia_narbona',        { name:'Clemencia',       sur:'Narbona',        g:'f', gen:5, b:1978 });
  add('federico_narbona',         { name:'Federico',        sur:'Narbona',        g:'m', gen:5, b:1968 });
  add('idolka_narbona',           { name:'Idolka',          sur:'Narbona',        g:'f', gen:5, b:1972 });
  add('rene_narbona',             { name:'René',            sur:'Narbona',        g:'m', gen:5, b:1974 });
  add('pedro_narbona',            { name:'Pedro',           sur:'Narbona',        g:'m', gen:5, b:1976 });
  add('carmen_narbona',           { name:'Carmen',          sur:'Narbona',        g:'f', gen:5, b:1980 });
  // Gen-5 spouses married in (parents unknown)
  add('eunice_narbona',           { name:'Eunice',          sur:'',               g:'f', gen:5, b:1970 });
  add('jesus_diego',              { name:'Jesús',           sur:'Diego',          g:'m', gen:5, b:1970 });
  add('luisa_sesin',              { name:'Luisa',           sur:'Sesín',          g:'f', gen:5, b:1976 });
  add('manuel_monteagudo_sr',     { name:'Manuel',          sur:'Monteagudo',     g:'m', gen:5, b:1978 });

  // ── Generation 6 ────────────────────────────────────────────────────────
  // Children of Jose Mir
  add('dania_mir',                { name:'Dania',           sur:'Mir',            g:'f', gen:6, b:1990 });
  // Child of Padre de Ernesto
  add('ernesto_infanzon_mir',     { name:'Ernesto Infanzón', sur:'Mir',          g:'m', gen:6, b:1995 });
  // Carlos Mir × Clemencia Narbona — daughters
  add('raisa_mir',                { name:'Raisa',           sur:'Mir',            g:'f', gen:6, b:1996 });
  add('ioana_mir_narbona',        { name:'Ioana Mir',       sur:'Narbona',        g:'f', gen:6, b:1998 });
  // Raisa's partners (married in)
  add('manuel_almeida',           { name:'Manuel',          sur:'Almeida',        g:'m', gen:6, b:1992 });
  add('guillermo_silvestre_diaz', { name:'Guillermo Silvestre', sur:'Díaz',       g:'m', gen:6, b:1994 });
  // Ioana's partner
  add('manuel_ramirez',           { name:'Manuel',          sur:'Ramírez',        g:'m', gen:6, b:1995 });
  // Federico Narbona × Eunice — five children
  add('katia_narbona',            { name:'Katia',           sur:'Narbona',        g:'f', gen:6, b:1992 });
  add('padre_de_alejandro',       { name:'Padre de',        sur:'Alejandro',      g:'m', gen:6, b:1990 });
  add('miosotis_narbona',         { name:'Miosotis',        sur:'Narbona',        g:'f', gen:6, b:1994 });
  add('erik_narbona',             { name:'Erik',            sur:'Narbona',        g:'m', gen:6, b:1996 });
  add('federico_javier_narbona',  { name:'Federico Javier', sur:'Narbona',        g:'m', gen:6, b:1998 });
  // Katia's husband (married in)
  add('luis_gomez_sr',            { name:'Luis',            sur:'Gómez',          g:'m', gen:6, b:1990 });
  // Idolka × Jesus Diego — son
  add('david_diego',              { name:'David',           sur:'Diego',          g:'m', gen:6, b:2000 });
  // René × Luisa Sesín — three children
  add('federico_narbona_sesin',   { name:'Federico',        sur:'Narbona Sesín',  g:'m', gen:6, b:1996 });
  add('madre_de_sheila',          { name:'Madre de',        sur:'Sheila',         g:'f', gen:6, b:1995 });
  add('aimee_narbona_sesin',      { name:'Aimée Luisa',     sur:'Narbona Sesín',  g:'f', gen:6, b:1998 });
  // Aimée's husband (married in)
  add('jorge_felix_rios',         { name:'Jorge Félix',     sur:'Ríos',           g:'m', gen:6, b:1996 });
  // Pedro Narbona's daughter
  add('yahimara_narbona',         { name:'Yahimara',        sur:'Narbona',        g:'f', gen:6, b:2000 });
  // Carmen Narbona × Manuel Monteagudo Sr — son
  add('manuel_monteagudo_jr',     { name:'Manuel',          sur:'Monteagudo',     g:'m', gen:6, b:2002 });

  // ── Generation 7 ────────────────────────────────────────────────────────
  add('gabriela_diaz',            { name:'Gabriela',        sur:'Díaz',           g:'f', gen:7, b:2018 });
  add('carlos_manuel_ramirez',    { name:'Carlos Manuel',   sur:'Ramírez',        g:'m', gen:7, b:2020 });
  add('natalie_sixto',            { name:'Natalie',         sur:'Sixto',          g:'f', gen:7, b:2012 });
  add('luis_gomez_jr',            { name:'Luis',            sur:'Gómez',          g:'m', gen:7, b:2014 });
  add('alejandro',                { name:'Alejandro',       sur:'',               g:'m', gen:7, b:2015 });
  add('sheila_narbona',           { name:'Sheila',          sur:'Narbona',        g:'f', gen:7, b:2018 });
  add('jorge_luis_rios',          { name:'Jorge Luis',      sur:'Ríos',           g:'m', gen:7, b:2018 });
  add('zaray_rios',               { name:'Zaray',           sur:'Ríos',           g:'f', gen:7, b:2020 });

  // ── Unions & children ─────────────────────────────────────────────────
  const U = [
    // Gen 1
    ['jose_mir_gomez',          'maria_concepcion_cruz',   ['emiliano_mir']],
    ['francisco_narbona_pina',  'ana_sierra',              ['miguel_narbona']],
    ['antonio_lotti_mercader',  'josefina_navarrete',      ['antonia_lotti']],
    ['antonio_pio_varona',      'isidora_varona',          ['torcuato_varona']],
    ['delfin_pupo',             'manuela_gonzalez',        ['balbina_pupo']],

    // Gen 2
    ['emiliano_mir',            'antonia_nazco',           ['gerardo_mir_nasco']],
    ['jesus_de_la_rosa',        'gregoria_mulet',          ['elpidia_de_la_rosa_mulet']],
    ['jose_marrero',            'rosalia_gongora',         ['pastor_marrero']],
    ['alberto_osorio',          'maria_cabrera',           ['victoria_osorio']],
    ['miguel_narbona',          'antonia_lotti',           ['federico_lr_nl']],
    ['torcuato_varona',         'balbina_pupo',            ['clemencia_evp']],

    // Gen 3
    ['gerardo_mir_nasco',       'elpidia_de_la_rosa_mulet',['gerardo_mir_de_la_rosa']],
    ['pastor_marrero',          'victoria_osorio',         ['librada_marrero']],
    ['federico_lr_nl',          'clemencia_evp',           ['federico_me_nv']],
    ['daniel_alvarez',          'carmen_gonzalez',         ['ana_odelta']],

    // Gen 4 — the two anchor couples
    ['gerardo_mir_de_la_rosa',  'librada_marrero',
      ['jose_mir','gerardo_mir','padre_de_ernesto','beatriz_mir','carlos_mir']],
    ['gerardo_mir',             'unknown_mir',             []],
    ['federico_me_nv',          'ana_odelta',
      ['clemencia_narbona','federico_narbona','idolka_narbona','rene_narbona','pedro_narbona','carmen_narbona']],

    // Gen 5 — Carlos × Clemencia joins the two lineages
    ['carlos_mir',              'clemencia_narbona',       ['raisa_mir','ioana_mir_narbona']],
    ['jose_mir',                null,                      ['dania_mir']],
    ['padre_de_ernesto',        null,                      ['ernesto_infanzon_mir']],
    ['federico_narbona',        'eunice_narbona',
      ['katia_narbona','padre_de_alejandro','miosotis_narbona','erik_narbona','federico_javier_narbona']],
    ['idolka_narbona',          'jesus_diego',             ['david_diego']],
    ['rene_narbona',            'luisa_sesin',
      ['federico_narbona_sesin','madre_de_sheila','aimee_narbona_sesin']],
    ['pedro_narbona',           null,                      ['yahimara_narbona']],
    ['manuel_monteagudo_sr',    'carmen_narbona',          ['manuel_monteagudo_jr']],

    // Gen 6 — Raisa's two partnerships; only Guillermo's union produced Gabriela
    ['manuel_almeida',          'raisa_mir',               []],
    ['guillermo_silvestre_diaz','raisa_mir',               ['gabriela_diaz']],
    ['manuel_ramirez',          'ioana_mir_narbona',       ['carlos_manuel_ramirez']],
    ['luis_gomez_sr',           'katia_narbona',           ['luis_gomez_jr']],
    ['luis_gomez_jr',           'natalie_sixto',           []],
    ['padre_de_alejandro',      null,                      ['alejandro']],
    ['madre_de_sheila',         null,                      ['sheila_narbona']],
    ['jorge_felix_rios',        'aimee_narbona_sesin',     ['jorge_luis_rios','zaray_rios']],
  ];

  // Parent index
  const parentsOf = {};
  for (const [a,b,children] of U) {
    for (const c of (children||[])) parentsOf[c] = [a,b].filter(Boolean);
  }

  // Spouse index — list-of-partners (for people with multiple unions)
  const partnersOf = {};
  for (const [a,b] of U) {
    if (a && b) {
      (partnersOf[a] = partnersOf[a] || []).push(b);
      (partnersOf[b] = partnersOf[b] || []).push(a);
    }
  }
  const spouseOf = {};
  for (const k in partnersOf) spouseOf[k] = partnersOf[k][0];

  return { people: P, unions: U, parentsOf, spouseOf, partnersOf };
})();
