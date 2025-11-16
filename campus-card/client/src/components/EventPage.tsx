// Static showcase using fintech_events_50.csv data directly embedded into the component for display

"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, MapPin, DollarSign, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import classNames from "classnames";

export default function EventsShowcase() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpEvents, setRsvpEvents] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const events = [
    { id: 1, name: "Fintech Innovation Summit", category: "Finance", location: "Innovation Hub", start_time: "2025-11-05T09:00:00", cost: 5, volunteer: true, volunteer_hours: 8 },
    { id: 2, name: "Digital Payments Workshop", category: "Finance", location: "Campus Center", start_time: "2025-11-06T14:00:00", cost: 0, volunteer: false, volunteer_hours: 0 },
    { id: 3, name: "Blockchain & Banking Forum", category: "Tech", location: "Business School Atrium", start_time: "2025-11-07T10:00:00", cost: 10, volunteer: true, volunteer_hours: 6 },
    { id: 4, name: "AI in Fintech Hackathon", category: "Tech", location: "Innovation Lab", start_time: "2025-11-08T08:00:00", cost: 0, volunteer: true, volunteer_hours: 10 },
    { id: 5, name: "WealthTech Career Mixer", category: "Career", location: "Auditorium A", start_time: "2025-11-09T17:00:00", cost: 5, volunteer: false, volunteer_hours: 0 },
    { id: 6, name: "Robo-Advisors Expo", category: "Finance", location: "Library Hall", start_time: "2025-11-10T13:00:00", cost: 0, volunteer: true, volunteer_hours: 5 },
    { id: 7, name: "Crypto Compliance Meetup", category: "Legal", location: "Room 204", start_time: "2025-11-11T16:30:00", cost: 5, volunteer: false, volunteer_hours: 0 },
    { id: 8, name: "Open Banking Panel", category: "Finance", location: "Tech Hall 2", start_time: "2025-11-12T10:30:00", cost: 0, volunteer: true, volunteer_hours: 4 },
    { id: 9, name: "Fintech UX/UI Showcase", category: "Design", location: "Student Center", start_time: "2025-11-13T12:00:00", cost: 0, volunteer: true, volunteer_hours: 7 },
    { id: 10, name: "Investment API Summit", category: "Tech", location: "Innovation Hub", start_time: "2025-11-14T11:00:00", cost: 5, volunteer: false, volunteer_hours: 0 }
  ];

  const handleCardClick = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleRSVP = () => {
    if (!rsvpName.trim()) {
      alert("Please enter your name to RSVP.");
      return;
    }
    alert(`✅ RSVP confirmed for ${rsvpName} to ${selectedEvent.name}`);
    setRsvpEvents((prev) => {
      const exists = prev.find((e) => e.id === selectedEvent.id);
      if (!exists) {
        return [...prev, selectedEvent];
      }
      return prev;
    });
    setCalendarDate(new Date(selectedEvent.start_time));
    setIsDialogOpen(false);
    setRsvpName("");
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const isRsvp = rsvpEvents.some(
        (event) => new Date(event.start_time).toDateString() === date.toDateString()
      );
      return classNames("react-calendar__tile", {
        "bg-indigo-600 text-white font-semibold rounded-full": isRsvp,
      });
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-8">
      <div className="mx-auto max-w-7xl grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 bg-white rounded-xl border p-4 shadow-sm h-max sticky top-8">
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-800">Your RSVPs Calendar</h2>
          </div>
          <Calendar onChange={setCalendarDate} value={calendarDate} tileClassName={tileClassName} />
          <div className="mt-4">
            <h3 className="font-semibold text-slate-700 text-sm mb-2">RSVP'd Events:</h3>
            {rsvpEvents.length === 0 ? (
              <p className="text-xs text-slate-500">No RSVPs yet</p>
            ) : (
              <ul className="text-sm space-y-1">
                {rsvpEvents.map((e) => (
                  <li key={e.id} className="text-indigo-600">{e.name} - {new Date(e.start_time).toLocaleDateString()}</li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-8">
            <CalendarIcon className="h-7 w-7 text-indigo-600" />
            <h1 className="text-3xl font-bold text-slate-800">Upcoming Fintech Events</h1>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {events.map((event) => (
              <Card
                key={event.id}
                onClick={() => handleCardClick(event)}
                className="hover:shadow-lg transition-shadow border border-slate-200 cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800 truncate">{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-slate-600">
                  <p className="text-sm font-medium text-indigo-600">{event.category}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span>{event.location}</span>
                  </div>
                  <p className="text-sm text-slate-500">🕒 {new Date(event.start_time).toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span>{event.cost === 0 ? "Free" : `$${event.cost}`}</span>
                  </div>
                  {event.volunteer && (
                    <p className="text-xs text-amber-600">Volunteer Hours: {event.volunteer_hours}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> RSVP for {selectedEvent?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <p className="text-sm text-slate-600">Enter your name to register for this event.</p>
              <Input placeholder="Your name" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} />
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleRSVP}>RSVP</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
