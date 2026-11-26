"use client";

import { useEffect, useState } from "react";
import { AidmtChallenge, questionOfTheDay } from "@/components/AidmtPromo";

/* Today's question (AidmtPromo questionOfTheDay), the same for everyone,
   with the AIDMT question card and its "how everyone answered" bars, and
   the time left till the next one. The first paint uses the time the page
   was built, the same on the server and in the browser; the browser's
   clock takes over at once. */

const DAY = 86400000;
const IST = 5.5 * 3600000;
const untilMidnight = (t: number) => DAY - ((t + IST) % DAY);

export function QuestionOfTheDay({ builtAt }: { builtAt: number }) {
  const [now, setNow] = useState(builtAt);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  const { key } = questionOfTheDay(now);
  const left = untilMidnight(now);
  const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000);
  return (
    <div className="qd">
      <AidmtChallenge enrolUrl="/aidmt/" register="Take a full AIDMT mock" only={[key]} buy={{}} daily />
      <p className="qd-next" aria-live="off">
        <svg width="16" height="16" aria-hidden="true"><use href="#clock" /></svg>
        Next question in <b>{h}h {String(m).padStart(2, "0")}m</b>
      </p>
    </div>
  );
}
