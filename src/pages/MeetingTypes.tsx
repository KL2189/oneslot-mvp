
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface MeetingType {
  id: string;
  name: string;
  duration: number;
  color: string;
  slug: string;
}

export default function MeetingTypes() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<MeetingType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    duration: 30,
    color: "#667eea"
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const slug = generateSlug(formData.name);
    const newMeetingType: MeetingType = {
      id: Date.now().toString(),
      name: formData.name,
      duration: formData.duration,
      color: formData.color,
      slug: slug
    };

    if (editingType) {
      setMeetingTypes(prev => prev.map(mt => 
        mt.id === editingType.id ? { ...newMeetingType, id: editingType.id } : mt
      ));
      toast({
        title: "Success",
        description: "Meeting type updated successfully",
      });
    } else {
      setMeetingTypes(prev => [...prev, newMeetingType]);
      toast({
        title: "Success",
        description: "Meeting type created successfully",
      });
    }

    setIsDialogOpen(false);
    setEditingType(null);
    setFormData({ name: "", duration: 30, color: "#667eea" });
  };

  const handleEdit = (meetingType: MeetingType) => {
    setEditingType(meetingType);
    setFormData({
      name: meetingType.name,
      duration: meetingType.duration,
      color: meetingType.color
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setMeetingTypes(prev => prev.filter(mt => mt.id !== id));
    toast({
      title: "Success",
      description: "Meeting type deleted successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meeting Types</h1>
            <p className="text-gray-600">Create and manage your meeting types</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  New Meeting Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingType ? 'Edit Meeting Type' : 'Create Meeting Type'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Meeting Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Product Demo"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="15"
                      max="480"
                      step="15"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-16 h-10"
                      />
                      <Input
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="#667eea"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingType(null);
                        setFormData({ name: "", duration: 30, color: "#667eea" });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingType ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {meetingTypes.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No meeting types yet</h3>
            <p className="text-gray-600 mb-6">Create your first meeting type to start accepting bookings</p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="btn-gradient"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Meeting Type
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetingTypes.map((meetingType) => (
              <Card key={meetingType.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: meetingType.color }}
                  />
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(meetingType)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(meetingType.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{meetingType.name}</h3>
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {meetingType.duration} minutes
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Booking URL: /{meetingType.slug}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
