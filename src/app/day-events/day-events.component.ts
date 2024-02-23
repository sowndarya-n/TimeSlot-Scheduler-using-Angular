import { Component, OnInit,AfterViewInit, ChangeDetectorRef  } from '@angular/core';
import { CalendarOptions, EventInput, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

interface CalendarEvent {
  title: string;
  start: string;
  end: string;
}

@Component({
  selector: 'app-day-events',
  templateUrl: './day-events.component.html',
  styleUrls: ['./day-events.component.css']
})
export class DayEventsComponent implements OnInit {
  constructor(private cdr: ChangeDetectorRef,private authService: AuthenticationService, private router : Router) { }
  ngOnInit(): void {
    // this.addCustomDivToToolbar();
  }
  ngAfterViewInit(): void {
    this.addCustomDivToToolbar();
  }

  selectedDuration: number = 30; 
  selectedTimeFrame: string = ''; 
  private selectedTimeFrames: { start: Date; end: Date }[] = []; 
  calendarEvents: CalendarEvent[] = [];  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    selectable: true,
    editable: true,
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'timeGridWeek,timeGridDay,dayGridMonth'
    },
    views: {
      timeGridWeek: {
        buttonText: 'Week',
        allDaySlot: false
      },
      timeGridDay: {
        buttonText: 'Day',
        allDaySlot: false
      },
      dayGridMonth: {
        buttonText: 'Month',
        allDaySlot: false
      }
    },
    events: this.calendarEvents, 
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this), 
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this),
  };

  handleDateClick(event: any) {
    const clickedTime = event.date;
    const startTime = new Date(clickedTime);
    startTime.setMinutes(Math.floor(startTime.getMinutes() / 30) * 30);
    const endTime = new Date(startTime.getTime() + this.selectedDuration * 60000);
    console.log('Selected Time Frame:', startTime, 'to', endTime); 
    const newEvent: CalendarEvent = {
      title: 'New Event',
      start: startTime.toISOString(),
      end: endTime.toISOString(),
    };  
    this.calendarEvents = [...this.calendarEvents, newEvent];
    this.updateSelectedTimeFrame(startTime, endTime);
    console.log("Created event is:", newEvent);
  }
  
    
  formatTime(hours: number, minutes: number): string {
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${formattedHours}:${formattedMinutes}`;
  }
  logout():void {
    this.authService.logout();
    this.router.navigate([this.authService.redirectUrl]);
  }

  updateSelectedTimeFrame(startTime: Date, endTime: Date) {
    const startHours = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const endHours = endTime.getHours();
    const endMinutes = endTime.getMinutes();

    this.selectedTimeFrame = `${this.formatTime(startHours, startMinutes)} - ${this.formatTime(endHours, endMinutes)}`;

    console.log('Selected Time Frame:', this.selectedTimeFrame);
  }
  

    handleEventClick(clickInfo: any) {
      const overlay = document.getElementById('overlay');
      const confirmationDialog = document.getElementById('confirmationDialog');

      if (overlay && confirmationDialog) {
        overlay.style.display = 'block';
        confirmationDialog.style.display = 'block';

        (window as any)['confirmAction'] = (confirmed: boolean) => {
          overlay.style.display = 'none';
          confirmationDialog.style.display = 'none';

          if (confirmed) {
            const clickedEvent = clickInfo.event;
            this.calendarEvents = this.calendarEvents.filter(event =>
              !(new Date(event.start).getTime() === clickedEvent.start.getTime() &&
                new Date(event.end).getTime() === clickedEvent.end.getTime())
            );
            const startTime = clickedEvent.start;
            const endTime = clickedEvent.end;
            this.selectedTimeFrames = this.selectedTimeFrames.filter(timeFrame =>
              !(timeFrame.start.getTime() === startTime.getTime() && timeFrame.end.getTime() === endTime.getTime())
            );

            console.log('Updated Calendar Events:', this.calendarEvents);
            console.log('Updated Selected Time Frames:', this.selectedTimeFrames);
          }
        };
      }
    }



  private updateEventInArray(oldEvent: EventApi, newEvent: EventApi): void {
    const index = this.calendarEvents.findIndex(event =>
      event.start && oldEvent.start && new Date(event.start).getTime() === new Date(oldEvent.start).getTime()
    );

    if (index !== -1) {
      this.calendarEvents.splice(index, 1);
    }
    const convertedNewEvent: CalendarEvent = {
      title: newEvent.title,
      start: newEvent.start ? newEvent.start.toISOString() : '',
      end: newEvent.end ? newEvent.end.toISOString() : '',
    };
    this.calendarEvents.push(convertedNewEvent);
  }

  handleEventDrop(dropInfo: any) {
    const draggedEvent = dropInfo.event;
    const newStartTime = draggedEvent.start;
    const newEndTime = draggedEvent.end;
    console.log('Event dropped. New ST:', newStartTime, 'New ET:', newEndTime);
    this.updateEventInArray(dropInfo.oldEvent, draggedEvent);
    console.log('Updated Calendar Events:', this.calendarEvents);
  }

  handleEventResize(resizeInfo: any) {
    const resizedEvent = resizeInfo.event;
    const newStartTime = resizedEvent.start;
    const newEndTime = resizedEvent.end;
    console.log('Event resized. New ST:', newStartTime, 'New ET:', newEndTime);
    this.updateEventInArray(resizeInfo.oldEvent, resizedEvent);
    console.log('Updated Calendar Events:', this.calendarEvents);
  }

 
addCustomDivToToolbar() {
  this.cdr.detectChanges();
  const toolbarElement = document.querySelector('.fc-header-toolbar');

  if (toolbarElement) {
    // Create a new div element
    const customDiv = document.createElement('div');
    customDiv.className = 'fc-toolbar-chunk';

    // Create a div for the button group
    const buttonGroupDiv = document.createElement('div');
    buttonGroupDiv.className = 'fc-button-group';

    // Create buttons and add them to the button group div
    const buttons: HTMLButtonElement[] = [];
    ['15min', '30min', '60min'].forEach((label, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.className = 'fc-button fc-button-primary' + (label === '30min' ? ' fc-button-active' : '');
      buttonGroupDiv.appendChild(button);

      // Add a click event listener to each button
      button.addEventListener('click', () => {
        // Remove the .fc-button-primary class from all buttons
        buttons.forEach(btn => btn.classList.remove('fc-button-active'));

        // Add the .fc-button-primary class to the clicked button
        button.classList.add('fc-button-active');

        // Update the selectedDuration based on the clicked button
        switch (label) {
          case '15min':
            this.selectedDuration = 15;
            break;
          case '30min':
            this.selectedDuration = 30;
            break;
          case '60min':
            this.selectedDuration = 60;
            break;
          // Add more cases for other button labels if needed
        }

        console.log('Selected Duration:', this.selectedDuration);
      });

      buttons.push(button); // Store the button elements in the array
    });

    customDiv.style.display = 'flex';  
    customDiv.style.alignItems = 'center';  
    customDiv.style.padding = '5px';  
    buttonGroupDiv.style.display = 'flex';  
    buttonGroupDiv.style.gap = '0px';  

    customDiv.appendChild(buttonGroupDiv);

    toolbarElement.insertBefore(customDiv, toolbarElement.firstChild);
  } else {
    console.log('Toolbar element not found!');
  }
}






}
