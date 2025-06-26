
import { useState } from "react";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import { Meeting } from "@/types/meeting";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      who: "Sarah Johnson",
      where: "Conference Room A",
      when: new Date(2024, 5, 27, 10, 0), // June 27, 2024, 10:00 AM
      why: "Project kickoff meeting",
      duration: 60
    },
    {
      id: "2",
      who: "Development Team",
      where: "Zoom",
      when: new Date(2024, 5, 28, 14, 30), // June 28, 2024, 2:30 PM
      why: "Sprint planning",
      duration: 90
    }
  ]);

  const handleAddMeeting = (meetingData: Omit<Meeting, "id">) => {
    const newMeeting: Meeting = {
      ...meetingData,
      id: Date.now().toString()
    };
    
    setMeetings(prev => [...prev, newMeeting]);
    toast({
      title: "Meeting Created",
      description: `Meeting with ${meetingData.who} has been scheduled.`,
    });
  };

  const handleEditMeeting = (updatedMeeting: Meeting) => {
    setMeetings(prev =>
      prev.map(meeting =>
        meeting.id === updatedMeeting.id ? updatedMeeting : meeting
      )
    );
    toast({
      title: "Meeting Updated",
      description: `Meeting with ${updatedMeeting.who} has been updated.`,
    });
  };

  return (
    <div className="h-screen">
      <WeeklyCalendar
        meetings={meetings}
        onAddMeeting={handleAddMeeting}
        onEditMeeting={handleEditMeeting}
      />
    </div>
  );
};

export default Index;
