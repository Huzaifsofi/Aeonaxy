const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


const createCourse = async (req, res) => {
    const { name, categories, like, level } = req.body;

    let courses;
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
    return res.status(400).json({ courses })
}

const getCourse = async (req, res) => {
    let courses;

    try {

    } catch (err) {
        console.log(err)
    }
    if (!courses) {
        return res.status(400).json({ 'message': 'unable to get' })
    }
    return res.status(400).json({ courses })
}

const updateCourse = async (req, res) => {
    let courses;

    try {

    } catch (err) {
        console.log(err)
    }
    if (!courses) {
        return res.status(400).json({ 'message': 'unable to get' })
    }
    return res.status(400).json({ courses })
}

const deleteCourse = async (req, res) => {
    let courses;

    try {

    } catch (err) {
        console.log(err)
    }
    if (!courses) {
        return res.status(400).json({ 'message': 'unable to get' })
    }
    return res.status(400).json({ courses })
}

exports.createCourse = createCourse
exports.getCourse = getCourse
exports.updateCourse = updateCourse
exports.deleteCourse = deleteCourse