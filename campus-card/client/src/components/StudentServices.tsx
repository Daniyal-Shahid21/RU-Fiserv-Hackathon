import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  Clock,
  Search,
  Users,
  Laptop,
  HeartHandshake,
  Sparkles,
  Building2,
  GraduationCap,
  Printer,
  UtensilsCrossed,
  ShoppingBag,
} from "lucide-react";

// shadcn/ui components (assumes your project has shadcn installed)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

// ---------- Types ----------
interface Service {
  id: string;
  name: string;
  description: string;
  category: "Academic" | "Finance" | "Career" | "Wellness" | "Technology" | "Campus Life" | "Facilities";
  icon: React.ReactNode;
  tags: string[];
  contact: {
    email?: string;
    phone?: string;
    location?: string;
    cost?: string; // show when available
  };
}

interface EventItem {
  id: string;
  title: string;
  when: string; // ISO or human string
  location: string;
  category: string;
}

// ---------- Mock Data ----------
const SERVICES: Service[] = [
  // $$$ campus services with costs
  {
    id: "printing",
    name: "Printing & Copy Services",
    description: "High‑quality printing, scanning, and copying for assignments and posters.",
    category: "Facilities",
    icon: <Printer className="w-5 h-5" />,
    tags: ["printing", "copying", "poster"],
    contact: {
      email: "printshop@university.edu",
      phone: "(555) 123-7000",
      location: "Library 1F",
      cost: "$0.10 per B/W page",
    },
  },
  {
    id: "catering",
    name: "Campus Catering",
    description: "Full‑service catering for events, meetings, and student gatherings.",
    category: "Facilities",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    tags: ["food", "events", "orders"],
    contact: {
      email: "catering@university.edu",
      phone: "(555) 123-7100",
      location: "Dining Services",
      cost: "Varies by menu",
    },
  },
  {
    id: "bookstore",
    name: "Campus Bookstore",
    description: "Purchase textbooks, university apparel, and class supplies.",
    category: "Facilities",
    icon: <ShoppingBag className="w-5 h-5" />,
    tags: ["books", "merch", "supplies"],
    contact: {
      email: "bookstore@university.edu",
      phone: "(555) 123-7200",
      location: "Student Center 1F",
      cost: "Varies",
    },
  },
  // core student services
  {
    id: "advising",
    name: "Academic Advising",
    description: "Plan your courses, map your degree, and stay on track to graduate.",
    category: "Academic",
    icon: <GraduationCap className="w-5 h-5" />,
    tags: ["appointments", "degree audit", "registration"],
    contact: { email: "advising@university.edu", phone: "(555) 123-1000", location: "Library, 2nd Floor" },
  },
  {
    id: "fin-aid",
    name: "Financial Aid",
    description: "Grants, scholarships, FAFSA help, and budgeting workshops.",
    category: "Finance",
    icon: <Building2 className="w-5 h-5" />,
    tags: ["fafsa", "scholarships", "grants"],
    contact: { email: "finaid@university.edu", phone: "(555) 123-2000", location: "Admin Hall, Room 110" },
  },
  {
    id: "career",
    name: "Career Services",
    description: "Resumes, mock interviews, internships, and job fairs.",
    category: "Career",
    icon: <Users className="w-5 h-5" />,
    tags: ["resume", "internships", "jobs"],
    contact: { email: "careers@university.edu", phone: "(555) 123-3000", location: "Innovation Hub" },
  },
  {
    id: "counseling",
    name: "Counseling & Wellness",
    description: "Confidential counseling, support groups, and wellness coaching.",
    category: "Wellness",
    icon: <HeartHandshake className="w-5 h-5" />,
    tags: ["mental health", "wellbeing", "support"],
    contact: { email: "wellness@university.edu", phone: "(555) 123-4000", location: "Health Center" },
  },
  {
    id: "it",
    name: "IT Help Desk",
    description: "Tech support, software access, and Wi‑Fi troubleshooting.",
    category: "Technology",
    icon: <Laptop className="w-5 h-5" />,
    tags: ["wifi", "software", "accounts"],
    contact: { email: "helpdesk@university.edu", phone: "(555) 123-5000", location: "Tech Commons" },
  },
  {
    id: "student-life",
    name: "Student Life & Orgs",
    description: "Clubs, leadership, volunteering, and campus events.",
    category: "Campus Life",
    icon: <BookOpen className="w-5 h-5" />,
    tags: ["clubs", "leadership", "events"],
    contact: { email: "studentlife@university.edu", phone: "(555) 123-6000", location: "Campus Center" },
  },
];

