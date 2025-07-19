
import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, AlertCircle, RefreshCw, Grid3X3, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCalendlyEvents, CalendlyEvent } from '@/hooks/useCalendlyEvents';
import PageLayout from '@/components/PageLayout';
import { Calendar as BigCalendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type ViewType = 'cards' | 'calendar';

const Schedule = () => {
  const { data, isLoading, error, refetch } = useCalendlyEvents();
  const [viewType, setViewType] = useState<ViewType>('cards');
  const [calendarView, setCalendarView] = useState<View>(Views.MONTH);

  const events = data?.events || [];

  const formatEventTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    try {
      const startTimeEst = start.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      const endTimeEst = end.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      return `${startTimeEst} - ${endTimeEst}`;
    } catch (e) {
      return `${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`;
    }
  };

  const formatEventDate = (startTime: string) => {
    const date = new Date(startTime);
    try {
      return date.toLocaleDateString('en-US', {
        timeZone: 'America/New_York',
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'canceled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  // Transform events for BigCalendar
  const calendarEvents = events.map((event: CalendlyEvent) => ({
    id: event.id,
    title: event.title,
    start: new Date(event.startTime),
    end: new Date(event.endTime),
    resource: event,
  }));

  const EventComponent = ({ event }: any) => (
    <div className="text-xs">
      <div className="font-medium truncate">{event.title}</div>
      {event.resource.attendees.length > 0 && (
        <div className="text-muted-foreground truncate">
          {event.resource.attendees[0].name}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading schedule...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Schedule</h1>
            </div>
            <Button 
              onClick={() => refetch()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
          
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <div>
                  <h3 className="text-lg font-semibold text-destructive">Error Loading Schedule</h3>
                  <p className="text-muted-foreground mt-1">{error.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Schedule</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border rounded-lg p-1">
              <Button
                variant={viewType === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewType('cards')}
                className="h-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewType === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewType('calendar')}
                className="h-8"
              >
                <CalendarDays className="h-4 w-4" />
              </Button>
            </div>
            <Button 
              onClick={() => refetch()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No upcoming sessions scheduled</h3>
            <p className="text-muted-foreground">
              Your upcoming Calendly sessions will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-sm text-muted-foreground">
              Showing {events.length} upcoming session{events.length !== 1 ? 's' : ''}
            </div>
            
            {viewType === 'cards' ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base font-semibold line-clamp-2">
                          {event.title}
                        </CardTitle>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(event.status)}
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatEventDate(event.startTime)}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatEventTime(event.startTime, event.endTime)}</span>
                        <span className="text-xs">({event.duration} min)</span>
                      </div>
                      
                      {event.location && event.location !== 'Not specified' && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      )}
                      
                      {event.attendees && event.attendees.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span className="line-clamp-1">
                            {event.attendees.map(a => a.name).join(', ')}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border p-4" style={{ height: '600px' }}>
                <BigCalendar
                  localizer={localizer}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  view={calendarView}
                  onView={setCalendarView}
                  views={[Views.MONTH, Views.WEEK, Views.DAY]}
                  components={{
                    event: EventComponent,
                  }}
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: event.resource.status === 'active' ? '#10b981' : '#6b7280',
                      border: 'none',
                      borderRadius: '4px',
                    },
                  })}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Schedule;
