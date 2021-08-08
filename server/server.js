const express = require("express");
const app = express();
const { graphqlHTTP} = require("express-graphql");
const bodyParser = require('body-parser');
const { buildSchema } = require("graphql");
const expressPlayground = require('graphql-playground-middleware-express').default;
const  mongoose  = require('mongoose');




app.use(bodyParser.json());
app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
app.use(
    '/graphql',
    graphqlHTTP({
      schema: buildSchema(`
      type RootQuery {
        hello: String
      }
      type RootMutation {
          somemutation: String
      }
      schema {
          query: RootQuery
          mutation: RootMutation
      } 
    `),
      rootValue: {
        hello:()=>{
            return "Hello back to you"
        }
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
        console.log(`Running running oo port ${PORT}`);
        })
}).catch(error=>console.error(error));

