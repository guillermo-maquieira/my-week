
import { useState, useMemo } from "react";
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Meeting } from "@/types/meeting";
import MeetingCard from "./MeetingCard";
import MeetingModal from "./MeetingModal";

interface WeeklyCalendarProps {
  meetings: Meeting[];
  onAddMeeting: (meeting: Omit<Meeting, "id">) => void;
  onEditMeeting: (meeting: Meeting) => void;
}

const WeeklyCalendar = ({ meetings, onAddMeeting, onEditMeeting }: WeeklyCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const timeSlots = Array.from({ length: 24 }, (_, i) => 
    format(new Date().setHours(i, 0, 0, 0), "HH:mm")
  );

  const meetingsByDay = useMemo(() => {
    const grouped: { [key: string]: Meeting[] } = {};
    
    weekDays.forEach(day => {
      const dayKey = format(day, "yyyy-MM-dd");
      grouped[dayKey] = meetings.filter(meeting => 
        isSameDay(meeting.when, day)
      ).sort((a, b) => a.when.getTime() - b.when.getTime());
    });
    
    return grouped;
  }, [meetings, weekDays]);

  const handlePrevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const handleNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const handleToday = () => setCurrentWeek(new Date());

  const handleAddMeeting = (date: Date, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedMeeting(undefined);
    setIsModalOpen(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setIsModalOpen(true);
  };

  const handleSaveMeeting = (meetingData: Omit<Meeting, "id">) => {
    if (selectedMeeting) {
      onEditMeeting({ ...selectedMeeting, ...meetingData });
    } else {
      onAddMeeting(meetingData);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white shadow-sm border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Weekly Calendar
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevWeek}
              className="hover:bg-blue-50"
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="hover:bg-blue-50"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextWeek}
              className="hover:bg-blue-50"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-gray-700">
            {format(weekStart, "MMM d")} - {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </span>
          <Button
            onClick={() => handleAddMeeting(new Date())}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus size={16} className="mr-2" />
            New Meeting
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-7 h-full">
          {weekDays.map((day, index) => {
            const dayKey = format(day, "yyyy-MM-dd");
            const dayMeetings = meetingsByDay[dayKey] || [];
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={index}
                className={`border-r border-gray-200 flex flex-col ${
                  index === 6 ? "border-r-0" : ""
                }`}
              >
                {/* Day Header */}
                <div
                  className={`p-4 text-center border-b border-gray-200 ${
                    isToday
                      ? "bg-gradient-to-r from-blue-100 to-purple-100"
                      : "bg-white"
                  }`}
                >
                  <div className="text-sm font-medium text-gray-600">
                    {format(day, "EEE")}
                  </div>
                  <div
                    className={`text-2xl font-bold mt-1 ${
                      isToday
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        : "text-gray-900"
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                </div>

                {/* Day Content */}
                <div className="flex-1 p-3 space-y-2 min-h-0 overflow-y-auto">
                  {dayMeetings.map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      onClick={() => handleEditMeeting(meeting)}
                    />
                  ))}
                  
                  <Button
                    variant="ghost"
                    onClick={() => handleAddMeeting(day)}
                    className="w-full h-8 text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 border-dashed border border-gray-300 hover:border-blue-300"
                  >
                    <Plus size={12} className="mr-1" />
                    Add meeting
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMeeting}
        meeting={selectedMeeting}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />
    </div>
  );
};

export default WeeklyCalendar;
