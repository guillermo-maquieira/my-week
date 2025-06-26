
import { Clock, MapPin, User, MessageSquare } from "lucide-react";
import { Meeting } from "@/types/meeting";
import { format } from "date-fns";

interface MeetingCardProps {
  meeting: Meeting;
  onClick: () => void;
}

const MeetingCard = ({ meeting, onClick }: MeetingCardProps) => {
  const endTime = new Date(meeting.when.getTime() + meeting.duration * 60000);
  
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 mb-2"
    >
      <div className="flex items-center gap-2 mb-2">
        <User size={14} />
        <span className="font-semibold text-sm">{meeting.who}</span>
      </div>
      
      <div className="flex items-center gap-2 mb-1">
        <Clock size={12} />
        <span className="text-xs">
          {format(meeting.when, "HH:mm")} - {format(endTime, "HH:mm")}
        </span>
      </div>
      
      {meeting.where && (
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={12} />
          <span className="text-xs truncate">{meeting.where}</span>
        </div>
      )}
      
      {meeting.why && (
        <div className="flex items-center gap-2">
          <MessageSquare size={12} />
          <span className="text-xs truncate">{meeting.why}</span>
        </div>
      )}
    </div>
  );
};

export default MeetingCard;
