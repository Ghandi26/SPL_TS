// =======================
// 1. Визначення базових типів
// =======================

// a) Дні тижня
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

// b) Часові слоти
type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";

// c) Типи занять
type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

// =======================
// 2. Основні структури
// =======================

// a) Професор
type Professor = {
    id: number;
    name: string;
    department: string;
};

// b) Аудиторія
type Classroom = {
    number: string;
    capacity: number;
    hasProjector: boolean;
};

// c) Курс
type Course = {
    id: number;
    name: string;
    type: CourseType;
};

// d) Заняття
type Lesson = {
    id: number;
    courseId: number;
    professorId: number;
    classroomNumber: string;
    dayOfWeek: DayOfWeek;
    timeSlot: TimeSlot;
};

// e) Конфлікт розкладу
type ScheduleConflict = {
    type: "ProfessorConflict" | "ClassroomConflict";
    lessonDetails: Lesson;
};

// =======================
// 3. Масиви даних
// =======================
const professors: Professor[] = [];
const classrooms: Classroom[] = [];
const courses: Course[] = [];
const schedule: Lesson[] = [];

// =======================
// 4. Функції для додавання даних
// =======================
function addProfessor(professor: Professor): void {
    professors.push(professor);
}

function addLesson(lesson: Lesson): boolean {
    const conflict = validateLesson(lesson);
    if (conflict) {
        console.warn("Conflict detected:", conflict);
        return false;
    }
    schedule.push(lesson);
    return true;
}

// =======================
// 5. Функції пошуку та фільтрації
// =======================
function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
    const busyClassrooms = schedule
        .filter(l => l.timeSlot === timeSlot && l.dayOfWeek === dayOfWeek)
        .map(l => l.classroomNumber);
    return classrooms
        .filter(c => !busyClassrooms.includes(c.number))
        .map(c => c.number);
}

function getProfessorSchedule(professorId: number): Lesson[] {
    return schedule.filter(l => l.professorId === professorId);
}

// =======================
// 6. Валідація конфліктів
// =======================
function validateLesson(lesson: Lesson): ScheduleConflict | null {
    for (const l of schedule) {
        // Конфлікт аудиторії
        if (l.classroomNumber === lesson.classroomNumber &&
            l.dayOfWeek === lesson.dayOfWeek &&
            l.timeSlot === lesson.timeSlot) {
            return { type: "ClassroomConflict", lessonDetails: l };
        }
        // Конфлікт професора
        if (l.professorId === lesson.professorId &&
            l.dayOfWeek === lesson.dayOfWeek &&
            l.timeSlot === lesson.timeSlot) {
            return { type: "ProfessorConflict", lessonDetails: l };
        }
    }
    return null;
}

// =======================
// 7. Аналіз та звіти
// =======================
function getClassroomUtilization(classroomNumber: string): number {
    const totalSlots = schedule.length;
    const usedSlots = schedule.filter(l => l.classroomNumber === classroomNumber).length;
    return totalSlots === 0 ? 0 : (usedSlots / totalSlots) * 100;
}

function getMostPopularCourseType(): CourseType {
    const counts: Record<CourseType, number> = { Lecture: 0, Seminar: 0, Lab: 0, Practice: 0 };
    for (const l of schedule) {
        const course = courses.find(c => c.id === l.courseId);
        if (course) counts[course.type]++;
    }
    return (Object.entries(counts).sort((a,b) => b[1]-a[1])[0][0] as CourseType);
}

// =======================
// 8. Модифікація даних
// =======================
function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
    const lesson = schedule.find(l => l.id === lessonId);
    if (!lesson) return false;

    const conflict = schedule.find(l =>
        l.classroomNumber === newClassroomNumber &&
        l.dayOfWeek === lesson.dayOfWeek &&
        l.timeSlot === lesson.timeSlot
    );
    if (conflict) return false;

    lesson.classroomNumber = newClassroomNumber;
    return true;
}

function cancelLesson(lessonId: number): void {
    const index = schedule.findIndex(l => l.id === lessonId);
    if (index !== -1) schedule.splice(index, 1);
}

// =======================
// 9. Приклади використання
// =======================
addProfessor({ id: 1, name: "Ivan Ivanov", department: "CS" });
classrooms.push({ number: "101", capacity: 30, hasProjector: true });
courses.push({ id: 1, name: "TypeScript Basics", type: "Lecture" });

addLesson({ id: 1, courseId: 1, professorId: 1, classroomNumber: "101", dayOfWeek: "Monday", timeSlot: "8:30-10:00" });

console.log("Available classrooms on Monday 8:30-10:00:", findAvailableClassrooms("8:30-10:00", "Monday"));
console.log("Professor 1 schedule:", getProfessorSchedule(1));
console.log("Most popular course type:", getMostPopularCourseType());