import React, { useState, useEffect, useRef } from 'react';
import { 
  StarIcon, Sparkles, Trophy, Zap, Wind, Shield, 
  ChevronDown, Github, Twitter, Linkedin, Target,
  Brain, Flame, ArrowRight, Users, Book
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

// Custom hook for intersection observer
const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isInView];
};

// Particle effect component
const ParticleField = () => {
  const particlesRef = useRef([]);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const createParticle = (x, y) => ({
      id: Math.random(),
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 1,
    });

    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push(createParticle(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight
        ));
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animate = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 0.01,
      })).filter(particle => particle.life > 0));
    };

    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [particles]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-[#CFFF04] rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.life,
            transform: `scale(${particle.life})`,
          }}
        />
      ))}
    </div>
  );
};

// Interactive progress chart
const ProgressChart = ({ data }) => {
  return (
    <LineChart width={600} height={300} data={data} className="mx-auto">
      <XAxis dataKey="name" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip />
      <Line type="monotone" dataKey="progress" stroke="#CFFF04" strokeWidth={2} />
    </LineChart>
  );
};

// Enhanced stat bar with interactions
const StatBar = ({ label, value, icon: Icon, color, onInteract }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [ref, isInView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setCurrentValue(value);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [value, isInView]);

  return (
    <div
      ref={ref}
      className="w-full mb-6 transform transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onInteract}
    >
      <div className="flex items-center mb-2">
        <Icon className={`w-5 h-5 mr-2 transition-all duration-300 ${isHovered ? 'text-[#CFFF04]' : ''}`} />
        <span className="text-sm font-medium">{label}</span>
        <span className="ml-auto text-sm">{currentValue}/100</span>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden backdrop-blur-sm">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{ 
            width: `${currentValue}%`,
            backgroundColor: color
          }}
        >
          {isHovered && (
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};

// Interactive achievement card
const AchievementCard = ({ icon: Icon, label, progress, description }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [ref, isInView] = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (isInView && progress >= 100) {
      setIsUnlocked(true);
    }
  }, [progress, isInView]);

  return (
    <Card 
      ref={ref}
      className={`
        p-4 text-center transition-all duration-500
        ${isUnlocked ? 'bg-gradient-to-b from-[#CFFF04]/20 to-gray-900' : 'bg-gray-900'}
        hover:transform hover:scale-105
      `}
    >
      <CardContent className="p-0">
        <Icon 
          className={`
            w-8 h-8 mx-auto mb-2 transition-all duration-500
            ${isUnlocked ? 'text-[#CFFF04]' : 'text-gray-400'}
          `}
        />
        <div className="text-sm font-medium mb-2">{label}</div>
        <p className="text-xs text-gray-400 mb-3">{description}</p>
        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#CFFF04] rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
const LifeXPLanding = () => {
  const [stats, setStats] = useState({
    energy: 75,
    adaptability: 68,
    resilience: 82,
    focus: 70,
    creativity: 65
  });

  const [activeSection, setActiveSection] = useState('hero');
  const [progressData, setProgressData] = useState([
    { name: 'Week 1', progress: 30 },
    { name: 'Week 2', progress: 45 },
    { name: 'Week 3', progress: 65 },
    { name: 'Week 4', progress: 80 }
  ]);

  const handleStatUpdate = (stat) => {
    setStats(prev => ({
      ...prev,
      [stat]: Math.min(100, prev[stat] + Math.floor(Math.random() * 10) + 5)
    }));
  };

  const sections = ['hero', 'stats', 'achievements', 'progress'];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#280F36] to-[#33373B] text-white">
      <ParticleField />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold text-[#CFFF04]">LifeXP</div>
            <div className="flex space-x-8">
              {sections.map(section => (
                <button
                  key={section}
                  className={`
                    text-sm transition-all duration-300
                    ${activeSection === section ? 'text-[#CFFF04]' : 'text-gray-400 hover:text-white'}
                  `}
                  onClick={() => setActiveSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center py-16">
          <h1 className="text-6xl font-bold mb-6 text-center leading-tight">
            <span className="bg-gradient-to-r from-[#CFFF04] to-[#FFD700] text-transparent bg-clip-text">
              Level Up Your Life
            </span>
          </h1>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl text-center">
            Transform your daily achievements into epic quests. Track your progress,
            unlock achievements, and become the hero of your own story.
          </p>
          <Button 
            className="bg-[#CFFF04] text-black hover:bg-[#FFD700] transition-all duration-300 transform hover:scale-105"
            onClick={() => handleStatUpdate('energy')}
          >
            Begin Your Journey <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <Card className="bg-gray-900/50 backdrop-blur-lg border-gray-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-8 text-center">Your Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <StatBar 
                  label="Energy" 
                  value={stats.energy} 
                  icon={Flame} 
                  color="#CFFF04"
                  onInteract={() => handleStatUpdate('energy')}
                />
                <StatBar 
                  label="Adaptability" 
                  value={stats.adaptability} 
                  icon={Wind} 
                  color="#FFD700"
                  onInteract={() => handleStatUpdate('adaptability')}
                />
                <StatBar 
                  label="Resilience" 
                  value={stats.resilience} 
                  icon={Shield} 
                  color="#9333EA"
                  onInteract={() => handleStatUpdate('resilience')}
                />
                <StatBar 
                  label="Focus" 
                  value={stats.focus} 
                  icon={Target} 
                  color="#60A5FA"
                  onInteract={() => handleStatUpdate('focus')}
                />
                <StatBar 
                  label="Creativity" 
                  value={stats.creativity} 
                  icon={Brain} 
                  color="#EC4899"
                  onInteract={() => handleStatUpdate('creativity')}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Achievements Section */}
        <section className="py-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AchievementCard 
              icon={Trophy}
              label="Marathon Master"
              description="Complete a 30-day streak"
              progress={85}
            />
            <AchievementCard 
              icon={Brain}
              label="Focus Champion"
              description="2 hours of deep work daily"
              progress={100}
            />
            <AchievementCard 
              icon={Users}
              label="Social Butterfly"
              description="Connect with 10 new people"
              progress={60}
            />
          </div>
        </section>

        {/* Progress Section */}
        <section className="py-16">
          <Card className="bg-gray-900/50 backdrop-blur-lg border-gray-800">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-8 text-center">Your Progress</h2>
              <ProgressChart data={progressData} />
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-800">
          <div className="flex justify-center space-x-6 mb-6">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <Icon 
                key={i} 
                className="w-6 h-6 text-gray-400 hover:text-[#CFFF04] cursor-pointer transition-colors duration-300" 
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500">
            © 2024 LifeXP. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LifeXPLanding;