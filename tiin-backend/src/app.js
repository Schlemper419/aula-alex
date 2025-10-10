import express from 'express'
import mysql from 'mysql2/promise';
const pool = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'senai',
  database: 'user_db'
});
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Olá Mundo")
})

app.get("/usuarios", async (req, res) => {
  const [results] = await pool.query(
    'SELECT * FROM usuario'
  );
  res.send(results)
})

app.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params
  const [results] = await pool.query(
    'SELECT * FROM usuario WHERE id=?', id
  );
  res.send(results)
})


// app.post("/usuarios", async (req, res) => {

//   try {

//     const { body } = req
//     const [results] = await pool.query(
//       "INSERT INTO usuario (nome, idade) VALUES (?,?)",
//       [body.nome, body.idade]
//     );

//     const [usuarioCriado] = await pool.query(
//       "Select * From usuario where id=?",
//       results.insertId
//     )

//     return res.status(201).json(usuarioCriado)

//   } catch (error) {
//     console.log(error)
//   }
// });

// login

app.post("/login", async (req, res) => {

  try {
    const { email, senha } = req.body;


    const [usuarioLogado] = await pool.query(
      "Select * From usuario where email=? and senha=?",
      [email, senha]
    )

    if(usuarioLogado.length >0){
       return res.status(200).json(usuarioLogado)
    }

    return res.status(404).json("erro")

  } catch (error) {
    console.log(error)
  }
});


// registrar
app.post("/registrar", async (req, res) => {

  try {

    const { body } = req
    const [results] = await pool.query(
      "INSERT INTO usuario (nome, email, senha, idade) VALUES (?,?,?,?)",
      [body.nome, body.email, body.senha, body.idade]
    );

    const [usuarioResgistrado] = await pool.query(
      "Select * From usuario where id=?",
      results.insertId
    )

    return res.status(201).json(usuarioResgistrado)

  } catch (error) {
    console.log(error)
  }
});


app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await pool.query(
      "DELETE FROM usuario WHERE id=?",
      id
    );
    res.status(200).send("Usuário deletado!", results)
  } catch (error) {
    console.log(error)
  }
})


app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const [results] = await pool.query('UPDATE `usuario` SET `nome` = ?, `idade`= ? WHERE `id` = ?',
      [body.nome, body.idade, id]
    );
    res.status(200).send("Usuário editado!", results)
  } catch (error) {
    console.log(error)
  }
})

app.listen(3000, () => {
  console.log(`Servidor rodando na porta: 3000`);
});

//log

app.get("/log", async (req, res) => {
  const [results] = await pool.query(
    'SELECT * FROM log'
  );
  res.send(results)
})

app.post("/log", async (req, res) => {

  try {

    const { body } = req
    const [results] = await pool.query(
      "INSERT INTO log (categoria, horas_trabalhadas, linha_de_codigo, bugs_corridos) VALUES (?,?,?,?)",
      [body.categoria, body.horas_trabalhadas, body.linha_de_codigo, body.bugs_corridos]
    );

    const [usuarioResgistrado] = await pool.query(
      "Select * From log where id_log=?",
      results.insertId
    )

    return res.status(201).json(usuarioResgistrado)

  } catch (error) {
    console.log(error)
  }
});
