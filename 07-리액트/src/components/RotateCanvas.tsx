/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Engine,
  Render,
  Runner,
  Mouse,
  MouseConstraint,
  Composite,
  Bodies,
  Events,
  IChamferableBodyDefinition,
} from 'matter-js';

import '../style/components/RotateCanvas.css';

import IconAFRAME from '../assets/icon_AFRAME.png';
import IconCSS from '../assets/icon_CSS.png';
import IconHTML from '../assets/icon_HTML.png';
import IconJS from '../assets/icon_JS.png';
import IconREACT from '../assets/icon_REACT.png';
import IconTHREE from '../assets/icon_THREE.png';

const data = {
  JS: {
    title: 'Javascript',
    level: 4,
    desc: '자바스크립트에 대한 설명이라고 할 수 있습니다. 자바스크립트에 대한 설명. 자바스크립트에 대한 설명.',
  },
  REACT: {
    title: 'React.js',
    level: 5,
    desc: 'React에 대한 설명이라고 할 수 있습니다. React에 대한 설명. React에 대한 설명.',
  },
  CSS: {
    title: 'CSS/SASS',
    level: 3,
    desc: 'CSS에 대한 설명이라고 할 수 있습니다. CSS에 대한 설명. CSS에 대한 설명.',
  },
  AFRAME: {
    title: 'Aframe.js',
    level: 4,
    desc: 'AFRAME에 대한 설명이라고 할 수 있습니다. AFRAME에 대한 설명. AFRAME에 대한 설명.',
  },
  THREE: {
    title: 'Three.js',
    level: 2,
    desc: 'THREE에 대한 설명이라고 할 수 있습니다. THREE에 대한 설명. THREE에 대한 설명.',
  },
  HTML: {
    title: 'HTML',
    level: 5,
    desc: 'HTML에 대한 설명이라고 할 수 있습니다. HTML에 대한 설명. HTML에 대한 설명.',
  },
};

