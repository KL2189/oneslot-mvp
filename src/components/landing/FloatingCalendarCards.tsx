
import { Calendar, Clock, Users } from "lucide-react";

export const FloatingCalendarCards = () => {
  const cards = [
    {
      icon: Calendar,
      title: "Team Meeting",
      time: "2:00 PM",
      color: "bg-gradient-primary",
      delay: "0s",
      position: "top-20 left-20",
    },
    {
      icon: Users,
      title: "Client Call",
      time: "4:30 PM",
      color: "bg-gradient-secondary",
      delay: "1s",
      position: "top-40 right-20",
    },
    {
      icon: Clock,
      title: "1:1 Sync",
      time: "10:00 AM",
      color: "bg-gradient-accent",
      delay: "2s",
      position: "bottom-40 left-32",
    },
    {
      icon: Calendar,
      title: "Design Review",
      time: "3:15 PM",
      color: "bg-gradient-success",
      delay: "3s",
      position: "bottom-20 right-32",
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`absolute ${card.position} floating-card hidden lg:block`}
          style={{ "--delay": card.delay } as React.CSSProperties}
        >
          <div className="glass-card p-4 rounded-xl shadow-2xl max-w-[200px] group hover:scale-110 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center shadow-lg`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{card.title}</p>
                <p className="text-gray-600 text-xs">{card.time}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
