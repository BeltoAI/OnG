/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

export default function SignalVisualizer() {
  const [data, setData] = useState(() => 
    Array.from({ length: 40 }, (_, i) => ({
      time: i,
      value: 30 + Math.random() * 40
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const lastVal = prev[prev.length - 1].value;
        const nextVal = Math.min(Math.max(lastVal + (Math.random() - 0.5) * 15, 10), 90);
        newData.push({
          time: prev[prev.length - 1].time + 1,
          value: nextVal
        });
        return newData;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full bg-black/40 rounded-lg border border-gold/10 overflow-hidden relative">
      <div className="absolute top-2 left-2 z-10">
        <span className="text-[10px] font-mono text-gold/50 uppercase tracking-widest">ePDB Log Readings // Real-time Signal</span>
      </div>
      
      <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-gold/5 to-transparent pointer-events-none" />

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F5A623" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#F5A623" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <YAxis hide domain={[0, 100]} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#F5A623"
            strokeWidth={1}
            fillOpacity={1}
            fill="url(#colorValue)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'linear-gradient(rgba(245, 166, 35, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 166, 35, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />
    </div>
  );
}
