module.exports = async (req, res) =>{
    if(req.method === "GET"){
        res.json([
            {name: 'john', location:'dhaka'}
        ])
    }else{
        
    }
}