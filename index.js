import Fastify from "fastify";
import mongoose from "mongoose";
import User from './models/user.model.js'
const fastify = Fastify({logger: true})

fastify.get('/', (request, reply) => {
    reply.send({hello: "world"})
})

// to create user
fastify.post('/api/user', async (request, reply) => {
    try {
        const newUser = await new User(request.body).save()
        reply.status(200).send(newUser)
    } catch (error) {
        reply.status(500).send({message: error.message})
    }
})

//to fetch user info
fastify.get('/api/users', async(request, reply) => {
    try {
        const users = await User.find();
        reply.status(200).send(users)
    } catch (error) {
        reply.status(500).send({message: error.message})
    }
})

//to fetch a single user
fastify.get('/api/user/:id', async(request, reply) => {
    try {
        const {id} = request.params;
        const user = await User.findById(id);
        reply.status(200).send(user)
    } catch (error) {
        reply.status(500).send({message: error.message})
    }
})

//to update a user 
fastify.put('/api/user/:id', async (request, reply)=> {
    try {
        const {id} = request.params;
        const user = await User.findByIdAndUpdate(id, request.body)
        if(!user){
            return reply.status(400).send({message: "user not found"})
        }
        const updatedUser = await User.findById(id)
        reply.status(200).send(updatedUser)
    } catch (error) {
        reply.status(500).send({message: error.message})
    }
})
//to delete a user 
fastify.delete('/api/user/:id', async (request, reply) => {
    try {
        const {id} = request.params;
        const user = await User.findByIdAndDelete(id)
        if(!user){
            reply.status(400).send({message: "no user"})
        }
        reply.status(200).send({message: "user deleted successfully"})
    } catch (error) {
        reply.status(500).send({message: error.message})
    }
})



  const startServer = async () => {
    try {
        await mongoose.connect("mongodb+srv://arshanashraf2002:404qLJudjwxtOEWj@cluster0.ch69d.mongodb.net/Fastify-crud?retryWrites=true&w=majority&appName=Cluster0")
        console.log('Mongodb is Connected!')
        await fastify.listen({port: 4000});
        console.log(`server is running at https://127.0.0.1:4000`)
    } catch (error) {
        console.log("connection failed", error)
        process.exit(1)
    }
  }

  startServer();