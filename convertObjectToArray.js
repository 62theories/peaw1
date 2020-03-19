const convert = data => {
      let arr = []
      for (let i in data) {
            arr.push({ ...data[i], id: i })
      }
      return arr
}

module.exports = convert
