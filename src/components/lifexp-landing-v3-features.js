import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Zap, Wind, Shield, Brain, Flame, ArrowRight,
  Users, Target, Crown, Sparkles, Award, TrendingUp
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, AreaChart, Area } from 'recharts';

// Custom hooks
const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options]);

  return [ref, isInView];
};

const useDrag = (onDragEnd) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ startX: 0, startY: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.pageX - position.x,
      startY: e.pageY - position.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.pageX - dragRef.current.startX,
      y: e.pageY - dragRef.current.startY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (onDragEnd) onDragEnd(position);
  };

  return {
    isDragging,
    position,
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp
    }
  };
};

// Interactive Components
const DraggableSkill = ({ skill, onLevelUp }) => {
  const { isDragging, position, dragHandlers } = useDrag();
  
  return (
    <div
      className={`
        absolute cursor-grab active:cursor-grabbing
        transform transition-transform
        ${isDragging ? 'scale-110' : 'hover:scale-105'}
      `}
      style={{
        left: position.x,
        top: position.y
      }}
      {...dragHandlers}
    >
      <Card className="w-32 h-32 flex flex-col items-center justify-center bg-gray-900/80">
        <skill.icon className="w-8 h-8 mb-2 text-[#CFFF04]" />
        <div className="text-sm font-medium">{skill.name}</div>
        <div className="text-xs text-gray-400">Level {skill.level}</div>
        <Button 
          className="mt-2 bg-[#CFFF04] text-black text-xs"
          onClick={() => onLevelUp(skill.id)}
        >
          Level Up
        </Button>
      </Card>
    </div>
  );
};

const SkillTree = () => {
  const [skills, setSkills] = useState([
    { id: 1, name: 'Energy', level: 1, icon: Zap, x: 100, y: 100 },
    { id: 2, name: 'Focus', level: 1, icon: Target, x: 250, y: 100 },
    { id: 3, name: 'Resilience', level: 1, icon: Shield, x: 175, y: 200 }
  ]);

  const handleLevelUp = (skillId) => {
    setSkills(skills.map(skill => 
      skill.id === skillId 
        ? { ...skill, level: skill.level + 1 }
        : skill
    ));
  };

  return (
    <div className="relative h-[400px] border border-gray-800 rounded-lg bg-gray-900/50 backdrop-blur-sm">
      {skills.map(skill => (
        <DraggableSkill
          key={skill.id}
          skill={skill}
          onLevelUp={handleLevelUp}
        />
      ))}
    </div>
  );
};

const LiveStats = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          value: Math.random() * 100
        };
        return [...prev.slice(-20), newPoint];
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <AreaChart width={600} height={200} data={data}>
      <XAxis dataKey="time" />
      <YAxis />
      <Tooltip />
      <Area 
        type="monotone" 
        dataKey="value" 
        stroke="#CFFF04" 
        fill="#CFFF04" 
        fillOpacity={0.2} 
      />
    </AreaChart>
  );
};

const SkillRadar = ({ stats }) => {
  const data = Object.entries(stats).map(([key, value]) => ({
    subject: key,
    value: value
  }));

  return (
    <RadarChart width={300} height={300} data={data}>
      <PolarGrid stroke="#666" />
      <PolarAngleAxis dataKey="subject" />
      <Radar 
        dataKey="value" 
        stroke="#CFFF04" 
        fill="#CFFF04" 
        fillOpacity={0.5} 
      />
    </RadarChart>
  );
};

// Main App Layout Component
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#280F36] to-[#33373B] text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold text-[#CFFF04]">LifeXP</div>
            <div className="flex space-x-6">
              {['Dashboard', 'Skills', 'Progress', 'Leaderboard'].map(item => (
                <button
                  key={item}
                  className="text-sm text-gray-400 hover:text-[#CFFF04] transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 pt-20">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;