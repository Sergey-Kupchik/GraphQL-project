const express = require("express");
const app = express();
const { graphqlHTTP} = require("express-graphql");
const bodyParser = require('body-parser');
const { buildSchema } = require("graphql");
const expressPlayground = require('graphql-playground-middleware-express').default;
const  mongoose  = require('mongoose');
const cors = require('cors')


const User = require('./models/user');

app.use(cors())
app.use(bodyParser.json());
app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
app.use(
    '/graphql',
    graphqlHTTP({
      schema: buildSchema(`
      type RootQuery {
        user (id:ID!): User!
      }
      type RootMutation {
          addUser (userInput: UserInput! ): User!
      }
      type User {
        _id: ID!
        email: String!
        password: String!
      }
      input UserInput {
        email: String!
        password: String!
      }
      schema {
          query: RootQuery
          mutation: RootMutation
      } 
    `),
      rootValue: {
        user:async(arg)=>{
          try {
            const user = await User.findOne({_id:arg.id});
            return {...user._doc};
          } catch(error){
            throw error;
          }
      },
        addUser: async(arg)=>{
          try {
            const user = new User({
              email: arg.userInput.email,
              password: arg.userInput.password,
            })
            const result = await user.save();
            return {
              ...result._doc
            } 

          } catch (error){
            throw error;
          }
        },
      },
      graphiql: true,
    }),
  );


const PORT = process.env.PORT || 5000;

// mongodb+srv://graphqluser:<password>@cluster0.oekzr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
mongoose.connect('mongodb+srv://graphqluser:1477527@cluster0.oekzr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Running running on port ${PORT}`);
        })
}).catch(error=>console.error(error));