const RotateCanvas = () => {
  const [selected, setSelected] = useState(data['JS']);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);
  const runnerRef = useRef<Runner | null>(null);
  const mouseRef = useRef<Mouse | null>(null);
  const mouseConstraintRef = useRef<MouseConstraint | null>(null);
  const gravityPower = useRef<number>(0.5);
  const gravityDeg = useRef<number>(0);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const cw = 1000;
  const ch = 1000;

  const initScene = () => {
    if (!canvasRef.current) return;

    engineRef.current = Engine.create();
    renderRef.current = Render.create({
      canvas: canvasRef.current,
      engine: engineRef.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: '#1b1b19',
      },
    });

    runnerRef.current = Runner.create();

    Render.run(renderRef.current);
    Runner.run(runnerRef.current, engineRef.current);
  };

  const initMouse = () => {
    if (!canvasRef.current) return;
    mouseRef.current = Mouse.create(canvasRef.current);

    if (!engineRef.current) return;
    mouseConstraintRef.current = MouseConstraint.create(engineRef.current, {
      mouse: mouseRef.current,
    });

    Composite.add(engineRef.current.world, mouseConstraintRef.current);
  };

  const initGround = useCallback(() => {
    const segments = 32;
    const deg = (Math.PI * 2) / segments;
    const width = 30;
    const radius = cw / 2 + width / 2;
    const height = radius * Math.tan(deg / 2) * 2;

    for (let i = 0; i < segments; i++) {
      const theta = deg * i;
      const x = radius * Math.cos(theta) + cw / 2;
      const y = radius * Math.sin(theta) + ch / 2;
      addRect(x, y, width, height, { isStatic: true, angle: theta });
    }
  }, []);

  const initImageBoxes = useCallback(() => {
    const scale = 0.7;
    const t1 = { w: 250 * scale, h: 250 * scale };
    const t2 = { w: 732 * scale, h: 144 * scale };

    addRect(cw / 2, ch / 2, t1.w, t1.h, {
      label: 'JS',
      chamfer: { radius: 20 },
      render: { sprite: { texture: IconJS, xScale: scale, yScale: scale } },
    });
    addRect(cw / 2 - t1.w, ch / 2, t1.w, t1.h, {
      label: 'CSS',
      chamfer: { radius: 20 },
      render: { sprite: { texture: IconCSS, xScale: scale, yScale: scale } },
    });
    addRect(cw / 2 + t1.w, ch / 2, t1.w, t1.h, {
      label: 'HTML',
      chamfer: { radius: 20 },
      render: { sprite: { texture: IconHTML, xScale: scale, yScale: scale } },
    });
    addRect(cw / 2, ch / 2 + t1.h, t1.w, t1.h, {
      label: 'THREE',
      chamfer: { radius: 20 },
      render: { sprite: { texture: IconTHREE, xScale: scale, yScale: scale } },
    });
    addRect(cw / 2 - t1.w, ch / 2 + t1.h, t1.w, t1.h, {
      label: 'REACT',
      chamfer: { radius: 75 },
      render: { sprite: { texture: IconREACT, xScale: scale, yScale: scale } },
    });
    addRect(cw / 2, ch / 2 - t2.h, t2.w, t2.h, {
      label: 'AFRAME',
      chamfer: { radius: 20 },
      render: { sprite: { texture: IconAFRAME, xScale: scale, yScale: scale } },
    });
  }, []);

  const initIntersectionObserver = useCallback(() => {
    const options: IntersectionObserverInit = {
      threshold: 0.1,
    };
    observerRef.current = new IntersectionObserver((entries) => {
      const canvasEntry = entries[0];

      const runner = runnerRef.current;
      if (!runner) return;
      if (canvasEntry.isIntersecting) {
        runner.enabled = true;
        Render.run(renderRef.current!);
      } else {
        runner.enabled = false;
        Render.stop(renderRef.current!);
      }
    }, options);

    if (canvasRef.current) {
      observerRef.current?.observe(canvasRef.current);
    }
  }, []);

  const addRect = (
    x: number,
    y: number,
    w: number,
    h: number,
    options: IChamferableBodyDefinition = {}
  ) => {
    if (!mouseRef.current || !engineRef.current) return;

    const engine = engineRef.current;

    const rect = Bodies.rectangle(x, y, w, h, options);
    Composite.add(engine.world, rect);
  };

  useEffect(() => {
    initScene();
    initMouse();
    initGround();
    initImageBoxes();
    initIntersectionObserver();

    const mouseConstraint = mouseConstraintRef.current;

    Events.on(mouseConstraint, 'mousedown', () => {
      const newSelected =
        mouseConstraint?.body &&
        data[mouseConstraint.body.label as keyof typeof data];

      if (newSelected) setSelected(newSelected);
    });

    Events.on(runnerRef.current, 'tick', () => {
      gravityDeg.current += 1;
      if (!engineRef.current) return;
      engineRef.current.gravity.x =
        gravityPower.current * Math.cos((Math.PI / 180) * gravityDeg.current);
      engineRef.current.gravity.y =
        gravityPower.current * Math.sin((Math.PI / 180) * gravityDeg.current);
    });

    const canvas = canvasRef.current;

    return () => {
      if (canvas) {
        observerRef.current?.unobserve(canvas);
      }
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }
    };
  }, [initGround, initImageBoxes, initIntersectionObserver]);

  return (
    <div className='rotate-canvas-wrapper'>
      <canvas ref={canvasRef}></canvas>

      <aside>
        <h1>{selected.title}</h1>
        <h2>
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <span
                key={i}
                style={{ filter: `grayscale(${selected.level <= i ? 1 : 0})` }}>
                &#11088;
              </span>
            ))}
        </h2>
        <p>{selected.desc}</p>
      </aside>
    </div>
  );
};

export default RotateCanvas;
