"use client";

import {
  MotionValue,
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";

export default function Home() {
  let [count, setCount] = useState(1);
  let [isShowing, setIsShowing] = useState(false);

  return (
    <div className="h-screen flex flex-col gap-8 justify-center items-center">
      <button
        onClick={() => setIsShowing(!isShowing)}
        className="bg-gray-300 rounded px-3 py-1 text-sm"
      >
        Toggle
      </button>

      <div className="h-20">
        {isShowing && (
          <div className="flex flex-col items-center gap-4">
            <AnimatedBubble value={count} />

            <button
              onClick={() => setCount(count + 1)}
              className="bg-gray-300 rounded px-3 py-1 text-sm"
            >
              +1
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AnimatedBubble({ value }: { value: number }) {
  let scale = useMotionValue(0.5);

  useEffect(() => {
    // @ts-ignore
    animate(scale, [null, 1.1, 1], { duration: 0.4 });
  }, [scale, value]);

  return (
    <motion.span
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{ scale }}
      className="inline-block bg-amber-500 rounded-full text-white font-medium px-2 justify-center"
    >
      <Counter value={value} />
    </motion.span>
  );
}

const fontSize = 16;
const padding = 12;
const height = fontSize + padding;

function Counter({ value }: { value: number }) {
  return (
    <div style={{ fontSize }} className="flex overflow-hidden leading-none">
      <Digit place={100} value={value} />
      <Digit place={10} value={value} />
      <Digit place={1} value={value} />
    </div>
  );
}

function Digit({ place, value }: { place: number; value: number }) {
  let valueRoundedToPlace = Math.floor(value / place);
  let animatedValue = useSpring(valueRoundedToPlace, { bounce: 0.1 });

  useEffect(() => {
    animatedValue.set(valueRoundedToPlace);
  }, [animatedValue, valueRoundedToPlace]);

  if (value < place) {
    return null;
  }

  return (
    <div style={{ height }} className="relative w-[1ch] tabular-nums">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <Number key={i} mv={animatedValue} number={i} />
      ))}
    </div>
  );
}

function Number({ mv, number }: { mv: MotionValue; number: number }) {
  let y = useTransform(mv, (latest) => {
    let placeValue = latest % 10;
    let offset = (10 + number - placeValue) % 10;

    let memo = offset * height;

    if (offset > 5) {
      memo -= 10 * height;
    }

    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {number}
    </motion.span>
  );
}
