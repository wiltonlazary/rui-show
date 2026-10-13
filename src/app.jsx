// rui-show's shell, written with rui-core: a header (the brand, search, the
// color scheme and the accent color), a sidebar of every page in its group,
// and the current page, with previous and next.
// Changing the page stops the previous one's scope, so its demo roots go
// with it. The settings (scheme, accent color, renderer) are signals kept
// in the root's Storage; the shell and every demo root read them, the demos
// through their props. The search is a TextInput filtering the sidebar's
// NavItems; Ctrl or Cmd+K opens a Launcher over every page. Enter and the
// Launcher take the best title match first (`ranked`). On a phone
// (below the theme's md breakpoint) the header keeps the brand and the
// scheme, and a NavToggle opens the pages, the search and the accent colors
// in a Drawer, which choosing a page closes. Landmarks: the header is the
// banner, the page list the navigation, the content the main region, which
// a skip link (shown on focus) gives the focus to: a ScrollBox out of the Tab
// order (tabIndex -1), focused through its ref on every renderer.

import { $signal, $read, $write, $lookup, $cleanup, $owner, $watch, $memo } from 'rrx-core';
import { $active, Runtime, Storage, For, Show, View } from 'ren-core';
import { Rui, Surface, Box, Stack, Row, Container, Text, Pressable, TextInput, NavItem, SegmentedControl, Swatch, ScrollBox, Button, Divider, Drawer, NavToggle, $ui, pageColors, BASE_THEME } from 'rui-core';
import { $fits } from 'rui-core/hooks';
import { Launcher, launcherStore } from 'rui-core/launcher';
import { pages as found } from './pages/index.generated.js';
import { GROUPS, RENDERERS, ACCENTS, DEFAULTS, ordered, themeFor, settled } from './site.js';
import { Home } from './home.jsx';
import { PageView } from './page.jsx';

/** @typedef {import('./site.js').PageRecord} PageRecord */
/** @typedef {import('./site.js').Settings} Settings */
/** @typedef {import('./site.js').RendererId} RendererId */

/** Every page, in the sidebar's order. */
export const pages = ordered(found);

/** Below the theme's md breakpoint (`60em`), a hundredth of its unit less: a phone's or a narrow window's layout. */
export const PHONE = BASE_THEME.breakpoints.md.replace(/^([\d.]+)(\D*)$/, (_, n, unit) => `(max-width: ${Number(n) - 0.01}${unit})`);