const EVENTS: EventItem[] = [
  { id: "1", title: "Resume Pop‑Up Clinic", when: "Nov 20, 3:00–5:00 PM", location: "Career Studio", category: "Career" },
  { id: "2", title: "FAFSA Help Night", when: "Nov 22, 6:00–8:00 PM", location: "Admin Hall 110", category: "Finance" },
  { id: "3", title: "Mindfulness Monday", when: "Nov 24, 12:30–1:00 PM", location: "Health Center Lounge", category: "Wellness" },
  { id: "4", title: "Advising Drop‑ins", when: "Nov 25, 10:00 AM–2:00 PM", location: "Library 2F", category: "Academic" },
];

// ---------- Little Helpers ----------
const categories = ["All", "Academic", "Finance", "Career", "Wellness", "Technology", "Campus Life", "Facilities"] as const;

type Category = (typeof categories)[number];

function useFilteredServices(query: string, category: Category) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICES.filter((s) => {
      const inCat = category === "All" ? true : s.category === category;
      if (!q) return inCat;
      const hay = `${s.name} ${s.description} ${s.tags.join(" ")}`.toLowerCase();
      return inCat && hay.includes(q);
    });
  }, [query, category]);
}

// ---------- DEV Sanity Tests (run only in dev) ----------
if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
  // unique IDs
  const ids = new Set<string>();
  for (const s of SERVICES) {
    console.assert(!ids.has(s.id), `Duplicate service id: ${s.id}`);
    ids.add(s.id);
    // Facilities should expose a cost string
    if (s.category === "Facilities") {
      console.assert(typeof s.contact.cost === "string" && s.contact.cost.length > 0, `Facilities service missing cost: ${s.name}`);
    }
  }
}

