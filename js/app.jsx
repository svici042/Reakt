import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

// Stable technical keys allow the same works to be filtered regardless of
// the currently selected interface language.
const works = [
  { id: 1, key: "evening", category: "painting", image: "/images/margarita-evening-1536.webp", small: "/images/margarita-evening-768.webp" },
  { id: 2, key: "hands", category: "ceramics", image: "/images/master-hands-720.webp" },
  { id: 3, key: "laurel", category: "graphics", image: "/images/laurel-wreath-1400.webp", small: "/images/laurel-wreath-720.webp" },
  { id: 4, key: "materials", category: "ceramics", image: "/images/ceramics-textiles-1400.webp", small: "/images/ceramics-textiles-720.webp" },
  { id: 5, key: "nefertiti", category: "graphics", image: "/images/nefertiti-1200.webp", small: "/images/nefertiti-640.webp" },
];

// All visible interface copy is kept in a single localization structure.
const translations = {
  lt: {
    language: "Kalba", navLabel: "Pagrindinė navigacija", mobileNavLabel: "Mobilioji navigacija",
    nav: ["Apie", "Darbai", "Studija", "Kontaktai"], menu: "Meniu", close: "Užverti",
    eyebrow: "Kūrybos studija · Vilnius", heroFirst: "Gyva", heroSecond: "materija",
    heroNote: "Forma gimsta ten, kur rankos susitinka su medžiaga. Kuriame lėtai, drąsiai ir ilgam.", scroll: "Slinkti",
    manifestoIndex: "01 / Manifestas", manifestoStart: "Ne gaminame daiktus. Mes kuriame ", manifestoEm: "ryšį", manifestoEnd: " su jais.",
    manifestoText: "MATERIJA — nepriklausoma kūrybos studija, kurioje molis, tekstilė ir pigmentas tampa šiuolaikiniais pasakojimais. Kiekvienas darbas gimsta rankomis, todėl išsaugo netobulą, gyvą žmogaus pėdsaką.",
    worksIndex: "02 / Atrinkti darbai", collection: "Kolekcija", filterLabel: "Filtruoti darbus", openWork: "Atverti darbą",
    filters: { all: "Visi", painting: "Tapyba", ceramics: "Keramika", graphics: "Grafika" },
    works: { evening: "Vakaro portretas", hands: "Meistro rankos", laurel: "Lauro ženklai", materials: "Medžiagų dialogas", nefertiti: "Nefertitė" },
    studioIndex: "03 / Atviros dirbtuvės", studioTitle: "Užeik.",
    studioText: "Kartą per mėnesį atveriame studijos duris. Susipažink su medžiagomis, stebėk kūrybos procesą arba prisijunk prie mažos praktinės sesijos.",
    blogIndex: "04 / Studijos žurnalas", blogTitle: "Iš arti.", blogLead: "Procesas, žmonės ir medžiagos, kurios kasdien formuoja mūsų studiją.",
    blogPosts: ["Molio atmintis", "Portreto tyla", "Ženklai gamtoje"], blogRead: "Skaityti istoriją",
    places: "vietų", session: "sesija", monthly: "per mėn.", question: "Turite idėją?", contact: "Suteikime jai formą.", write: "Parašyti", location: "Vilnius · Lietuva / Bergenas · Norvegija",
  },
  en: {
    language: "Language", navLabel: "Main navigation", mobileNavLabel: "Mobile navigation",
    nav: ["About", "Works", "Studio", "Contact"], menu: "Menu", close: "Close",
    eyebrow: "Creative studio · Vilnius", heroFirst: "Living", heroSecond: "matter",
    heroNote: "Form emerges where hands meet material. We create slowly, boldly, and to last.", scroll: "Scroll",
    manifestoIndex: "01 / Manifesto", manifestoStart: "We do not make objects. We create a ", manifestoEm: "bond", manifestoEnd: " with them.",
    manifestoText: "MATERIJA is an independent creative studio where clay, textile, and pigment become contemporary stories. Every piece is made by hand, preserving the imperfect, living trace of its maker.",
    worksIndex: "02 / Selected works", collection: "Collection", filterLabel: "Filter works", openWork: "Open artwork",
    filters: { all: "All", painting: "Painting", ceramics: "Ceramics", graphics: "Graphics" },
    works: { evening: "Evening portrait", hands: "The maker’s hands", laurel: "Laurel signs", materials: "Material dialogue", nefertiti: "Nefertiti" },
    studioIndex: "03 / Open studio", studioTitle: "Come in.",
    studioText: "Once a month, we open the studio doors. Meet the materials, observe the creative process, or join an intimate hands-on session.",
    blogIndex: "04 / Studio journal", blogTitle: "Up close.", blogLead: "The process, people, and materials that shape our studio every day.",
    blogPosts: ["The memory of clay", "The silence of a portrait", "Signs in nature"], blogRead: "Read the story",
    places: "places", session: "session", monthly: "per month", question: "Have an idea?", contact: "Let’s give it form.", write: "Write to us", location: "Vilnius · Lithuania / Bergen · Norway",
  },
  no: {
    language: "Språk", navLabel: "Hovednavigasjon", mobileNavLabel: "Mobilnavigasjon",
    nav: ["Om oss", "Arbeider", "Studio", "Kontakt"], menu: "Meny", close: "Lukk",
    eyebrow: "Kreativt studio · Vilnius", heroFirst: "Levende", heroSecond: "materiale",
    heroNote: "Form oppstår der hendene møter materialet. Vi skaper langsomt, modig og for å vare.", scroll: "Rull",
    manifestoIndex: "01 / Manifest", manifestoStart: "Vi lager ikke ting. Vi skaper et ", manifestoEm: "bånd", manifestoEnd: " til dem.",
    manifestoText: "MATERIJA er et uavhengig kreativt studio der leire, tekstil og pigment blir til samtidige fortellinger. Hvert verk er laget for hånd og bevarer skaperens uperfekte, levende spor.",
    worksIndex: "02 / Utvalgte arbeider", collection: "Samling", filterLabel: "Filtrer arbeider", openWork: "Åpne kunstverk",
    filters: { all: "Alle", painting: "Maleri", ceramics: "Keramikk", graphics: "Grafikk" },
    works: { evening: "Kveldsportrett", hands: "Mesterens hender", laurel: "Laurbærtegn", materials: "Materialdialog", nefertiti: "Nefertiti" },
    studioIndex: "03 / Åpent studio", studioTitle: "Kom inn.",
    studioText: "Én gang i måneden åpner vi studiodørene. Bli kjent med materialene, se den kreative prosessen eller bli med på en liten praktisk økt.",
    blogIndex: "04 / Studiojournal", blogTitle: "På nært hold.", blogLead: "Prosessen, menneskene og materialene som former studioet vårt hver dag.",
    blogPosts: ["Leirens minne", "Stillheten i et portrett", "Tegn i naturen"], blogRead: "Les historien",
    places: "plasser", session: "økt", monthly: "per måned", question: "Har du en idé?", contact: "La oss gi den form.", write: "Skriv til oss", location: "Vilnius · Litauen / Bergen · Norge",
  },
};

