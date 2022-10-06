module.exports =  (req, res) =>{
  const {name = 'hello'} = req.query
  res.status(200).send(`hello ${name}!`)
}