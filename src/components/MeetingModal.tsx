
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Meeting } from "@/types/meeting";
import { format } from "date-fns";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meeting: Omit<Meeting, "id">) => void;
  meeting?: Meeting;
  selectedDate?: Date;
  selectedTime?: string;
}

const MeetingModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  meeting, 
  selectedDate,
  selectedTime 
}: MeetingModalProps) => {
  const [formData, setFormData] = useState({
    who: "",
    where: "",
    when: "",
    why: "",
    duration: 60
  });

  useEffect(() => {
    if (meeting) {
      setFormData({
        who: meeting.who,
        where: meeting.where,
        when: format(meeting.when, "yyyy-MM-dd'T'HH:mm"),
        why: meeting.why,
        duration: meeting.duration
      });
    } else if (selectedDate && selectedTime) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      setFormData({
        who: "",
        where: "",
        when: `${dateStr}T${selectedTime}`,
        why: "",
        duration: 60
      });
    } else {
      setFormData({
        who: "",
        where: "",
        when: "",
        why: "",
        duration: 60
      });
    }
  }, [meeting, selectedDate, selectedTime, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.who || !formData.when) return;
    
    onSave({
      who: formData.who,
      where: formData.where,
      when: new Date(formData.when),
      why: formData.why,
      duration: formData.duration
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {meeting ? "Edit Meeting" : "New Meeting"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="who" className="text-sm font-medium">Who</Label>
            <Input
              id="who"
              value={formData.who}
              onChange={(e) => setFormData({ ...formData, who: e.target.value })}
              placeholder="Person or group name"
              required
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="where" className="text-sm font-medium">Where</Label>
            <Input
              id="where"
              value={formData.where}
              onChange={(e) => setFormData({ ...formData, where: e.target.value })}
              placeholder="Location or platform"
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="when" className="text-sm font-medium">When</Label>
              <Input
                id="when"
                type="datetime-local"
                value={formData.when}
                onChange={(e) => setFormData({ ...formData, when: e.target.value })}
                required
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                min="15"
                step="15"
                className="focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="why" className="text-sm font-medium">Why</Label>
            <Textarea
              id="why"
              value={formData.why}
              onChange={(e) => setFormData({ ...formData, why: e.target.value })}
              placeholder="Purpose or notes"
              rows={3}
              className="focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {meeting ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