const languageNames = { lt: "Lietuvių", en: "English", no: "Norsk" };
const navTargets = ["apie", "darbai", "studija", "kontaktai"];
const filterKeys = ["all", "painting", "ceramics", "graphics"];

// Full essays are separate from card summaries so an open article can switch
// immediately whenever the site language changes.
const blogEssays = {
  lt: [
  {
    title: "Molio atmintis",
    paragraphs: [
      "Molis atrodo kaip paprasta medžiaga – žemė, sumaišyta su vandeniu. Tačiau žmogaus rankose jis tampa kažkuo daugiau. Kiekvienas prisilietimas, piršto įspaudas ar nedidelė klaida palieka jame pėdsaką. Todėl galima sakyti, kad molis turi savo atmintį.",
      "Kai meistras pradeda formuoti molį, jis ne visada tiksliai žino, koks bus galutinis rezultatas. Kartais forma pakrypsta, paviršiuje atsiranda nelygumų ar pirštų žymių. Pramoninėje gamyboje tokie dalykai dažnai būtų laikomi trūkumais, tačiau rankų darbo kūrinyje jie parodo, kad daiktą sukūrė žmogus, o ne mašina.",
      "Išdegus molį, jo forma tampa tvirta. Tai, kas anksčiau buvo minkšta ir lengvai pakeičiama, išlieka ilgam. Puodelis, dubuo ar nedidelė skulptūra gali būti naudojami daugelį metų ir priminti žmogų, kuris juos pagamino, vietą, kur jie buvo sukurti, ar tam tikrą gyvenimo laikotarpį.",
      "Todėl „molio atmintis“ man reiškia ne tik fizinius pėdsakus medžiagoje. Tai ir žmogaus darbo, laiko bei patirties išsaugojimas. Molis nekalba, tačiau jo forma gali papasakoti savo istoriją.",
    ],
  },
  {
    title: "Portreto tyla",
    paragraphs: [
      "Portretas dažniausiai vaizduoja žmogų, tačiau jis nepasako, ką tas žmogus galvoja ar jaučia. Mes matome veidą, akis, laikyseną, kartais aplinką, bet visa kita turime suprasti patys. Būtent todėl portrete tyla gali būti svarbesnė už žodžius.",
      "Žiūrėdamas į portretą dažnai pirmiausia atkreipiu dėmesį į akis. Jos gali atrodyti ramios, pavargusios, liūdnos ar net šaltos. Tačiau tai dar nereiškia, kad žmogus iš tikrųjų taip jautėsi. Dailininkas pasirenka, ką parodyti, o ką palikti paslėpta. Kartais viena veido išraiška pasako daugiau nei ilgas pasakojimas.",
      "Portreto tyla suteikia žiūrovui laisvę interpretuoti. Du žmonės gali žiūrėti į tą patį paveikslą ir pamatyti visiškai skirtingas istorijas. Vienam žmogus portrete gali atrodyti vienišas, kitam – susimąstęs ar tiesiog ramus. Nėra vieno teisingo atsakymo.",
      "Man atrodo, kad būtent ši nežinomybė daro portretą įdomų. Jis sustabdo vieną žmogaus gyvenimo akimirką, tačiau nepaaiškina jos. Portretas tyli, o žiūrovas pats turi nuspręsti, ką ta tyla jam sako.",
    ],
  },
  {
    title: "Ženklai gamtoje",
    paragraphs: [
      "Gamta nuolat keičiasi ir palieka daugybę ženklų. Dažnai mes jų nepastebime, nes skubame ir žiūrime tik į tai, kas akivaizdu. Tačiau sustojus galima pamatyti, kad beveik kiekvienas gamtos pokytis kažką pasakoja.",
      "Debesys gali pranešti apie artėjantį lietų, stiprus vėjas – apie besikeičiantį orą, o pirmieji gelstantys lapai primena apie artėjantį rudenį. Gyvūnai taip pat palieka ženklus. Pėdsakai sniege ar purve parodo, kas čia buvo anksčiau, net jei paties gyvūno jau seniai nematyti.",
      "Man įdomūs ir tie ženklai, kurie atsiranda labai lėtai. Sena nulūžusi medžio šaka, vandens nugludintas akmuo ar vėjo pakeista pakrantė rodo, kad gamta niekada iš tikrųjų nestovi vietoje. Kartais pokyčiui reikia kelių minučių, o kartais – daugybės metų.",
      "Žmogus taip pat palieka savo ženklus gamtoje. Takai, pastatai ir šiukšlės parodo mūsų buvimą, tačiau ne visi šie pėdsakai yra geri. Todėl gamtos ženklus verta ne tik pastebėti, bet ir suprasti.",
      "Gamta nekalba žmogaus kalba, tačiau informacijos joje yra visur. Reikia tik išmokti žiūrėti atidžiau.",
    ],
  },
  ],
  en: [
    {
      title: "The Memory of Clay",
      paragraphs: [
        "Clay looks like a simple material—earth mixed with water. Yet in human hands, it becomes something more. Every touch, fingerprint, or small mistake leaves a trace in it. This is why we can say that clay has a memory of its own.",
        "When a craftsperson begins shaping clay, they do not always know exactly what the final result will be. Sometimes the form tilts, or irregularities and fingerprints appear on the surface. In industrial production, such things would often be considered defects, but in a handmade piece they reveal that the object was created by a person, not a machine.",
        "Once the clay is fired, its form becomes solid. What was once soft and easy to change remains for a long time. A cup, a bowl, or a small sculpture can be used for many years and recall the person who made it, the place where it was created, or a particular period in someone’s life.",
        "For me, therefore, the “memory of clay” means more than the physical marks left in the material. It is also the preservation of human work, time, and experience. Clay does not speak, yet its form can tell its own story.",
      ],
    },
    {
      title: "The Silence of a Portrait",
      paragraphs: [
        "A portrait usually depicts a person, but it does not tell us what that person thinks or feels. We see a face, eyes, posture, and sometimes the surroundings, but everything else is ours to understand. This is precisely why silence in a portrait can be more important than words.",
        "When I look at a portrait, my attention often goes first to the eyes. They may seem calm, tired, sad, or even cold. Yet this does not necessarily mean that the person truly felt that way. The artist chooses what to reveal and what to leave hidden. Sometimes a single facial expression says more than a long story.",
        "The silence of a portrait gives the viewer freedom to interpret. Two people can look at the same painting and see completely different stories. To one, the person in the portrait may appear lonely; to another, thoughtful or simply calm. There is no single correct answer.",
        "I believe it is precisely this uncertainty that makes a portrait interesting. It freezes one moment in a person’s life without explaining it. The portrait remains silent, and the viewer must decide what that silence is saying to them.",
      ],
    },
    {
      title: "Signs in Nature",
      paragraphs: [
        "Nature is constantly changing and leaving countless signs. We often fail to notice them because we are in a hurry and look only at what is obvious. But when we stop, we can see that almost every change in nature tells a story.",
        "Clouds may announce approaching rain, a strong wind may signal changing weather, and the first yellowing leaves remind us that autumn is near. Animals leave signs as well. Tracks in snow or mud reveal who was there before, even when the animal itself has long since disappeared.",
        "I am also fascinated by signs that appear very slowly. An old broken branch, a stone polished by water, or a shoreline reshaped by wind shows that nature never truly stands still. Sometimes change takes only a few minutes; at other times, it takes many years.",
        "People also leave their signs in nature. Paths, buildings, and litter reveal our presence, but not all of these traces are good. That is why signs in nature deserve not only to be noticed, but also understood.",
        "Nature does not speak in human language, yet information is everywhere within it. We only need to learn to look more closely.",
      ],
    },
  ],
  no: [
    {
      title: "Leirens minne",
      paragraphs: [
        "Leire ser ut som et enkelt materiale – jord blandet med vann. Men i menneskehender blir den til noe mer. Hver berøring, hvert fingeravtrykk og hver lille feil etterlater et spor. Derfor kan vi si at leiren har sitt eget minne.",
        "Når en håndverker begynner å forme leiren, vet hen ikke alltid nøyaktig hvordan det endelige resultatet vil bli. Noen ganger heller formen litt, eller det oppstår ujevnheter og fingermerker i overflaten. I industriell produksjon ville slikt ofte blitt betraktet som feil, men i et håndlaget verk viser det at gjenstanden er skapt av et menneske, ikke en maskin.",
        "Når leiren er brent, blir formen fast. Det som tidligere var mykt og lett å forandre, bevares lenge. En kopp, en skål eller en liten skulptur kan brukes i mange år og minne om personen som laget den, stedet der den ble skapt, eller en bestemt periode i livet.",
        "For meg betyr derfor «leirens minne» mer enn de fysiske sporene i materialet. Det handler også om å bevare menneskelig arbeid, tid og erfaring. Leiren snakker ikke, men formen kan fortelle sin egen historie.",
      ],
    },
    {
      title: "Stillheten i et portrett",
      paragraphs: [
        "Et portrett viser som regel et menneske, men forteller ikke hva personen tenker eller føler. Vi ser ansiktet, øynene, kroppsholdningen og noen ganger omgivelsene, men resten må vi forstå selv. Nettopp derfor kan stillheten i et portrett være viktigere enn ord.",
        "Når jeg ser på et portrett, legger jeg ofte først merke til øynene. De kan virke rolige, slitne, triste eller til og med kalde. Men det betyr ikke nødvendigvis at personen virkelig følte det slik. Kunstneren velger hva som skal vises, og hva som skal forbli skjult. Noen ganger sier ett ansiktsuttrykk mer enn en lang fortelling.",
        "Stillheten i portrettet gir betrakteren frihet til å tolke. To mennesker kan se på det samme bildet og oppfatte helt forskjellige historier. For én kan personen i portrettet virke ensom, for en annen ettertenksom eller ganske enkelt rolig. Det finnes ikke ett riktig svar.",
        "Jeg synes det er nettopp denne uvissheten som gjør portrettet interessant. Det stanser ett øyeblikk i et menneskes liv, men forklarer det ikke. Portrettet tier, og betrakteren må selv avgjøre hva stillheten forteller.",
      ],
    },
    {
      title: "Tegn i naturen",
      paragraphs: [
        "Naturen forandrer seg hele tiden og etterlater utallige tegn. Ofte legger vi ikke merke til dem fordi vi har det travelt og bare ser det som er åpenbart. Men når vi stanser opp, kan vi oppdage at nesten enhver endring i naturen forteller noe.",
        "Skyer kan varsle regn, sterk vind kan fortelle om vær i endring, og de første gulnende bladene minner oss om at høsten nærmer seg. Dyr etterlater også tegn. Spor i snø eller gjørme viser hvem som var der tidligere, selv om dyret for lengst er borte.",
        "Jeg er også fascinert av tegnene som oppstår svært langsomt. En gammel brukket gren, en stein slipt av vann eller en kystlinje formet av vinden viser at naturen aldri virkelig står stille. Noen ganger tar en forandring bare noen minutter, andre ganger mange år.",
        "Mennesker etterlater også sine tegn i naturen. Stier, bygninger og søppel viser at vi har vært der, men ikke alle disse sporene er gode. Derfor er det verdt både å legge merke til og å forstå naturens tegn.",
        "Naturen snakker ikke menneskenes språk, men informasjonen finnes overalt. Vi må bare lære å se nøyere etter.",
      ],
    },
  ],
};

