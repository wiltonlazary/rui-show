// A view on a chosen renderer, in an application root of its own: ren-dom
// (the parent's light DOM), ren-skia (a CanvasKit canvas), ren-three as an
// overlay over a WebGL scene, or as a panel in a small scene you orbit. The
// root gets the theme controls' settings and the stage's width as its props,
// and the view renders inside rui-core's Rui on a Surface that wide, so
// a new scheme, accent color or width restyles it in place on every
// renderer. The Surface is at least the demo's height and grows with what it
// holds (a narrow phone wraps a demo taller); a canvas follows its height.

import { $signal, $read, $write, $lookup, $watch, $untrack, $memo } from 'rrx-core';
import { $active, Root, Props, Pending, Recover, View } from 'ren-core';
import { $dom } from 'ren-dom';
import { $skia } from 'ren-skia';
import { $three } from 'ren-three';
import { Rui, Surface, Text, BASE_THEME } from 'rui-core';
import { Env, loading } from './env.js';
import { settled, themeFor, rootId } from './site.js';

/** @typedef {import('./site.js').RendererId} RendererId */
/** @typedef {import('./site.js').Settings} Settings */

/**
 * The view, themed by the settings (the root's props by default): rui-core's
 * provider around a Surface of the page's colors, as wide as `width` or the
 * settings' width, clipping what passes its box as a canvas clips it. It is
 * `height` high at least, taller as its content needs, which it reports to
 * the settings' `grown` (a canvas stage, or a panel's plane, follows it).
 * @param {{ view: () => any, width?: number, height?: number, settings?: () => Settings & { width?: number, grown?: (height: number) => void } }} props
 */
export function Themed(props) {
  const given = () => (props.settings === undefined ? $lookup(Props) : props.settings());
  const settings = () => settled(given());
  const Demo = props.view;
  return (
    <Rui theme={() => themeFor(settings().accent)} scheme={() => settings().scheme}>
      <View onResize={(/** @type {any} */ e) => e.height > 0 && given()?.grown?.(e.height)}>
        <Surface radius={0} p="md" w={() => props.width ?? given()?.width} minHeight={props.height} style={{ overflow: 'hidden' }}>
          <Demo />
        </Surface>
      </View>
    </Rui>
  );
}

/** A failure to load a renderer's engine, in the page's words. @param {string} what */
const failed = what => (/** @type {Error} */ error) => <Text fg="red">{`${what} is unavailable: ${error.message}`}</Text>;

/**
 * One view on one renderer, in a root named for the demo (`name`,
 * `<page>-<index>`) and the renderer.
 * @param {{ view: () => any, name: string, renderer: RendererId, width: () => number, height: number, settings: () => Settings }} props
 */
export function Stage(props) {
  const env = $lookup(Env);
  const R = $active();
  const { view, width, height, settings } = props;
  const id = rootId(props.renderer, props.name);
  // How high the demo is: its height, or its content's when taller.
  const tall = $signal(R, height);
  /** @param {number} h */
  const grown = h => {
    const next = Math.max(height, Math.ceil(h));
    if (next !== $untrack(R, () => $read(tall))) $write(tall, next);
  };
  // The demo root's props: the settings, the stage's width and the report of its height, read in that root.
  const root = () => ({ ...settings(), width: width(), grown });
  const high = () => $read(tall);
  switch (props.renderer) {
    case 'skia':
      return <OnSkia id={id} view={view} width={width} height={height} high={high} root={root} />;
    case 'three':
    case 'panel':
      return <OnThree id={id} view={view} width={width} height={height} high={high} settings={settings} root={root} panel={props.renderer === 'panel'} />;
    default:
      // In the canvases' fonts and size, so the DOM sets text as Skia and three.js draw it.
      return (
        <Root id={id} props={root} renderer={env.fonts === null ? undefined : $dom(env.fonts.document, { font: env.fonts.font, mono: env.fonts.mono })}>
          {() => <Themed view={view} height={height} />}
        </Root>
      );
  }
}

/**
 * A canvas renderer made at the stage's width, then resized as it or the
 * demo's height changes.
 * @param {any} renderer @param {() => number} width @param {() => number} height
 */
function follow(renderer, width, height) {
  $watch($active(), () => [width(), height()], ([w, h]) => renderer.resize(w, h));
  return renderer;
}

/** @param {{ id: string, view: () => any, width: () => number, height: number, high: () => number, root: () => Settings & { width: number } }} props */
function OnSkia(props) {
  const R = $active();
  const env = $lookup(Env);
  const skia = loading(R, env.skia, 'CanvasKit');
  return (
    <Recover fallback={failed('Skia')}>
      <Pending fallback={<Text fg="quiet">Loading CanvasKit…</Text>}>
        {() => {
          const { kit, font, mono } = /** @type {any} */ ($read(skia));
          const { width, height } = props;
          // ren-skia makes the canvas in the root's host element, and removes it on close.
          const renderer = follow($skia(kit, { font, mono, width: $untrack(R, width), height: $untrack(R, props.high), scale: env.scale }), width, props.high);
          return (
            <Root id={props.id} renderer={renderer} props={props.root}>
              {() => <Themed view={props.view} height={height} />}
            </Root>
          );
        }}
      </Pending>
    </Recover>
  );
}

/** The panel scene's field of view, in degrees. */
const FOV = 40;