// ---------- Page Component ----------
export default function StudentServicesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [agree, setAgree] = useState(false);

  const results = useFilteredServices(query, category);

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-slate-50">
        {/* Hero */}
        <section className="px-6 md:px-10 lg:px-16 py-10 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-6xl mx-auto"
          >
            <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
              <div>
                <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">Student Services</h1>
                <p className="mt-3 text-slate-600 max-w-2xl">
                  Find advising, financial aid, career help, wellness support, printing, catering, and more—
                  all in one place.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="rounded-2xl">
                        <Calendar className="mr-2 h-4 w-4" /> Book appointment
                      </Button>
                    </DialogTrigger>
                    <BookAppointmentDialog />
                  </Dialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="lg" className="rounded-2xl">
                        <HelpCircle className="mr-2 h-4 w-4" /> Get help now
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Use the search below or call (555) 123‑0000.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <QuickContactCard />
            </div>

            {/* Search & Filters */}
            <Card className="mt-8 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Search services</CardTitle>
                <CardDescription>Type a keyword and filter by category.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Try: FAFSA, resume, Wi‑Fi, printing, catering…"
                      className="pl-9"
                    />
                  </div>

                  <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                    <SelectTrigger className="w-full md:w-56">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-sm text-slate-500">
                  Showing <span className="font-medium text-slate-700">{results.length}</span> service{results.length !== 1 && "s"}
                </div>
              </CardContent>
            </Card>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
              {results.map((s) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <Card className="h-full rounded-2xl hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2 text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-xl bg-slate-100">{s.icon}</span>
                          <CardTitle className="text-lg">{s.name}</CardTitle>
                        </div>
                        {/* Cost badge if available */}
                        {s.contact.cost && (
                          <Badge variant="secondary" className="rounded-xl">Cost: {s.contact.cost}</Badge>
                        )}
                      </div>
                      <CardDescription className="pt-1">{s.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="rounded-xl">{s.category}</Badge>
                        {s.tags.map((t) => (
                          <Badge key={t} variant="outline" className="rounded-xl">
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
                        {s.contact.location && (
                          <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {s.contact.location}</div>
                        )}
                        {s.contact.email && (
                          <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {s.contact.email}</div>
                        )}
                        {s.contact.phone && (
                          <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {s.contact.phone}</div>
                        )}
                      </div>
                      <div className="pt-2 flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="rounded-xl">Learn more</Button>
                          </DialogTrigger>
                          <ServiceDialog service={s} />
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="rounded-xl">Book</Button>
                          </DialogTrigger>
                          <BookAppointmentDialog presetService={s.name} />
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Tabs: Events / FAQ / Contact */}
            <Tabs defaultValue="events" className="mt-10">
              <TabsList className="rounded-2xl">
                <TabsTrigger value="events">Upcoming events</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="contact">Contact us</TabsTrigger>
              </TabsList>
              <TabsContent value="events" className="mt-4">
                <EventsPanel />
              </TabsContent>
              <TabsContent value="faq" className="mt-4">
                <FAQPanel />
              </TabsContent>
              <TabsContent value="contact" className="mt-4">
                <ContactPanel agree={agree} setAgree={setAgree} />
              </TabsContent>
            </Tabs>

            <footer className="mt-12 text-center text-xs text-slate-500">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>You're doing great—reach out if you need anything.</span>
              </div>
            </footer>
          </motion.div>
        </section>
      </div>
    </TooltipProvider>
  );
}

// ---------- Subcomponents ----------
function QuickContactCard() {
  return (
    <Card className="w-full md:max-w-sm rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Need quick help?</CardTitle>
        <CardDescription>Contact Student Services Central.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-700">
        <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> (555) 123‑0000</div>
        <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> help@university.edu</div>
        <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Mon–Fri, 9:00 AM – 5:00 PM</div>
        <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Campus Center, 1F</div>
      </CardContent>
    </Card>
  );
}

function EventsPanel() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {EVENTS.map((ev) => (
        <Card key={ev.id} className="rounded-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{ev.title}</CardTitle>
              <Badge variant="secondary">{ev.category}</Badge>
            </div>
            <CardDescription>{ev.when}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {ev.location}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FAQPanel() {
  return (
    <Accordion type="single" collapsible className="rounded-2xl">
      <AccordionItem value="item-1">
        <AccordionTrigger>How do I book an advising appointment?</AccordionTrigger>
        <AccordionContent>
          Use the <span className="font-medium">Book appointment</span> button above and choose <span className="font-medium">Academic Advising</span>.
          You'll receive a confirmation email instantly.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Where can I get help with FAFSA?</AccordionTrigger>
        <AccordionContent>
          Visit <span className="font-medium">Financial Aid</span> during drop‑in hours or join the "FAFSA Help Night" event in the Events tab.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is counseling confidential?</AccordionTrigger>
        <AccordionContent>
          Yes. Counseling & Wellness follows strict confidentiality policies and does not share your information without consent, except in emergencies.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function ContactPanel({ agree, setAgree }: { agree: boolean; setAgree: (v: boolean) => void }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle>Contact us</CardTitle>
        <CardDescription>We aim to respond within 1 business day.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thanks! Your message has been sent.");
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" required placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="jane@university.edu" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" required placeholder="e.g., Advising question" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" required placeholder="How can we help?" className="min-h-[120px]" />
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <Checkbox id="consent" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
            <Label htmlFor="consent" className="text-sm text-slate-600">I consent to be contacted about this request.</Label>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="rounded-2xl" disabled={!agree}>Send message</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function BookAppointmentDialog({ presetService }: { presetService?: string }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [service, setService] = useState(presetService ?? "Academic Advising");

  return (
    <DialogContent className="rounded-2xl sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>Book an appointment</DialogTitle>
        <DialogDescription>Pick a service and time that works for you.</DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label>Service</Label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger>
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {SERVICES.map((s) => (
                <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Time</Label>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>
      <DialogFooter>
        <Button
          className="rounded-2xl"
          disabled={!date || !time || !service}
          onClick={() => alert(`Booked: ${service} on ${date} at ${time}`)}
        >
          Confirm booking
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function ServiceDialog({ service }: { service: Service }) {
  return (
    <DialogContent className="rounded-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-slate-100">{service.icon}</span>
          {service.name}
        </DialogTitle>
        <DialogDescription>{service.description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 text-sm text-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">How we can help</CardTitle>
              <CardDescription>Common support areas</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {service.tags.map((t) => (
                  <li key={t} className="capitalize">{t}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Contact</CardTitle>
              <CardDescription>Reach the team directly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {service.contact.email && (
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {service.contact.email}</div>
              )}
              {service.contact.phone && (
                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {service.contact.phone}</div>
              )}
              {service.contact.location && (
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {service.contact.location}</div>
              )}
              {service.contact.cost && (
                <div className="flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Cost: {service.contact.cost}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DialogContent>
  );
}