/**
 * A single animation loop passes pointer and scroll coordinates to CSS.
 * Individual layers apply different multipliers to create visual depth.
 */
function useParallax(studioRef, blogRef) {
  useEffect(() => {
    const root = document.documentElement;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, frame;
    const onPointer = (event) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const update = () => {
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;
      root.style.setProperty("--mx", currentX.toFixed(3));
      root.style.setProperty("--my", currentY.toFixed(3));
      root.style.setProperty("--scroll", window.scrollY.toFixed(1));
      if (studioRef.current) root.style.setProperty("--studio-top", studioRef.current.offsetTop.toFixed(1));
      if (blogRef.current) root.style.setProperty("--blog-top", blogRef.current.offsetTop.toFixed(1));
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    frame = requestAnimationFrame(update);
    return () => {
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(frame);
    };
  }, [studioRef, blogRef]);
}

/** Language selector that closes when the user clicks outside it. */
function LanguagePicker({ language, setLanguage, t }) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const close = (event) => !pickerRef.current?.contains(event.target) && setOpen(false);
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, []);

  return (
    <div className="language-picker" ref={pickerRef}>
      <button className="language-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="listbox" aria-label={t.language}>
        <span aria-hidden="true">◎</span> {language.toUpperCase()} <i aria-hidden="true">⌄</i>
      </button>
      <div className={`language-menu ${open ? "open" : ""}`} role="listbox" aria-label={t.language}>
        {Object.entries(languageNames).map(([code, name]) => (
          <button key={code} className={language === code ? "active" : ""} role="option" aria-selected={language === code} onClick={() => { setLanguage(code); setOpen(false); }}>
            <span>{code.toUpperCase()}</span>{name}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Fixed navigation and a menu optimized for small screens. */
function Header({ menuOpen, setMenuOpen, language, setLanguage, t }) {
  const close = () => setMenuOpen(false);
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#pradzia" onClick={close}>MATERIJA®</a>
        <nav className="desktop-nav" aria-label={t.navLabel}>
          {t.nav.map((label, index) => <a key={navTargets[index]} href={`#${navTargets[index]}`}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <LanguagePicker language={language} setLanguage={setLanguage} t={t} />
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-menu">
            {menuOpen ? t.close.toUpperCase() : t.menu.toUpperCase()}
          </button>
        </div>
      </header>
      <nav id="mobile-menu" className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-label={t.mobileNavLabel} aria-hidden={!menuOpen}>
        {t.nav.map((label, index) => <a key={navTargets[index]} href={`#${navTargets[index]}`} onClick={close}>{label}</a>)}
      </nav>
    </>
  );
}

/** Filterable artwork gallery with a full-size image modal. */
function Gallery({ t }) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const filteredWorks = useMemo(() => filter === "all" ? works : works.filter((work) => work.category === filter), [filter]);

  useEffect(() => {
    document.body.classList.toggle("modal-open", Boolean(selected));
    const closeOnEscape = (event) => event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selected]);

  return (
    <section className="collection" id="darbai">
      <div className="collection-head">
        <div><span className="section-index">{t.worksIndex}</span><h2>{t.collection}</h2></div>
        <div className="filters" role="group" aria-label={t.filterLabel}>
          {filterKeys.map((key) => <button key={key} className={`filter ${filter === key ? "active" : ""}`} onClick={() => setFilter(key)}>{t.filters[key]}</button>)}
        </div>
      </div>
      <div className="gallery">
        {filteredWorks.map((work) => {
          const title = t.works[work.key];
          return (
            <figure className="art-card" key={work.id}>
              <button onClick={() => setSelected(work)} aria-label={`${t.openWork}: ${title}`}>
                <img src={work.small || work.image} srcSet={work.small ? `${work.small} 720w, ${work.image} 1400w` : undefined} sizes="(max-width: 800px) 100vw, 65vw" alt={title} loading="lazy" />
                <span className="art-meta"><span>{String(work.id).padStart(2, "0")} — {title}</span><span>{t.filters[work.category]}</span></span>
              </button>
            </figure>
          );
        })}
      </div>
      {selected && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={t.works[selected.key]} onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}>
          <button className="modal-close" onClick={() => setSelected(null)}>{t.close.toUpperCase()} ×</button>
          <figure className="modal-figure"><img src={selected.image} alt={t.works[selected.key]} /><figcaption><span>{t.works[selected.key]}</span><span>{t.filters[selected.category]} / 2026</span></figcaption></figure>
        </div>
      )}
    </section>
  );
}

/** Parallax journal with three localized essay modals. */
function StudioBlog({ t, language, blogRef }) {
  const [selectedStory, setSelectedStory] = useState(null);
  const [hoveredStory, setHoveredStory] = useState(null);
  const storyLinkRefs = useRef([]);
  const posts = [
    { image: "/images/master-hands-720.webp", date: "18.08.2026" },
    { image: "/images/margarita-evening-768.webp", date: "02.08.2026" },
    { image: "/images/laurel-wreath-720.webp", date: "21.07.2026" },
  ];

  useEffect(() => {
    document.body.classList.toggle("modal-open", selectedStory !== null);
    const closeOnEscape = (event) => event.key === "Escape" && setSelectedStory(null);
    // A strong CSS transform can offset the browser's regular hit area.
    // Check the visible label's actual rectangle in screen coordinates.
    const getVisibleLabelIndex = (clientX, clientY) => storyLinkRefs.current.findIndex((label) => {
        if (!label) return false;
        const rect = label.getBoundingClientRect();
        return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
      });
    const openFromVisibleLabel = (event) => {
      if (selectedStory !== null || (event.pointerType === "mouse" && event.button !== 0)) return;
      const index = getVisibleLabelIndex(event.clientX, event.clientY);
      if (index !== -1) setSelectedStory(index);
    };
    const trackVisibleLabel = (event) => {
      if (selectedStory !== null || event.pointerType !== "mouse") return;
      const index = getVisibleLabelIndex(event.clientX, event.clientY);
      setHoveredStory(index === -1 ? null : index);
    };
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", openFromVisibleLabel, true);
    window.addEventListener("pointermove", trackVisibleLabel, true);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", openFromVisibleLabel, true);
      window.removeEventListener("pointermove", trackVisibleLabel, true);
    };
  }, [selectedStory]);

  return (
    <section className="studio-blog" id="studio-blog" ref={blogRef}>
      <div className="blog-stage">
        <div className="blog-atmosphere" aria-hidden="true" />
        <div className="blog-ring blog-ring-one" aria-hidden="true" />
        <div className="blog-ring blog-ring-two" aria-hidden="true" />
        <header className="blog-heading">
          <span className="section-index">{t.blogIndex}</span>
          <h2>{t.blogTitle}</h2>
          <p>{t.blogLead}</p>
        </header>
        <div className="blog-cards">
          {posts.map((post, index) => (
            <article className={`blog-card blog-card-${index + 1}`} key={post.date}>
              <div className="blog-image"><img src={post.image} alt={t.blogPosts[index]} loading="lazy" /></div>
              <div className="blog-meta"><span>{post.date}</span><span>0{index + 1}</span></div>
              <h3>{t.blogPosts[index]}</h3>
              <button
                type="button"
                className={hoveredStory === index ? "visual-hover" : ""}
                onClick={(event) => event.detail === 0 && setSelectedStory(index)}
                aria-haspopup="dialog"
              >
                <span ref={(element) => { storyLinkRefs.current[index] = element; }}>{t.blogRead} ↗</span>
              </button>
            </article>
          ))}
        </div>
      </div>
      {selectedStory !== null && (
        <div className="modal story-modal" role="dialog" aria-modal="true" aria-labelledby="story-title" onMouseDown={(event) => event.target === event.currentTarget && setSelectedStory(null)}>
          <button className="modal-close" onClick={() => setSelectedStory(null)}>{t.close.toUpperCase()} ×</button>
          <article className="story-dialog">
            <div className="story-hero">
              <img src={posts[selectedStory].image} alt="" />
              <span>0{selectedStory + 1} / MATERIJA</span>
            </div>
            <div className="story-copy">
              <span className="section-index">{t.blogIndex}</span>
              <h2 id="story-title">{blogEssays[language][selectedStory].title}</h2>
              {blogEssays[language][selectedStory].paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

/** Root component controlling language, navigation, and parallax scene refs. */
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("lt");
  const studioRef = useRef(null);
  const blogRef = useRef(null);
  const t = translations[language] || translations.lt;
  useParallax(studioRef, blogRef);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    // The `lang` attribute helps search engines and screen readers.
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="app">
      <div className="noise" aria-hidden="true" />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} language={language} setLanguage={setLanguage} t={t} />
      <main>
        <section className="hero" id="pradzia">
          <div className="hero-layer hero-back" aria-hidden="true" />
          <div className="hero-layer hero-grid" aria-hidden="true" />
          <div className="hero-layer hero-halo" aria-hidden="true" />
          <div className="hero-layer hero-orbit" aria-hidden="true" />
          <div className="hero-layer hero-portrait" aria-hidden="true"><img src="/images/hero-girl-1536.webp" alt="" /></div>
          <div className="hero-copy"><span className="eyebrow">{t.eyebrow}</span><h1>{t.heroFirst}<span>{t.heroSecond}</span></h1></div>
          <p className="hero-note">{t.heroNote}</p>
          <div className="scroll-cue" aria-hidden="true"><span>{t.scroll}</span><i /></div>
        </section>

        <section className="manifesto" id="apie">
          <span className="section-index">{t.manifestoIndex}</span>
          <div><h2>{t.manifestoStart}<em>{t.manifestoEm}</em>{t.manifestoEnd}</h2><p>{t.manifestoText}</p></div>
        </section>

        <Gallery t={t} />

        <section className="studio" id="studija" ref={studioRef}>
          <div className="studio-bg" aria-hidden="true" />
          <div className="studio-depth-image" aria-hidden="true"><img src="/images/master-hands-720.webp" alt="" /></div>
          <div className="studio-depth-line" aria-hidden="true" />
          <div className="studio-content">
            <span className="section-index">{t.studioIndex}</span>
            <h2>{t.studioTitle}</h2>
            <p>{t.studioText}</p>
            <div className="studio-stats"><div><strong>12</strong><span>{t.places}</span></div><div><strong>3 h</strong><span>{t.session}</span></div><div><strong>1×</strong><span>{t.monthly}</span></div></div>
          </div>
        </section>

        <StudioBlog t={t} language={language} blogRef={blogRef} />

        <section className="contact" id="kontaktai">
          <div className="contact-top"><h2>{t.question}<br /><em>{t.contact}</em></h2><a className="round-link" href="mailto:labas@materija.lt">{t.write} ↗</a></div>
          <footer className="footer-line"><span>© 2026 MATERIJA kūrybos studija by LovLaus Media</span><span>{t.location}</span></footer>
        </section>
      </main>
    </div>
  );
}

// React application entry point.
createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
