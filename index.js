const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const _ = require("lodash")
const axios = require("axios")
const checkStudentId = require("./checkStudentId")
const checkTeachetId = require("./checkTeacherId")
const convertObjectToArray = require("./convertObjectToArray")
app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.get("/student/course", checkStudentId, async (req, res) => {
      const course = await axios.get(
            "https://qpid-49d68.firebaseio.com/courses.json"
      )
      courseByStudent = convertObjectToArray(course.data).filter(
            course => course && course.studentId == req.body.studentId
      )
      res.send(courseByStudent)
})

app.get("/course/:id", async (req, res) => {
      const course = await axios.get(
            `https://qpid-49d68.firebaseio.com/courses/${req.params.id}.json`
      )
      res.send(course.data)
})

app.get("/course", async (req, res) => {
      const course = await axios.get(
            "https://qpid-49d68.firebaseio.com/courses.json"
      )
      res.send(convertObjectToArray(course.data))
})

app.get("/waitingcourse", async (req, res) => {
      const course = await axios.get(
            "https://qpid-49d68.firebaseio.com/courses.json"
      )
      res.send(
            convertObjectToArray(course.data).filter(
                  course => course.status === "waiting"
            )
      )
})

app.get("/successcourse", async (req, res) => {
      const course = await axios.get(
            "https://qpid-49d68.firebaseio.com/courses.json"
      )
      res.send(
            convertObjectToArray(course.data).filter(
                  course => course.status === "success"
            )
      )
})

app.post("/course", checkStudentId, async (req, res) => {
      if (req.body.name && req.body.description && req.body.price) {
            const response = await axios.post(
                  "https://qpid-49d68.firebaseio.com/courses.json",
                  {
                        name: req.body.name,
                        description: req.body.description,
                        price: req.body.description,
                        studentId: req.body.studentId,
                        status: "waiting"
                  }
            )
            if (response.data) {
                  return res.sendStatus(200)
            }
            return res.sendStatus(400)
      }
      return res.sendStatus(400)
})

app.get("/teacher/course", checkTeachetId, async (req, res) => {
      const course = await axios.get(
            "https://qpid-49d68.firebaseio.com/courses.json"
      )
      if (course.data) {
            let waitingCourse = convertObjectToArray(course.data).filter(
                  course => course.status === "waiting"
            )
            return res.send(waitingCourse)
      }
      return res.send([])
})

app.post("/offer", checkTeachetId, async (req, res) => {
      if (req.body.courseId) {
            const response = await axios.get(
                  `https://qpid-49d68.firebaseio.com/courses/${req.body.courseId}.json`
            )
            let thatCourse = response.data
            if (thatCourse && thatCourse.status === "waiting") {
                  const sent2 = await axios.patch(
                        `https://qpid-49d68.firebaseio.com/courses/${req.body.courseId}.json`,
                        {
                              status: "success"
                        }
                  )
                  if (sent2.data) {
                        const sent = await axios.post(
                              "https://qpid-49d68.firebaseio.com/offers.json",
                              {
                                    teacherId: req.body.teacherId,
                                    courseId: req.body.courseId
                              }
                        )

                        if (sent.data) {
                              return res.sendStatus(200)
                        }
                  }
                  return res.sendStatus(400)
            }
            return res.sendStatus(400)
      }
      return res.sendStatus(400)
})

app.get("/teacher/offer", checkTeachetId, async (req, res) => {
      const response = await axios.get(
            `https://qpid-49d68.firebaseio.com/offers.json`
      )
      if (response.data) {
            const offerByTeacherId = convertObjectToArray(response.data).filter(
                  course => course.teacherId === req.body.teacherId
            )
            res.send(offerByTeacherId)
      }
      return res.sendStatus(400)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
      console.log("server on port:", PORT)
})
