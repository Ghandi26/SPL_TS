"use strict";
// ------------------ ENUMS ------------------
// Статус студента
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["Active"] = "Active";
    StudentStatus["Academic_Leave"] = "Academic_Leave";
    StudentStatus["Graduated"] = "Graduated";
    StudentStatus["Expelled"] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
// Тип курсу
var CourseType;
(function (CourseType) {
    CourseType["Mandatory"] = "Mandatory";
    CourseType["Optional"] = "Optional";
    CourseType["Special"] = "Special";
})(CourseType || (CourseType = {}));
// Семестр
var Semester;
(function (Semester) {
    Semester["First"] = "First";
    Semester["Second"] = "Second";
})(Semester || (Semester = {}));
// Оцінки
var GradeValue;
(function (GradeValue) {
    GradeValue[GradeValue["Excellent"] = 5] = "Excellent";
    GradeValue[GradeValue["Good"] = 4] = "Good";
    GradeValue[GradeValue["Satisfactory"] = 3] = "Satisfactory";
    GradeValue[GradeValue["Unsatisfactory"] = 2] = "Unsatisfactory";
})(GradeValue || (GradeValue = {}));
// Факультети
var Faculty;
(function (Faculty) {
    Faculty["Computer_Science"] = "Computer_Science";
    Faculty["Economics"] = "Economics";
    Faculty["Law"] = "Law";
    Faculty["Engineering"] = "Engineering";
})(Faculty || (Faculty = {}));
// ------------------ UNIVERSITY MANAGEMENT SYSTEM ------------------
class UniversityManagementSystem {
    constructor() {
        this.students = [];
        this.courses = [];
        this.grades = [];
        this.studentIdCounter = 1;
        this.courseIdCounter = 1;
    }
    // ------------------ STUDENTS ------------------
    // Додаємо студента
    enrollStudent(studentData) {
        const student = Object.assign({ id: this.studentIdCounter++ }, studentData);
        this.students.push(student);
        return student;
    }
    // Оновлення статусу студента
    updateStudentStatus(studentId, newStatus) {
        const student = this.students.find(s => s.id === studentId);
        if (!student)
            throw new Error("Student not found");
        // Валідація: Graduated або Expelled можна лише з Active
        if ((newStatus === StudentStatus.Graduated || newStatus === StudentStatus.Expelled) &&
            student.status !== StudentStatus.Active) {
            throw new Error("Cannot change status to Graduated or Expelled unless Active");
        }
        student.status = newStatus;
    }
    // Отримати студентів факультету
    getStudentsByFaculty(faculty) {
        return this.students.filter(s => s.faculty === faculty);
    }
    // ------------------ COURSES ------------------
    // Додаємо курс
    addCourse(courseData) {
        const course = Object.assign({ id: this.courseIdCounter++ }, courseData);
        this.courses.push(course);
        return course;
    }
    // Отримати доступні курси за факультетом та семестром
    getAvailableCourses(faculty, semester) {
        return this.courses.filter(c => c.faculty === faculty && c.semester === semester);
    }
    // ------------------ REGISTRATION ------------------
    // Реєстрація студента на курс
    registerForCourse(studentId, courseId) {
        const student = this.students.find(s => s.id === studentId);
        const course = this.courses.find(c => c.id === courseId);
        if (!student)
            throw new Error("Student not found");
        if (!course)
            throw new Error("Course not found");
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
    setGrade(studentId, courseId, gradeValue) {
        const grade = this.grades.find(g => g.studentId === studentId && g.courseId === courseId);
        if (!grade)
            throw new Error("Student not registered for this course");
        grade.grade = gradeValue;
        grade.date = new Date();
    }
    // ------------------ GRADES ------------------
    // Отримати оцінки студента
    getStudentGrades(studentId) {
        return this.grades.filter(g => g.studentId === studentId);
    }
    // Розрахунок середнього балу
    calculateAverageGrade(studentId) {
        const studentGrades = this.getStudentGrades(studentId);
        if (studentGrades.length === 0)
            return 0;
        const total = studentGrades.reduce((sum, g) => sum + g.grade, 0);
        return total / studentGrades.length;
    }
    // ------------------ REPORTS ------------------
    // Список відмінників по факультету
    getTopStudentsByFaculty(faculty) {
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
