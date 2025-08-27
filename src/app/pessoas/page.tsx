"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from "@mui/material";

type Pessoa = {
  id: number;
  nome: string;
  idade: number;
  telefone: string;
};

export default function PessoasPage() {
  const router = useRouter();
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Pessoa>({ id: 0, nome: "", idade: 0, telefone: "" });
  const API_URL = "http://localhost:3001/pessoas";

  // Simula usuário logado
  const usuario_id = 1; // Substitua com ID real do usuário logado

  // Carregar pessoas do usuário
  useEffect(() => {
    fetch(`${API_URL}?usuario_id=${usuario_id}`)
      .then((r) => r.json())
      .then(setPessoas)
      .catch(console.error);
  }, []);

  const abrirModal = (p?: Pessoa) => {
    setForm(p || { id: 0, nome: "", idade: 0, telefone: "" });
    setOpen(true);
  };
  const fecharModal = () => setOpen(false);

  const salvar = async () => {
    if (form.id === 0) {
      // Adicionar pessoa
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, usuario_id }),
      });
      const nova = await res.json();
      setPessoas(prev => [...prev, nova]);
    } else {
      // Editar pessoa
      const res = await fetch(`${API_URL}/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, usuario_id }),
      });
      const atualizada = await res.json();
      setPessoas(prev => prev.map(p => (p.id === atualizada.id ? atualizada : p)));
    }
    fecharModal();
  };

  const deletar = async (id: number) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id }),
    });
    setPessoas(prev => prev.filter((p) => p.id !== id));
  };

  return (
    <Box sx={{ p: 5, bgcolor: "#e8f5e9", minHeight: "100vh" }}> {/* Fundo verde claro */}
      
      {/* Título e Logout alinhados */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ color: "#2e7d32" }}>Lista de Pessoas</Typography> {/* Título verde escuro */}
        <Button variant="contained" sx={{ bgcolor: "#81c784", '&:hover': { bgcolor: '#66bb6a' } }} onClick={() => router.push("/login")}> {/* Botão Sair verde claro */}
          Sair
        </Button>
      </Box>

      <Button variant="contained" sx={{ mb: 3, bgcolor: "#388e3c", '&:hover': { bgcolor: '#2e7d32' } }} onClick={() => abrirModal()}>Adicionar Pessoa</Button> {/* Botão principal verde */}

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        {pessoas.map((p) => (
          <Box key={p.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography>{p.nome} - {p.idade} anos - {p.telefone}</Typography>
            <Box>
              <Button size="small" sx={{ mr: 1, color: '#388e3c' }} onClick={() => abrirModal(p)}>Editar</Button> {/* Botão editar verde */}
              <Button size="small" color="error" onClick={() => deletar(p.id)}>Excluir</Button>
            </Box>
          </Box>
        ))}
      </Paper>

      {/* Modal de Adicionar/Editar */}
      <Dialog open={open} onClose={fecharModal}>
        <DialogTitle>{form.id === 0 ? "Adicionar Pessoa" : "Editar Pessoa"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <TextField
            label="Idade"
            type="number"
            value={form.idade === 0 ? "" : form.idade}
            onChange={(e) => setForm({ ...form, idade: Number(e.target.value) || 0 })}
          />
          <TextField label="Telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: '#388e3c' }} onClick={fecharModal}>Cancelar</Button> {/* Botão cancelar verde */}
          <Button variant="contained" sx={{ bgcolor: "#388e3c", '&:hover': { bgcolor: '#2e7d32' } }} onClick={salvar}>Salvar</Button> {/* Botão salvar verde */}
        </DialogActions>
      </Dialog>
    </Box>
  );
}