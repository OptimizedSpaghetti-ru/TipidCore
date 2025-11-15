import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Mail, Calendar, Target, Trash2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdDate: string;
  linkedTo?: string;
  category: string;
}

export function FutureMeNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("futureMeNotes");
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  const addNote = (
    title: string,
    content: string,
    category: string,
    linkedTo?: string
  ) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdDate: new Date().toISOString(),
      linkedTo,
      category,
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem("futureMeNotes", JSON.stringify(updated));
    setIsAddDialogOpen(false);
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((note) => note.id !== id);
    setNotes(updated);
    localStorage.setItem("futureMeNotes", JSON.stringify(updated));
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      motivation: "from-yellow-500 to-orange-500",
      goal: "from-purple-500 to-pink-500",
      milestone: "from-blue-500 to-cyan-500",
      reminder: "from-green-500 to-emerald-500",
    };
    return colors[category] || "from-violet-500 to-purple-500";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-6 shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-white mb-2">Future Me Notes</h1>
          <p className="text-blue-100">
            Messages and reminders to your future self
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-2" />
              Write Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Write a Note to Future You</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get("title") as string;
                const content = formData.get("content") as string;
                const category = formData.get("category") as string;
                const linkedTo = formData.get("linkedTo") as string;
                addNote(title, content, category, linkedTo || undefined);
                e.currentTarget.reset();
              }}
            >
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Remember why you're saving"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Message</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Write your message to your future self..."
                    rows={6}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      name="category"
                      className="w-full p-2 border border-violet-200 rounded-lg"
                      required
                    >
                      <option value="motivation">Motivation</option>
                      <option value="goal">Goal</option>
                      <option value="milestone">Milestone</option>
                      <option value="reminder">Reminder</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="linkedTo">Link to (Optional)</Label>
                    <Input
                      id="linkedTo"
                      name="linkedTo"
                      placeholder="e.g., iPhone 17 Goal"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Save Note
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-violet-600" />
          </div>
          <h3 className="text-violet-900 mb-2">No Notes Yet</h3>
          <p className="text-violet-600 mb-6">
            Start writing messages and reminders to your future self
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            Write Your First Note
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(
                      note.category
                    )} rounded-xl flex items-center justify-center`}
                  >
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-violet-900">{note.title}</h3>
                    <p className="text-violet-400">
                      {new Date(note.createdDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteNote(note.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-violet-700 mb-4 whitespace-pre-wrap">
                {note.content}
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
                  {note.category === "goal" && <Target className="w-4 h-4" />}
                  {note.category === "milestone" && (
                    <Calendar className="w-4 h-4" />
                  )}
                  <span className="capitalize">{note.category}</span>
                </div>
                {note.linkedTo && (
                  <div className="text-violet-600 bg-purple-50 px-3 py-1 rounded-full">
                    📎 {note.linkedTo}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Motivation Card */}
      <Card className="mt-8 p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
        <h3 className="text-violet-900 mb-2">✨ Use Future Me Notes for:</h3>
        <ul className="text-violet-700 space-y-2">
          <li>• Motivational reminders when you're tempted to overspend</li>
          <li>• Celebrating milestones when you reach savings goals</li>
          <li>• Reflecting on your financial journey and progress</li>
          <li>• Recording why specific goals matter to you</li>
        </ul>
      </Card>
    </div>
  );
}
