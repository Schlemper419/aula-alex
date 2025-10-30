import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const pool = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "senai",
  database: "devhub",
});

const app = express();
app.use(express.json());
app.use(cors());


app.get("/usuarios", async (req, res) => {
  const [results] = await pool.query("SELECT * FROM usuario");
  res.json(results);
});

app.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const [results] = await pool.query("SELECT * FROM usuario WHERE id=?", [id]);
  res.json(results);
});

app.post("/usuarios", async (req, res) => {
  try {
    const { nome, idade, email, senha } = req.body;
    const [results] = await pool.query(
      "INSERT INTO usuario (nome, idade, email, senha) VALUES (?, ?, ?, ?)",
      [nome, idade, email, senha]
    );

    const [usuarioCriado] = await pool.query("SELECT * FROM usuario WHERE id=?", [results.insertId]);
    res.status(201).json(usuarioCriado[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
});

app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, idade, email, senha } = req.body;
    await pool.query(
      "UPDATE usuario SET nome=?, idade=?, email=?, senha=? WHERE id=?",
      [nome, idade, email, senha, id]
    );

    const [usuarioAtualizado] = await pool.query("SELECT * FROM usuario WHERE id=?", [id]);
    res.status(200).json(usuarioAtualizado[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM usuario WHERE id=?", [id]);
    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao deletar usuário" });
  }
});

app.get("/logs", async (req, res) => {
  const { pagina = 1, quantidade = 20 } = req.query;
  const offset = (pagina - 1) * quantidade;

  const [results] = await pool.query(
    `
    SELECT 
      lgs.id,
      lgs.categoria,
      lgs.horas_trabalhadas,
      lgs.linhas_codigo,
      lgs.bugs_corrigidos,
      (SELECT COUNT(*) FROM \`like\` WHERE log_id = lgs.id) AS likes,
      (SELECT COUNT(*) FROM comment WHERE log_id = lgs.id) AS qnt_comments
    FROM lgs
    ORDER BY lgs.id ASC
    LIMIT ? OFFSET ?;
    `,
    [Number(quantidade), Number(offset)]
  );
  res.json(results);
});

app.post("/logs", async (req, res) => {
  try {
    const { categoria, horas_trabalhadas, linhas_codigo, bugs_corrigidos, user_id } = req.body;
    const [results] = await pool.query(
      "INSERT INTO lgs (categoria, horas_trabalhadas, linhas_codigo, bugs_corrigidos, user_id) VALUES (?, ?, ?, ?, ?)",
      [categoria, horas_trabalhadas, linhas_codigo, bugs_corrigidos, user_id]
    );
    const [logCriado] = await pool.query("SELECT * FROM lgs WHERE id=?", [results.insertId]);
    res.status(201).json(logCriado[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao criar log" });
  }
});


app.get("/likes", async (req, res) => {
  const [results] = await pool.query("SELECT * FROM `like`");
  res.json(results);
});

app.post("/likes", async (req, res) => {
  try {
    const { log_id, user_id } = req.body;
    const [results] = await pool.query(
      "INSERT INTO `like` (log_id, user_id) VALUES (?, ?)",
      [log_id, user_id]
    );
    const [likeCriado] = await pool.query("SELECT * FROM `like` WHERE id=?", [results.insertId]);
    res.status(201).json(likeCriado[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao curtir log" });
  }
});


app.get("/usuarios/:id/horas", async (req, res) => {
  const { id } = req.params;
  const [results] = await pool.query("SELECT SUM(horas_trabalhadas) AS total_horas FROM lgs WHERE user_id=?", [id]);
  res.json({ user_id: id, total_horas: results[0].total_horas || 0 });
});

app.get("/usuarios/:id/logs", async (req, res) => {
  const { id } = req.params;
  const [results] = await pool.query("SELECT COUNT(*) AS total_logs FROM lgs WHERE user_id=?", [id]);
  res.json({ user_id: id, total_logs: results[0].total_logs || 0 });
});

app.get("/usuarios/:id/bugs", async (req, res) => {
  const { id } = req.params;
  const [results] = await pool.query("SELECT SUM(bugs_corrigidos) AS total_bugs FROM lgs WHERE user_id=?", [id]);
  res.json({ user_id: id, total_bugs: results[0].total_bugs || 0 });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));