/** @param {{ id: string, view: () => any, width: () => number, height: number, high: () => number, settings: () => Settings, root: () => Settings & { width: number }, panel: boolean }} props */
function OnThree(props) {
  const R = $active();
  const env = $lookup(Env);
  const three = loading(R, env.three, 'three.js');
  // A scene's background is its renderer's: a new scheme makes the root again,
  // and nothing else in the settings (an accent) does.
  const isDark = $memo(R, () => props.settings().scheme === 'dark');
  return (
    <Recover fallback={failed('three.js')}>
      <Pending fallback={<Text fg="quiet">Loading three.js…</Text>}>
        {() => {
          const loaded = /** @type {any} */ ($read(three));
          const dark = $read(isDark);
          const { width, height } = props;
          if (!props.panel) {
            const renderer = follow($three(loaded.THREE, { renderer: loaded.renderer, font: loaded.font, mono: loaded.mono, width: $untrack(R, width), height: $untrack(R, props.high), scale: env.scale, background: dark ? BASE_THEME.colors.night[7] : BASE_THEME.white }), width, props.high);
            return (
              <Root id={props.id} renderer={renderer} props={props.root}>
                {() => <Themed view={props.view} height={height} />}
              </Root>
            );
          }
          // The panel is as large as its content (0.01 world units a pixel); at this distance it fills the canvas facing the camera.
          // A plane in a scene: as wide as the stage when made, as high as its demo grows.
          const wide = $untrack(R, width);
          /** The camera's distance for a canvas `tall` high. @param {number} tall */
          const fit = tall => (tall * 0.01) / 2 / Math.tan(((FOV / 2) * Math.PI) / 180);
          const tall = $untrack(R, props.high) + 80;
          const backdrop = dark ? BASE_THEME.colors.night[8] : BASE_THEME.colors.gray[1];
          const renderer = $three(loaded.THREE, { renderer: loaded.renderer, font: loaded.font, mono: loaded.mono, width: wide, height: tall, scale: env.scale, background: backdrop, camera: { fov: FOV, position: [0, 0, fit(tall)] } });
          // A taller demo: a taller canvas, the camera further back.
          $watch(R, props.high, h => {
            renderer.resize(wide, h + 80);
            renderer.camera.position.z = fit(h + 80);
          });
          return (
            <Root id={props.id} renderer={renderer} props={props.root}>
              {() => <Orbit view={props.view} width={wide} height={height} backdrop={backdrop} frame={dark ? BASE_THEME.colors.night[4] : BASE_THEME.colors.gray[4]} />}
            </Root>
          );
        }}
      </Pending>
    </Recover>
  );
}

/**
 * The panel's scene: the view on a plane, tilted, over a backdrop you drag
 * to orbit and wheel to zoom. The plane is the demo's height at least and
 * grows with it, its frame too (the root's props hear how high it is).
 * @param {{ view: () => any, width: number, height: number, backdrop: string, frame: string }} props
 */
export function Orbit(props) {
  const R = $active();
  const yaw = $signal(R, -0.3);
  const pitch = $signal(R, 0.1);
  // Tilted, the near edge grows: start far enough back that it stays in view.
  const zoom = $signal(R, 1.5);
  /** @type {{ x: number, y: number, yaw: number, pitch: number } | null} */
  let drag = null;
  const w = props.width * 0.01;
  // How high the demo is, as its Themed reports it, passed on to the stage.
  const high = $signal(R, props.height);
  // The root's props, read as the view is built (a handler in a panel has no Props to look up); their `grown` is the stage's.
  const outer = /** @type {any} */ ($lookup(Props));
  const report = outer?.grown;
  const settings = () => ({
    .../** @type {any} */ ($lookup(Props)),
    grown: (/** @type {number} */ h) => {
      if (h !== $untrack(R, () => $read(high))) $write(high, h);
      report?.(h);
    },
  });
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 6, 8]} intensity={1.4} />
      <mesh
        name="backdrop"
        // dragged to orbit, not pressed: a grab, not the renderer's hand
        cursor="grab"
        onPointerDown={(/** @type {any} */ e) => (drag = { x: e.native?.clientX ?? 0, y: e.native?.clientY ?? 0, yaw: $read(yaw), pitch: $read(pitch) })}
        onPointerMove={(/** @type {any} */ e) => {
          // Released over the plane, the backdrop heard no pointerup: no button held ends the drag.
          if (e.native?.buttons === 0) drag = null;
          if (drag === null) return;
          $write(yaw, Math.max(-1.2, Math.min(1.2, drag.yaw + ((e.native?.clientX ?? 0) - drag.x) * 0.006)));
          $write(pitch, Math.max(-0.8, Math.min(0.8, drag.pitch + ((e.native?.clientY ?? 0) - drag.y) * 0.006)));
        }}
        onPointerUp={() => (drag = null)}
        onWheel={(/** @type {any} */ e) => $write(zoom, Math.max(0.6, Math.min(2.5, $read(zoom) * (1 + (e.native?.deltaY ?? 0) * 0.001))))}
      >
        <sphereGeometry params={[40, 32, 16]} />
        <meshBasicMaterial color={props.backdrop} side={1} />
      </mesh>
      <group rotation={() => [$read(pitch), $read(yaw), 0]} scale={() => 1 / $read(zoom)}>
        <mesh position={[0, 0, -0.07]}>
          <boxGeometry params={() => [w + 0.16, $read(high) * 0.01 + 0.16, 0.12]} />
          <meshStandardMaterial color={props.frame} roughness={0.6} />
        </mesh>
        <Themed view={props.view} width={props.width} height={props.height} settings={settings} />
      </group>
    </>
  );
}
