const hapi = require('@hapi/hapi');
const mysql = require('mysql');
const environment = require('./knexfile');
const knex = require('knex')(environment['development']);


const init = async()=>{
    const server = hapi.server({
        port:3000,
        host:'localhost'
    });
    server.route({
        method:'POST',
        path:'/insert',
        handler:async(req,h)=>{
            try {
                let data = await knex('happy').where({email:req.payload.email})
                if(data.length ==0){
                    await knex('happy').insert(req.payload)
                    return ("data insert successfully")
                }
                return ('your data is already exit, Please try another response')
            } catch (error) {
                return h.response(error.message)
            }
        }
    });

    server.route({
        method:'GET',
        path:'/path/{id}',
        handler:async(req,res)=>{
            try {
                const data = await knex('happy').where({id:req.params.id})
                return res.response(data)
            } catch (error) {
                return res.response(error)
            }
        }
    });

    server.route({
        method:'PUT',
        path:'/update',
        handler:async(req,res)=>{
            console.log(req.payload)
            try{
                console.log(req.payload);
                const data = await knex('happy').where({email:req.payload.email}).update(req.payload)
                return res.response('your data update')
            }catch(err){
                return res.response(err)
            }
        }
    })

    await server.start();
    console.log('server running on ', server.info.uri);
}

init();