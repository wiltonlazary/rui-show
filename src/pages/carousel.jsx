// Carousel (rui-core/carousel): slides by snaps, dragged or moved by the
// controls, the dots and a store; two per view, looping,
// vertical, autoplay.

import { $signal, $read, $write } from 'rrx-core';
import { $active } from 'ren-core';
import { Button, Row, Image, Stack, Text, Surface } from 'rui-core';
import { Carousel, $carousel } from 'rui-core/carousel';
import { landscape, sunset } from '../pictures.js';

const PICTURES = [landscape, sunset, landscape, sunset, landscape];
const COLORS = ['blue.6', 'teal.6', 'purple.6', 'orange.6', 'red.6', 'cyan.6'];
const POSTCARDS = [
  { place: 'Lisbon', bg: 'amber.6' },
  { place: 'Kyoto', bg: 'magenta.6' },
  { place: 'Oaxaca', bg: 'teal.6' },
  { place: 'Tromsø', bg: 'indigo.6' },
];

/** @type {import('../site.js').PageRecord} */
export default {
  id: 'carousel',
  group: 'data',
  title: 'Carousel',
  description: 'Slides in a row (or a column) that scroll by snaps (rui-core/carousel): dragged with momentum, moved by the back and forward controls, the dots, the arrow keys, its `value` or a store from `$carousel()`, and played by `autoplay` on the Clock.',
  props: [
    { name: 'span', type: "string | number | { base }", default: "'100%'", description: 'Each slide’s length: a percent of the viewport (it holds the gap) or pixels (the gap comes between).' },
    { name: 'gap', type: "'xs' … 'xl' | number", default: '0', description: 'The space between slides.' },
    { name: 'align', type: "'start' | 'center' | 'end' | number", default: "'start'", description: 'Where a snapped slide sits: flush with the reading edge by default, a number is a fraction of the viewport.' },
    { name: 'slidesPerMove', type: 'number', default: '1', description: 'How many slides a stop holds, so a control moves that many.' },
    { name: 'loop', type: 'boolean', default: 'false', description: 'The last slide leads to the first.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'The direction; vertical needs `height`.' },
    { name: 'height', type: 'number | string', description: 'The viewport’s height.' },
    { name: 'glide / draggable / fling', type: 'boolean', default: 'false / true / false', description: 'A release glides with its momentum and rests off any stop; drags at all; a fast release may pass several stops.' },
    { name: 'ends', type: "'open' | 'fill'", default: "'open'", description: 'Without a loop, what the strip does past its ends: `open` leaves space where `align` puts it, `fill` keeps the frame filled with content (the stops that land together are one).' },
    { name: 'value / defaultValue', type: 'number | (() => number) | Signal<number> / number', default: '— / 0', description: 'The selected stop’s index (a slide’s index while each slide is its own stop); a new value moves the strip to it.' },
    { name: 'onChange', type: '(index: number) => void', description: 'Called with the selected stop’s index as it moves.' },
    { name: 'duration', type: "'quick' | 'base' | 'calm' | 'hold' | number", default: "'calm' (300 ms)", description: 'A move’s time: a MOTION preset or ms.' },
    { name: 'controls / buttonSize / buttonInset', type: "boolean / number / 'xs' … 'xl'", default: "true / theme.sizes.box.carouselButton (32) / 'xs'", description: 'The back and forward buttons: round, shown disabled where there is nowhere to go, each holding a pointer glyph (BackIcon, ForwardIcon; down and up in a vertical carousel); their size, their inset from the edge.' },
    { name: 'nextIcon / previousIcon / nextLabel / previousLabel', type: 'any / string', default: "ForwardIcon / BackIcon / 'Forward' / 'Back'", description: 'The controls’ icons and accessible labels.' },
    { name: 'dots', type: 'boolean', default: 'false', description: 'A round mark per stop, a sm step in from the edge, the selected one stretched to an lg step and the rest muted; each named `n / total`.' },
    { name: 'keys', type: 'boolean', default: 'true', description: 'ArrowLeft/ArrowRight move it (ArrowUp/ArrowDown when vertical).' },
    { name: 'autoplay', type: 'boolean | number | { delay, stopOnUse, holdOnHover, startPaused }', default: 'false (on: delay 5000)', description: 'Moves on by itself: a drag, a key or a control stops it (`stopOnUse`, true); the pointer over it holds it (`holdOnHover`); it plays at once unless `startPaused`, and never starts by itself while the user asks for reduced motion (`play()` still starts it).' },
    { name: 'onNext / onPrevious', type: '() => void', description: 'Called as a control or key moves it on or back.' },
    { name: 'getHandle', type: '(handle: CarouselHandle) => void', description: 'Receives the same commands as a store.' },
    { name: 'store', type: '$carousel()', description: 'Drives it: `next`, `previous`, `goTo(index, { instant })` (`instant` skips the animation), `selected`, `count`, `hasNext`, `hasPrevious`, `offset`, `autoplay.play/stop/playing`.' },
    { name: 'Carousel.Slide', type: '{ children, style props }', description: 'A slide: its content, sized by the Carousel’s `span` and `gap`.' },
  ],
  demos: [
    {
      title: 'Pictures, with dots',
      code: `
// landscape, sunset: PNG data: URIs
const PICTURES = [landscape, sunset, landscape, sunset, landscape];

function Demo() {
  const at = $signal($active(), 0);
  return (
    <Stack gap="xs">
      <Carousel w={560} height={200} dots value={at} onChange={i => $write(at, i)}>
        {PICTURES.map(src => <Carousel.Slide><Image source={src} h={200} fit="cover" /></Carousel.Slide>)}
      </Carousel>
      <Text size="sm" fg="quiet">{() => \`slide \${$read(at) + 1} / \${PICTURES.length}\`}</Text>
    </Stack>
  );
}`,
      view: () => {
        const at = $signal($active(), 0);
        return (
          <Stack gap="xs">
            <Carousel w={560} height={200} dots value={at} onChange={(/** @type {number} */ i) => $write(at, i)}>
              {PICTURES.map(src => (
                <Carousel.Slide>
                  <Image source={src} h={200} fit="cover" />
                </Carousel.Slide>
              ))}
            </Carousel>
            <Text size="sm" fg="quiet">
              {() => `slide ${$read(at) + 1} / ${PICTURES.length}`}
            </Text>
          </Stack>
        );
      },
      height: 260,
    },
    {
      title: 'A gallery of postcards, two in view',
      code: `
const POSTCARDS = [
  { place: 'Lisbon', bg: 'amber.6' },
  { place: 'Kyoto', bg: 'magenta.6' },
  { place: 'Oaxaca', bg: 'teal.6' },
  { place: 'Tromsø', bg: 'indigo.6' },
];

function Demo() {
  return (
    <Carousel w={520} height={130} span="50%" gap="sm" align="center">
      {POSTCARDS.map(card => (
        <Carousel.Slide>
          <Surface bg={card.bg} h={130} p="md" radius="md">
            <Text fg="white" fontWeight={700}>{'Greetings from ' + card.place}</Text>
          </Surface>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}`,
      view: () => (
        <Carousel w={520} height={130} span="50%" gap="sm" align="center">
          {POSTCARDS.map(card => (
            <Carousel.Slide>
              <Surface bg={card.bg} h={130} p="md" radius="md">
                <Text fg="white" fontWeight={700}>
                  {'Greetings from ' + card.place}
                </Text>
              </Surface>
            </Carousel.Slide>
          ))}
        </Carousel>
      ),
      height: 160,
    },
    {
      title: 'A store and autoplay',
      code: `
const COLORS = ['blue.6', 'teal.6', 'purple.6', 'orange.6', 'red.6', 'cyan.6'];

function Demo() {
  const carousel = $carousel();
  return (
    <Stack gap="sm">
      <Carousel w={400} height={100} store={carousel} controls={false} autoplay={{ delay: 2000, startPaused: true }} loop>
        {COLORS.map(color => <Carousel.Slide><Surface bg={color} h={100} /></Carousel.Slide>)}
      </Carousel>
      <Row gap="xs">
        <Button size="xs" variant="neutral" onPress={() => carousel.previous()}>Previous</Button>
        <Button size="xs" variant="neutral" onPress={() => carousel.next()}>Next</Button>
        <Button size="xs" variant="neutral" onPress={() => carousel.goTo(0)}>First</Button>
        <Button size="xs" variant="neutral" onPress={() => carousel.goTo(carousel.count() - 1, { instant: true })}>Last, at once</Button>
        <Button size="xs" onPress={() => (carousel.autoplay.playing() ? carousel.autoplay.stop() : carousel.autoplay.play())}>{() => (carousel.autoplay.playing() ? 'Stop' : 'Play')}</Button>
        <Text size="sm" fg="quiet">{() => \`\${carousel.selected() + 1} / \${carousel.count()}\`}</Text>
      </Row>
    </Stack>
  );
}`,
      view: () => {
        const carousel = $carousel();
        return (
          <Stack gap="sm">
            <Carousel w={400} height={100} store={carousel} controls={false} autoplay={{ delay: 2000, startPaused: true }} loop>
              {COLORS.map(color => (
                <Carousel.Slide>
                  <Surface bg={color} h={100} />
                </Carousel.Slide>
              ))}
            </Carousel>
            <Row gap="xs">
              <Button size="xs" variant="neutral" onPress={() => carousel.previous()}>
                Previous
              </Button>
              <Button size="xs" variant="neutral" onPress={() => carousel.next()}>
                Next
              </Button>
              <Button size="xs" variant="neutral" onPress={() => carousel.goTo(0)}>
                First
              </Button>
              <Button size="xs" variant="neutral" onPress={() => carousel.goTo(carousel.count() - 1, { instant: true })}>
                Last, at once
              </Button>
              <Button size="xs" onPress={() => (carousel.autoplay.playing() ? carousel.autoplay.stop() : carousel.autoplay.play())}>
                {() => (carousel.autoplay.playing() ? 'Stop' : 'Play')}
              </Button>
              <Text size="sm" fg="quiet">
                {() => `${carousel.selected() + 1} / ${carousel.count()}`}
              </Text>
            </Row>
          </Stack>
        );
      },
      height: 200,
    },
    {
      title: 'Vertical',
      code: `
function Demo() {
  return (
    <Carousel w={300} height={160} orientation="vertical" span="50%" gap="xs" dots>
      {COLORS.map(color => <Carousel.Slide><Surface bg={color} h="100%" radius="sm" /></Carousel.Slide>)}
    </Carousel>
  );
}`,
      view: () => (
        <Carousel w={300} height={160} orientation="vertical" span="50%" gap="xs" dots>
          {COLORS.map(color => (
            <Carousel.Slide>
              <Surface bg={color} h="100%" radius="sm" />
            </Carousel.Slide>
          ))}
        </Carousel>
      ),
      height: 190,
    },
  ],
};
