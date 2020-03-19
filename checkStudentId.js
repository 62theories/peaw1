const checkStudentId = (req, res, next) => {
      if (!req.body.studentId) {
            return res.sendStatus(400)
      }
      return next()
}

module.exports = checkStudentId
