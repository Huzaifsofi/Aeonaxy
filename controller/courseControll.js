const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const createCourse = async (req, res) => {
    const { name, categories, level } = req.body;

    const id = req.user.id;

    const getuser = await prisma.user.findUnique({
        where: {
            id: id
        }
    })

    const checkadmin = await getuser.role;

    if (checkadmin !== "admin") {
        return res.status(400).json({ 'message': 'not an admin' })
    }

    let courses;


    if (level !== "beginner" && level !== "intermediate" && level !== "expert") {
        return res.status(400).json({ 
            'message': 'invalide input level',
            "level": "should be beginner or intermediate or expert"
        })
    }

    if (categories !== "Development" && categories !== "Design" && categories !== "Business") {
        return res.status(400).json({ 
            'message': 'invalide input level', 
            "level": "should be Development or  Design or Business"
        })
    }
    

    const like = 0
    try {
        courses = await prisma.course.create({
            data: {
                name: name,
                categories: categories,
                like: like,
                level: level
            }
        })
    } catch (err) {
        console.log(err)
    }
    if (!courses) {
        return res.status(400).json({ 'message': 'unable to get' })
    }
    return res.status(201).json({ courses })
}

const getCourse = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1; 
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 2;

    const { category, level, search } = req.query;
    
    const where = {};

    if (category) {
        where.categories = category;
    }
    if (level) {
        where.level = level;
    }

    if (search) {
        where.name = {
            contains: search 
        };
    }
    
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    let courses;

    try {
        courses = await prisma.course.findMany({
            where: where,
            skip: skip,
            take: take,
        });
    } catch (err) {
        console.log(err)
    }
    if (!courses) {
        return res.status(400).json({ 'message': 'unable to get' })
    }
    return res.status(200).json({ courses })
}


const getCourseById = async (req, res) => {
    const id  = req.params.id;

    let courses;

    try {
        courses = await prisma.course.findUnique({
            where: {
                id: id
            }, 
            include: {
                users: true
            }
        })
    } catch (err) {
        console.log(err)
    }
    if (!courses) {
        return res.status(400).json({ 'message': 'unable to get' })
    }
    return res.status(200).json({ courses })
}



const updateCourse = async (req, res) => {
    const { name, categories, level } = req.body;

    const id  = req.params.id;

    const userid = req.user.id;

    const getuser = await prisma.user.findUnique({
        where: {
            id: userid
        }
    })

    const checkadmin = await getuser.role;

    if (checkadmin !== "admin") {
        return res.status(400).json({ 'message': 'not an admin' })
    }

    let courses;

    try {
        courses = await prisma.course.update({
            where: {
                id: id
            },
            data: {
                name,
                categories,
                level 
            }
        })
    } catch (err) {
        console.log(err)
    }
    if (!courses) {
        return res.status(400).json({ 'message': 'unable to get' })
    }
    return res.status(201).json({ courses })
}

const deleteCourse = async (req, res) => {
    const id  = req.params.id;
    let courses;

    const userid = req.user.id;

    const getuser = await prisma.user.findUnique({
        where: {
            id: userid
        }
    })

    const checkadmin = await getuser.role;

    if (checkadmin !== "admin") {
        return res.status(400).json({ 'message': 'not an admin' })
    }

    try {
        courses = await prisma.course.delete({
            where: {
                id: id
            }
        })
    } catch (err) {
        console.log(err)
    }
    if (!courses) {
        return res.status(400).json({ 'message': 'unable to get' })
    }
    return res.status(200).json({ 'message': 'sucssfully deleted' })
}

const courseEnroll = async (req, res) => {

    const courseid = req.params.id;

    const userid = req.user.id;

    const checkEnrolledBefore = await prisma.user.findUnique({
        where: {
            id: userid
        },
        select: {
            courses: {
                where: {
                    id: courseid
                }
            }
        }
    })

    if (checkEnrolledBefore) {
        return res.status(400).json({ 'message': 'already enrolled' })
    }


    let course;
    let users;

    try {
        users = await prisma.user.update({
            where: {
                id: userid
            },
            data: {
                courses: {
                    connect: {id: courseid}
                }
            }
        })


        course = await prisma.course.update({
            where: {
                id: courseid
            },
            data: {
                users: {
                    connect: {id: userid}
                }
            }
        })
    } catch (err) {
        console.log(err)
    }
    if (!course || !users) {
        return res.status(400).json({ 'message': 'unable to get' })
    }
    return res.status(200).json({ 'message': `sucssfully enrolled in ${course.name}` })
}

const EnrolledCourses = async (req, res) => {

    const userid = req.user.id;

    let courses;

    try {
        courses = await prisma.user.findUnique({
            where: {
                id: userid
            },
            select: {
                courses: true
            }
        })
    } catch (err) {
        console.log(err)
    } 
    if (!courses) {
        return res.status(400).json({ 'message': 'unable to get courses' })
    }
    return res.status(200).json({ courses })
}


const searchCourse = async (req, res) => {

}


exports.createCourse = createCourse
exports.getCourse = getCourse
exports.getCourseById = getCourseById
exports.updateCourse = updateCourse
exports.deleteCourse = deleteCourse

exports.courseEnroll = courseEnroll
exports.EnrolledCourses = EnrolledCourses