const checkTeacherId = (req, res, next) => {
      if (!req.body.teacherId) {
            return res.sendStatus(400)
      }
      return next()
}

module.exports = checkTeacherId
