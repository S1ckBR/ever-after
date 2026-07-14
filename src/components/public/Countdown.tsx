"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string; // Exemplo: "2026-11-22T16:30:00"
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference <= 0) {
        return { days: "00", hours: "00", minutes: "00", seconds: "00" };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return {
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    setTimeLeft(calculateTime());

    return () => clearInterval(timer);
  }, [targetDate]);

  const items = [
    { value: timeLeft.days, label: "Dias" },
    { value: timeLeft.hours, label: "Horas" },
    { value: timeLeft.minutes, label: "Minutos" },
    { value: timeLeft.seconds, label: "Segundos" },
  ];

  return (
    <div className="flex justify-center items-center space-x-6 md:space-x-12 bg-white/40 backdrop-blur-sm border border-[#e1e9dc] p-6 max-w-lg mx-auto md:shadow-sm">
      {items.map((item, idx) => (
        <div key={idx} className="text-center min-w-[60px]">
          <span className="block font-serif text-3xl md:text-4xl font-light text-[#3b5336]">
            {item.value}
          </span>
          <span className="block text-[10px] uppercase tracking-widest text-[#607d5b] mt-1">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}