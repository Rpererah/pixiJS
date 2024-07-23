import React, { useEffect, useRef } from 'react';
import { Application, Assets, AnimatedSprite, Texture } from 'pixi.js';
import idle1 from './assets/sprite/Idle1.png';
import idle2 from './assets/sprite/Idle2.png';
import idle3 from './assets/sprite/Idle3.png';
import idle4 from './assets/sprite/Idle4.png';
import idle5 from './assets/sprite/Idle5.png';
import idle6 from './assets/sprite/Idle6.png';
import idle7 from './assets/sprite/Idle7.png';
import idle8 from './assets/sprite/Idle8.png';
import idle9 from './assets/sprite/Idle9.png';
import idle10 from './assets/sprite/Idle10.png';
import run1 from './assets/sprite/Run1.png';
import run2 from './assets/sprite/Run2.png';
import run3 from './assets/sprite/Run3.png';
import run4 from './assets/sprite/Run4.png';
import run5 from './assets/sprite/Run5.png';
import run6 from './assets/sprite/Run6.png';
import run7 from './assets/sprite/Run7.png';
import run8 from './assets/sprite/Run8.png';


const App: React.FC = () => {
  const pixiContainer = useRef<HTMLDivElement | null>(null);
  const animatedSpriteRef = useRef<AnimatedSprite | null>(null);
  const isRunningRef = useRef<boolean>(false);

  useEffect(() => {
    const app = new Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
    });

    if (pixiContainer.current) {
      pixiContainer.current.appendChild(app.view as HTMLCanvasElement);
    }

    const idleFrames = [
      idle1, idle2, idle3, idle4, idle5,
      idle6, idle7, idle8, idle9, idle10
    ];

    const runFrames = [
      run1, run2, run3, run4, run5,
      run6, run7, run8
    ];

    const loadTextures = async (frames: string[]): Promise<Texture[]> => {
      return Promise.all(frames.map(frame => Assets.load(frame) as Promise<Texture>));
    };

    loadTextures(idleFrames).then((idleTextures) => {
      const animatedSprite = new AnimatedSprite(idleTextures);

      animatedSprite.x = 200;
      animatedSprite.y = 200;
      animatedSprite.anchor.set(0.5);
      animatedSprite.animationSpeed = 0.25;
      animatedSprite.loop = true;
      animatedSprite.play();

      animatedSpriteRef.current = animatedSprite;
      app.stage.addChild(animatedSprite);
    });

    const handleKeyDown = async (event: KeyboardEvent) => {
      if (animatedSpriteRef.current && !isRunningRef.current) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          isRunningRef.current = true;
          const runTextures = await loadTextures(runFrames);
          animatedSpriteRef.current!.textures = runTextures;
          animatedSpriteRef.current!.loop = true;
          animatedSpriteRef.current!.play();

          if (event.key === 'ArrowLeft') {
            animatedSpriteRef.current!.scale.x = -1;
          } else if (event.key === 'ArrowRight') {
            animatedSpriteRef.current!.scale.x = 1;
          }
        }
      }
    };

    const handleKeyUp = async (event: KeyboardEvent) => {
      if (animatedSpriteRef.current && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
        isRunningRef.current = false;
        const idleTextures = await loadTextures(idleFrames);
        animatedSpriteRef.current!.textures = idleTextures;
        animatedSpriteRef.current!.loop = true;
        animatedSpriteRef.current!.play();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return <div ref={pixiContainer}></div>;
};

export default App;
