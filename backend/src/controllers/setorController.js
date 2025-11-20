const {
  selectAllSetores,
  selectSetorById,
  selectSetorWithGuiches,
  insertSetor,
  updateSetor,
  deleteSetor,
} = require("../repositories/setorDao");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const listSetoresHandler = asyncHandler(async (req, res) => {
  const setores = await selectAllSetores();
  res.status(200).json({ ok: true, data: setores });
});

const getSetorHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const includeGuiches = String(req.query.includeGuiches || "").toLowerCase() === "true";

  const setor = includeGuiches
    ? await selectSetorWithGuiches(id)
    : await selectSetorById(id);

  if (!setor) {
    return res.status(404).json({ ok: false, message: "Setor não encontrado" });
  }

  res.status(200).json({ ok: true, data: setor });
});

const createSetorHandler = asyncHandler(async (req, res) => {
  const { setor } = req.body;

  if (!setor || typeof setor !== "string" || !setor.trim()) {
    return res.status(400).json({ ok: false, message: "Campo 'setor' é obrigatório" });
  }

  const novo = await insertSetor(setor.trim());
  res.status(201).json({ ok: true, data: novo });
});

const updateSetorHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payload = {};

  if ("setor" in req.body) {
    if (req.body.setor != null && typeof req.body.setor !== "string") {
      return res.status(400).json({ ok: false, message: "Campo 'setor' deve ser string" });
    }
    if (typeof req.body.setor === "string" && !req.body.setor.trim()) {
      return res.status(400).json({ ok: false, message: "Campo 'setor' não pode ser vazio" });
    }
    payload.setor = req.body.setor?.trim();
  }

  if (Object.keys(payload).length === 0) {
    return res.status(400).json({ ok: false, message: "Nada para atualizar" });
  }

  try {
    const atualizado = await updateSetor(id, payload);
    res.status(200).json({ ok: true, data: atualizado });
  } catch (err) {
    if (err?.code === "P2025") {
      return res.status(404).json({ ok: false, message: "Setor não encontrado" });
    }
    throw err;
  }
});

const deleteSetorHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await deleteSetor(id);
  } catch (err) {
    if (err?.code === "P2025") {
      return res.status(404).json({ ok: false, message: "Setor não encontrado" });
    }
    throw err;
  }
  res.status(204).send();
});

module.exports = {
  listSetoresHandler,
  getSetorHandler,
  createSetorHandler,
  updateSetorHandler,
  deleteSetorHandler,
};
