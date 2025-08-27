"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

export default function CadastroUsuario() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const API_URL = "http://localhost:3001/usuarios";

  const handleCadastro = async () => {
    if (!nome || !senha) {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, senha }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErro(data.error || "Erro ao cadastrar");
        return;
      }

      router.push("/login");
    } catch {
      setErro("Erro de conexão");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#e8f5e9" }}> {/* Fundo verde claro */}
      <Paper sx={{ p: 5, width: 360, borderRadius: 3, boxShadow: 4, bgcolor: "#ffffff" }}>
        <Typography variant="h4" sx={{ mb: 3, color: "#2e7d32", textAlign: "center" }}>Cadastro</Typography> {/* Título verde escuro */}
        <TextField
          label="Nome"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        {erro && <Typography color="error" sx={{ mb: 1 }}>{erro}</Typography>}
        <Button variant="contained" fullWidth sx={{ bgcolor: "#388e3c", mb: 1, '&:hover': { bgcolor: '#2e7d32' } }} onClick={handleCadastro}> {/* Botão verde */}
          Cadastrar
        </Button>
        <Button variant="text" fullWidth sx={{ color: "#66bb6a" }} onClick={() => router.push("/login")}> {/* Texto do botão verde claro */}
          Voltar ao Login
        </Button>
      </Paper>
    </Box>
  );
}