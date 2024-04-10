const express = require('express')
const route = express.Router()


const CourseRoute = require('../controller/courseControll')
const AuthRoute = require('../controller/authControll')


route.post('/', AuthRoute.verifyjwt , CourseRoute.createCourse)
route.get('/',  CourseRoute.getCourse)
route.get('/:id', CourseRoute.getCourseById)
route.put('/:id', AuthRoute.verifyjwt , CourseRoute.updateCourse)
route.delete('/:id', AuthRoute.verifyjwt , CourseRoute.deleteCourse)

route.get('/enroll/:id', AuthRoute.verifyjwt, CourseRoute.courseEnroll)
route.get('/mycourses/all', AuthRoute.verifyjwt, CourseRoute.EnrolledCourses)



module.exports = route;