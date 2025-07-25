'use client'
import {useEffect, useState} from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment-timezone";
import {DashboardLayout} from "@/components/layout/dashboard-layout";
import {showSoutenance, Shulder} from "@/lib/services/soutenance";
import "react-big-calendar/lib/css/react-big-calendar.css";


moment.tz.setDefault("Europe/Paris");

export default function SoutenancesPage() {
    const [soutenances, setSoutenances] = useState<Shulder[]>([]);

    const events = soutenances.map(s => ({
        title: s.title,
        start: new Date(s.start),
        end: new Date(s.end),
        allDay: true
    }));

    const [date, setDate] = useState(new Date());
    const [view, setView] = useState<"month" | "week" | "day" | "agenda">("month");

    const localizer = momentLocalizer(moment);

    const EventComponent = ({ event }: { event: any }) => {
        const start = moment(event.start).tz("Europe/Paris").format("HH:mm");
        const end = moment(event.end).tz("Europe/Paris").format("HH:mm");
        return (
            <span>
        {event.title} — {start} - {end}
      </span>
        );
    };

    useEffect(() => {
        const fetchSoutenance = async ()=>{
            try {
                const response = await  showSoutenance()
                if(!response)  throw new Error("Could not find souten soutenance");

                setSoutenances(response)

            }catch (e) {
                console.log(e)
            }
        }

        fetchSoutenance()
    },[])

    const handleNavigate = (newDate: Date) => setDate(newDate);
    const handleViewChange = (newView: any) => setView(newView);

    return (
        <DashboardLayout>
            <div className="px-4 py-6 bg-white text-black min-h-screen">
                <h1 className="text-3xl font-bold mb-6 text-center">Planning des Soutenances</h1>

                <div className="flex justify-center items-center py-10">
                    <div className="w-full max-w-7xl border border-gray-300 rounded-lg shadow-lg bg-white p-4">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            date={date}                    // <== Ajout
                            onNavigate={handleNavigate}    // <== Ajout
                            view={view}                    // <== Ajout
                            onView={handleViewChange}      // <== Ajout
                            style={{ height: 600 }}
                            components={{
                                event: EventComponent
                            }}
                            min={new Date(1970, 1, 1, 8, 0)}
                            max={new Date(1970, 1, 1, 20, 0)}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
