// ------------------ ENUMS ------------------

// Статус студента
enum StudentStatus {
    Active = "Active",
    Academic_Leave = "Academic_Leave",
    Graduated = "Graduated",
    Expelled = "Expelled"
}

// Тип курсу
enum CourseType {
    Mandatory = "Mandatory",
    Optional = "Optional",
    Special = "Special"
}

// Семестр
enum Semester {
    First = "First",
    Second = "Second"
}

// Оцінки
enum GradeValue {
    Excellent = 5,
    Good = 4,
    Satisfactory = 3,
    Unsatisfactory = 2
}

// Факультети
enum Faculty {
    Computer_Science = "Computer_Science",
    Economics = "Economics",
    Law = "Law",
    Engineering = "Engineering"
}

// ------------------ INTERFACES ------------------

interface Student {
    id: number;
    fullName: string;
    faculty: Faculty;
    year: number;
    status: StudentStatus;
    enrollmentDate: Date;
    groupNumber: string;
}

interface Course {
    id: number;
    name: string;
    type: CourseType;
    credits: number;
    semester: Semester;
    faculty: Faculty;
    maxStudents: number;
}

interface Grade {
    studentId: number;
    courseId: number;
    grade: GradeValue;
    date: Date;
    semester: Semester;
}

// ------------------ UNIVERSITY MANAGEMENT SYSTEM ------------------

class UniversityManagementSystem {
    private students: Student[] = [];
    private courses: Course[] = [];
    private grades: Grade[] = [];
    private studentIdCounter = 1;
    private courseIdCounter = 1;

    // ------------------ STUDENTS ------------------

    // Додаємо студента
    enrollStudent(studentData: Omit<Student, "id">): Student {
        const student: Student = {
            id: this.studentIdCounter++,
            ...studentData
        };
        this.students.push(student);
        return student;
    }

    // Оновлення статусу студента
    updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
        const student = this.students.find(s => s.id === studentId);
        if (!student) throw new Error("Student not found");

        // Валідація: Graduated або Expelled можна лише з Active
        if (
            (newStatus === StudentStatus.Graduated || newStatus === StudentStatus.Expelled) &&
            student.status !== StudentStatus.Active
        ) {
            throw new Error("Cannot change status to Graduated or Expelled unless Active");
        }

        student.status = newStatus;
    }

    // Отримати студентів факультету
    getStudentsByFaculty(faculty: Faculty): Student[] {
        return this.students.filter(s => s.faculty === faculty);
    }

    // ------------------ COURSES ------------------

    // Додаємо курс
    addCourse(courseData: Omit<Course, "id">): Course {
        const course: Course = {
            id: this.courseIdCounter++,
            ...courseData
        };
        this.courses.push(course);
        return course;
    }

    // Отримати доступні курси за факультетом та семестром
    getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
        return this.courses.filter(
            c => c.faculty === faculty && c.semester === semester
        );
    }

    // ------------------ REGISTRATION ------------------

    // Реєстрація студента на курс
    registerForCourse(studentId: number, courseId: number): void {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);

        if (!student) throw new Error("Student not found");
        if (!course) throw new Error("Course not found");
        if (student.faculty !== course.faculty)
            throw new Error("Student's faculty does not match course faculty");

        // Перевірка кількості студентів на курсі
        const enrolledCount = this.grades.filter(g => g.courseId === courseId).length;
        if (enrolledCount >= course.maxStudents)
            throw new Error("Course is full");

        // Реєстрація: додаємо "порожню" оцінку
        this.grades.push({
            studentId,
            courseId,
            grade: GradeValue.Satisfactory, // тимчасова початкова оцінка
            date: new Date(),
            semester: course.semester
        });
    }

    // Виставлення оцінки
    setGrade(studentId: number, courseId: number, gradeValue: GradeValue): void {
        const grade = this.grades.find(
            g => g.studentId === studentId && g.courseId === courseId
        );
        if (!grade) throw new Error("Student not registered for this course");

        grade.grade = gradeValue;
        grade.date = new Date();
    }

    // ------------------ GRADES ------------------

    // Отримати оцінки студента
    getStudentGrades(studentId: number): Grade[] {
        return this.grades.filter(g => g.studentId === studentId);
    }

    // Розрахунок середнього балу
    calculateAverageGrade(studentId: number): number {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0) return 0;
        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        return total / studentGrades.length;
    }

    // ------------------ REPORTS ------------------

    // Список відмінників по факультету
    getTopStudentsByFaculty(faculty: Faculty): Student[] {
        const students = this.getStudentsByFaculty(faculty);
        return students.filter(s => this.calculateAverageGrade(s.id) >= GradeValue.Excellent);
    }
}

// ------------------ EXAMPLE USAGE ------------------

// Ініціалізація системи
const ums = new UniversityManagementSystem();

// Додаємо студентів
const freeman = ums.enrollStudent({
    fullName: "Gordon Freeman",
    faculty: Faculty.Computer_Science,
    year: 2,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2022-09-01"),
    groupNumber: "CS-201"
});

const kleiner = ums.enrollStudent({
    fullName: "Issac Kleiner",
    faculty: Faculty.Computer_Science,
    year: 2,
    status: StudentStatus.Active,
    enrollmentDate: new Date("2022-09-01"),
    groupNumber: "CS-201"
});

// Додаємо курси
const tsCourse = ums.addCourse({
    name: "TypeScript Basics",
    type: CourseType.Mandatory,
    credits: 5,
    semester: Semester.First,
    faculty: Faculty.Computer_Science,
    maxStudents: 2
});

// Реєструємо студентів
ums.registerForCourse(freeman.id, tsCourse.id);
ums.registerForCourse(kleiner.id, tsCourse.id);

// Виставляємо оцінки
ums.setGrade(freeman.id, tsCourse.id, GradeValue.Excellent);
ums.setGrade(kleiner.id, tsCourse.id, GradeValue.Good);

// Отримуємо оцінки
console.log("Freeman's grades:", ums.getStudentGrades(freeman.id));
console.log("Kleiner's grades:", ums.getStudentGrades(kleiner.id));

// Середній бал
console.log("Freeman's average:", ums.calculateAverageGrade(freeman.id));
console.log("Kleiner's average:", ums.calculateAverageGrade(kleiner.id));

// Відмінники по факультету
console.log("Top students CS:", ums.getTopStudentsByFaculty(Faculty.Computer_Science));