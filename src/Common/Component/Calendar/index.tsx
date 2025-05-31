import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  minutes?: number; // số phút đếm ngược, mặc định là 5,
  setDisable: React.Dispatch<React.SetStateAction<boolean>>;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  minutes = 5,
  setDisable,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(minutes * 60); // lưu số giây còn lại

  useEffect(() => {
    if (timeLeft <= 0) {
      setDisable(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (totalSeconds: number): string => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h2>⏳ Đếm ngược: {timeLeft > 0 ? formatTime(timeLeft) : 'Hết giờ!'}</h2>
    </div>
  );
};

export default CountdownTimer;