/** The page a hash names, or null for the home page. @param {string} hash */
export const find = hash => pages.find(p => p.id === hash.replace(/^#\/?/, '')) ?? null;

/** Whether a page matches every word of a search. @param {PageRecord} page @param {string} query */
export const matches = (page, query) => {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const group = GROUPS.find(g => g.id === page.group)?.title ?? '';
  const text = `${page.title} ${group} ${page.description}`.toLowerCase();
  return words.every(w => text.includes(w));
};

/**
 * How well a page's title answers a search, best first: 0 the title
 * itself, 1 its start, 2 inside it, 3 every word in it, 4 found only in its
 * group or description. Case is ignored.
 * @param {PageRecord} page @param {string} query
 */
export const rankOf = (page, query) => {
  const q = query.toLowerCase().trim().replace(/\s+/g, ' ');
  const title = page.title.toLowerCase();
  if (title === q) return 0;
  if (title.startsWith(q)) return 1;
  if (title.includes(q)) return 2;
  return q.split(' ').every(w => title.includes(w)) ? 3 : 4;
};

/** Pages by how well their title answers a search, ties in the order given (the sidebar's). @param {PageRecord[]} list @param {string} query */
export const ranked = (list, query) => [...list].sort((a, b) => rankOf(a, query) - rankOf(b, query));

/** The document's title on a page: `<Page> · rui-show`, `rui-show` at home. @param {PageRecord | null} page */
export const titleOf = page => (page === null ? 'rui-show' : `${page.title} · rui-show`);

/** @param {{ start?: string, window?: any }} props */
export function App(props) {
  const R = $active();
  // The settings are kept in the root's storage, where there is one.
  const shelf = $lookup(Storage);
  const store = { get: (/** @type {string} */ key) => shelf?.get(key) ?? null, set: (/** @type {string} */ key, /** @type {string} */ value) => shelf?.set(key, value) };
  const view = props.window ?? null;
  const dark = view?.matchMedia?.('(prefers-color-scheme: dark)')?.matches === true;
  const kept = /** @type {Settings} */ (settled({ scheme: store.get('scheme') ?? (dark ? 'dark' : 'light'), accent: store.get('accent') ?? DEFAULTS.accent }));
  const settings = $signal(R, kept);
  const renderer = $signal(R, /** @type {RendererId} */ (RENDERERS.find(r => r.id === store.get('renderer'))?.id ?? 'dom'));
  const current = $signal(R, find(props.start ?? ''));
  const query = $signal(R, '');
  /** @param {Partial<Settings>} change */
  const set = change => {
    const next = { ...$read(settings), ...change };
    $write(settings, next);
    store.set('scheme', next.scheme);
    store.set('accent', next.accent);
  };
  /** @param {RendererId} id */
  const use = id => {
    $write(renderer, id);
    store.set('renderer', id);
  };
  /** @param {PageRecord | null} page */
  const go = page => {
    $write(current, page);
    const hash = page === null ? '' : `#${page.id}`;
    if (view !== null && view.location.hash !== hash) view.history?.pushState?.(null, '', hash || view.location.pathname + view.location.search);
  };
  if (view !== null) {
    // Back and forward follow the hash.
    const follow = () => $write(current, find(view.location.hash));
    view.addEventListener('hashchange', follow);
    view.addEventListener('popstate', follow);
    $cleanup(/** @type {any} */ ($owner(R)), () => {
      view.removeEventListener('hashchange', follow);
      view.removeEventListener('popstate', follow);
    });
  }
  // The page outside the shell (body, scrollbars) takes the scheme's
  // colors, from rui-core's theme.
  const doc = /** @type {any} */ ($lookup(Runtime).element)?.ownerDocument ?? null;
  if (doc !== null) {
    $watch(R, () => $read(settings), s => {
      const theme = themeFor(s.accent);
      const page = pageColors(theme, s.scheme);
      const html = doc.documentElement;
      html.setAttribute('data-scheme', s.scheme);
      html.style.colorScheme = s.scheme;
      for (const [key, value] of Object.entries({ body: page.body, text: page.text })) html.style.setProperty(`--rui-${key}`, value);
    });
  }
  return (
    <Rui theme={() => themeFor($read(settings).accent)} scheme={() => $read(settings).scheme}>
      <Shell settings={settings} renderer={renderer} current={current} query={query} set={set} use={use} go={go} window={view} />
    </Rui>
  );
}

/**
 * @param {{ settings: any, renderer: any, current: any, query: any, set: (c: Partial<Settings>) => void, use: (id: RendererId) => void, go: (p: PageRecord | null) => void, window: any }} props
 */
function Shell(props) {
  const R = $active();
  const { settings, renderer, current, query } = props;
  const ui = $ui();
  const listed = $memo(R, () => pages.filter(p => matches(p, $read(query))));
  const phone = $fits(PHONE).value;
  const menu = $signal(R, false);
  // Choosing a page closes the menu.
  /** @param {PageRecord | null} p */
  const go = p => {
    $write(menu, false);
    props.go(p);
  };
  // Every page in a Launcher, opened by Ctrl or Cmd+K anywhere. The window
  // hears it after the roots' own root-wide keys (a demo's Launcher on its
  // page keeps the key it took).
  const launcher = launcherStore(R);
  const action = (/** @type {PageRecord} */ p) => ({ id: p.id, label: p.title, hint: GROUPS.find(g => g.id === p.group)?.title ?? '', tags: [p.description], onPress: () => go(p) });
  const every = new Map(pages.map(p => [p, action(p)]));
  // The Launcher keeps the order it is given: a title the search names comes first.
  const actions = () => ranked(pages, launcher.search()).map(p => /** @type {ReturnType<typeof action>} */ (every.get(p)));
  const page = props.window;
  if (page !== null) {
    const keys = (/** @type {KeyboardEvent} */ e) => {
      if (e.defaultPrevented) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        launcher.open();
      }
    };
    page.addEventListener('keydown', keys);
    $cleanup(/** @type {any} */ ($owner(R)), () => page.removeEventListener('keydown', keys));
  }
  const at = (/** @type {number} */ step) => () => {
    const here = $read(current);
    const i = here === null ? -1 : pages.indexOf(here);
    const j = i + step;
    return j < 0 || j >= pages.length ? null : pages[j];
  };
  /** @type {any} */
  let content = null;
  // A new page starts at its top, and names the browser's tab.
  $watch(R, () => $read(current), (/** @type {PageRecord | null} */ p) => {
    if (content !== null) content.scrollTop = 0;
    if (page !== null) page.document.title = titleOf(p);
  });
  // Wide again: the menu is the sidebar.
  $watch(R, () => $read(phone), on => {
    if (!on) $write(menu, false);
  });
  const scheme = () => $read(settings).scheme;
  // The skip link: out of sight (one clipped pixel) until the keyboard reaches it.
  const skipping = $signal(R, false);
  const skip = () => content?.focus?.();
  const search = (/** @type {Record<string, any>} */ more) => (
    <TextInput
      placeholder="Search components (Ctrl K)"
      size="sm"
      {...more}
      value={() => $read(query)}
      onChange={(/** @type {string} */ v) => $write(query, v)}
      onKey={(/** @type {any} */ e) => {
        if (e.key === 'Enter') {
          // The best title match, not the sidebar's first: 'table' opens Table.
          const first = ranked($read(listed), $read(query))[0];
          if (first !== undefined) go(first);
        } else if (e.key === 'Escape') $write(query, '');
      }}
    />
  );
  const swatches = () => (
    <Row gap={() => ($read(phone) ? 8 : 4)} wrap={() => $read(phone)}>
      {ACCENTS.map(name => (
        <Pressable label={`Accent color ${name}`} onPress={() => props.set({ accent: name })}>
          <Swatch color={`${name}.6`} size={() => ($read(phone) ? 28 : 20)} shadowed={false}>
            {() => ($read(settings).accent === name ? <Box w={8} h={8} bg="white" style={{ radius: 4 }} /> : null)}
          </Swatch>
        </Pressable>
      ))}
    </Row>
  );
  return (
    <Surface radius={0} h="100%" style={{ direction: 'column' }}>
      <Launcher store={launcher} shortcut={null} actions={actions} limit={50} empty="No matches" placeholder="Search pages..." />
      <Drawer open={() => $read(menu)} onOpenChange={(/** @type {boolean} */ o) => $write(menu, o)} at="start" size={280} title="Pages" padding="md">
        <Stack gap="md">
          {search({ w: '100%' })}
          <Stack gap="xs">
            <Text size="sm" fg="quiet">
              Accent color
            </Text>
            {swatches()}
          </Stack>
          <Divider />
          <Nav listed={listed} current={current} go={go} />
        </Stack>
      </Drawer>
      <View
        onFocusIn={() => $write(skipping, true)}
        onFocusOut={() => $write(skipping, false)}
        style={() => ($read(skipping) ? { position: 'absolute', top: 8, left: 8, zIndex: 10 } : { position: 'absolute', width: 1, height: 1, overflow: 'hidden', margin: -1 })}
      >
        <Button size="sm" onPress={skip}>
          Skip to content
        </Button>
      </View>
      <Row role="banner" h={56} px={() => ($read(phone) ? 'sm' : 'md')} gap="md" justify="between" wrap={false} style={{ shrink: 0 }}>
        <Row gap="xs" wrap={false}>
          <Show when={() => $read(phone)}>
            {() => <NavToggle open={() => $read(menu)} onPress={() => $write(menu, !$read(menu))} label="Open the pages" size="sm" />}
          </Show>
          <Pressable label="rui-show home" fg={() => pageColors(ui.theme(), ui.scheme()).text} onPress={() => go(null)}>
            <Row gap={6} wrap={false}>
              <Box w={22} h={22} bg={() => $read(settings).accent} style={{ radius: 6 }} />
              <Text size="xl" fontWeight={700}>
                rui
              </Text>
            </Row>
          </Pressable>
          <Text size="sm" fg="quiet">
            show
          </Text>
        </Row>
        <Show when={() => !$read(phone)}>{() => search({ w: 360, minWidth: 120, style: { shrink: 1 } })}</Show>
        <Row gap="sm" wrap={false}>
          <SegmentedControl
            aria-label="Color scheme"
            size="xs"
            data={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
            value={scheme}
            onChange={(/** @type {'light' | 'dark'} */ v) => props.set({ scheme: v })}
          />
          <Show when={() => !$read(phone)}>{swatches}</Show>
        </Row>
      </Row>
      <Divider />
      <Row gap={0} align="stretch" wrap={false} style={{ grow: 1, minHeight: 0 }}>
        <Show when={() => !$read(phone)}>
          {() => [
            <ScrollBox w={250} h="100%" pt={12} px={12} pb={32} style={{ shrink: 0 }}>
              <Nav listed={listed} current={current} go={go} />
            </ScrollBox>,
            <Divider orientation="vertical" />,
          ]}
        </Show>
        <ScrollBox role="main" id="main" tabIndex={-1} h="100%" minWidth={0} style={{ grow: 1, shrink: 1 }} ref={(/** @type {any} */ el) => (content = el)}>
          <Container size="md" py={() => ($read(phone) ? 'md' : 'xl')} px={() => ($read(phone) ? 'sm' : 'md')} w="100%">
            {() => {
              const p = $read(current);
              if (p === null) return <Home pages={pages} go={go} settings={() => $read(settings)} />;
              return <PageView page={p} renderer={renderer} use={props.use} settings={() => $read(settings)} previous={at(-1)} next={at(1)} go={go} phone={() => $read(phone)} />;
            }}
          </Container>
        </ScrollBox>
      </Row>
    </Surface>
  );
}

/**
 * The pages, grouped, those the search matches: the sidebar's, or the
 * Drawer's on a phone.
 * @param {{ listed: any, current: any, go: (p: PageRecord | null) => void }} props
 */
function Nav(props) {
  const { listed, current, go } = props;
  return (
    <Stack role="navigation" aria-label="Pages" gap={2}>
      <NavItem label="First view" active={() => $read(current) === null} onPress={() => go(null)} />
      {GROUPS.map(group => (
        <Show when={() => $read(listed).some((/** @type {PageRecord} */ p) => p.group === group.id)}>
          {() => (
            <Stack gap={2} mt="md">
              <Text size="xs" fontWeight={700} textTransform="uppercase" fg="quiet" px="sm" pb={4}>
                {group.title}
              </Text>
              <For each={() => $read(listed).filter((/** @type {PageRecord} */ p) => p.group === group.id)}>{p => <NavItem label={p().title} active={() => $read(current) === p()} onPress={() => go(p())} />}</For>
            </Stack>
          )}
        </Show>
      ))}
      <Show when={() => $read(listed).length === 0}>
        {() => (
          <Text size="sm" fg="quiet" px="sm" mt="md">
            No matches
          </Text>
        )}
      </Show>
    </Stack>
  );
}
