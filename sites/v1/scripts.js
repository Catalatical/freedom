// Weekday colors
const weekdayColors = {
    0: '#5f5f5fff', // Sunday - Red
    1: '#ff5858ff', // Monday - Orange
    2: '#80ff66ff', // Tuesday - Yellow
    3: '#d6c106ff', // Wednesday - Green
    4: '#3411b2ff', // Thursday - Blue
    5: '#a857b3ff', // Friday - Purple
    6: '#797979ff'  // Saturday - Violet
};

// Weekday names
const weekdayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
];

// Update weekday display
function updateWeekday() {
    const now = new Date();
    const bremenTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Berlin"}));
    const weekday = bremenTime.getDay();
    
    const weekdayElement = document.getElementById('weekday');
    weekdayElement.textContent = weekdayNames[weekday];
    weekdayElement.style.background = `linear-gradient(45deg, ${weekdayColors[weekday]}, ${weekdayColors[(weekday + 2) % 7]})`;
    weekdayElement.style.color = weekday < 3 ? '#333' : '#fff'; // Dark text for light colors
}

// Daily countdown to 13:10 (12:25 on Fridays)
function updateDailyCountdown() {
    const now = new Date();
    const bremenTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Berlin"}));
    const weekday = bremenTime.getDay();
    
    // Set target time (12:25 on Friday, 13:10 otherwise)
    const isFriday = weekday === 5;
    const targetHour = isFriday ? 12 : 13;
    const targetMinute = isFriday ? 25 : 10;
    
    // Update target time display
    document.getElementById('target-time').textContent = 
        `${targetHour.toString().padStart(2, '0')}:${targetMinute.toString().padStart(2, '0')}`;
    
    const target = new Date(bremenTime);
    target.setHours(targetHour, targetMinute, 0, 0);
    
    // If it's already past target time, show "FREEDOM"
    if (bremenTime > target) {
        document.getElementById('daily-countdown').innerHTML = 
            '<span class="freedom">FREEDOM!</span>';
        document.getElementById('daily-status').textContent = 
            `its ${isFriday ? 'weekend' : 'freedom'} time`;
        return;
    }
    
    // Calculate difference
    const diff = target - bremenTime;
    
    // Convert to hours, minutes, seconds
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Format and display
    document.getElementById('daily-countdown').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update status
    document.getElementById('daily-status').textContent = 
        `Counting down to ${target.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
}

// Schedule countdown with breaks
function updateScheduleCountdown() {
    const now = new Date();
    const bremenTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Berlin"}));
    
    // Schedule parameters
    const startTime = new Date(bremenTime);
    startTime.setHours(8, 0, 0, 0);
    
    const sessionLength = 90 * 60 * 1000; // 90 minutes in milliseconds
    const lessonLength = 45 * 60 * 1000; // 45 minutes in milliseconds
    const breakLength = 20 * 60 * 1000;   // 20 minutes in milliseconds
    
    // If before 8:00, count down to 8:00
    if (bremenTime < startTime) {
        const diff = startTime - bremenTime;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('schedule-countdown').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById('schedule2-countdown').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('schedule-status').textContent = "Counting down to 08:00";
        return;
    }
    
    // Calculate time since 8:00
    const timeSinceStart = bremenTime - startTime;
    
    // Calculate current cycle (each cycle is 90 min work + 20 min break = 110 min)
    const cycleLength = sessionLength + breakLength; //110 minutes in milliseconds
    const cyclesCompleted = Math.floor(timeSinceStart / cycleLength);
    const timeInCurrentCycle = timeSinceStart % cycleLength;
    
    let timeRemaining, statusText, timeRemaining2;
    
    if (timeInCurrentCycle < sessionLength) {
        // In a work session
        timeRemaining = sessionLength - timeInCurrentCycle;
        timeRemaining2 = lessonLength - timeInCurrentCycle;
        statusText = `Session ${cyclesCompleted + 1} (Lesson 1) in progress`;
            // First lesson
        if (timeInCurrentCycle > lessonLength) {
            // In the second lesson
            timeRemaining = sessionLength - timeInCurrentCycle;
            timeRemaining2 = sessionLength - timeInCurrentCycle - (lessonLength); // Time left in lesson 2
            statusText = `Session ${cyclesCompleted + 1} (Lesson 2) in progress`;
        }
    } else {
        // In a break
        timeRemaining = cycleLength - timeInCurrentCycle;
        timeRemaining2 = 0;
        statusText = `Break after session ${cyclesCompleted + 1}`;
    }
    
    // Convert to hours, minutes, seconds
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    const hours2 = Math.floor(timeRemaining2 / (1000 * 60 * 60));
    const minutes2 = Math.floor((timeRemaining2 % (1000 * 60 * 60)) / (1000 * 60));
    const seconds2 = Math.floor((timeRemaining2 % (1000 * 60)) / 1000);
    
    // Format and display
    document.getElementById('schedule-countdown').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    document.getElementById('schedule2-countdown').textContent = 
        `${hours2.toString().padStart(2, '0')}:${minutes2.toString().padStart(2, '0')}:${seconds2.toString().padStart(2, '0')}`;
    
    document.getElementById('schedule-status').textContent = statusText;
    document.getElementById("testingtext").textContent = Math.floor(timeSinceStart/cycleLength) + " - " + timeSinceStart/60000;
}

// Initialize and update all elements
function updateAll() {
    updateWeekday();
    updateDailyCountdown();
    updateScheduleCountdown();
}

// Initial update
updateAll();

// Update every second
setInterval(updateAll, 1000);