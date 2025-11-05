// Controller de Setor (Express)
const {
  getAllSetoresModel,
  getSetorByIdModel,
  getSetorWithGuichesModel,
  createSetorModel,
  updateSetorModel,
  deleteSetorModel,
} = require("../services/setorService");

// helper simples pra padronizar try/catch em rotas async
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/** GET /setores */
const listSetores = asyncHandler(async (req, res) => {
  const setores = await getAllSetoresModel();
  res.status(200).json({ ok: true, data: setores });
});

/** GET /setores/:id  (use ?includeGuiches=true para trazer relação) */
const getSetor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const includeGuiches = String(req.query.includeGuiches || "").toLowerCase() === "true";

  const setor = includeGuiches
    ? await getSetorWithGuichesModel(id)
    : await getSetorByIdModel(id);

  if (!setor) {
    return res.status(404).json({ ok: false, message: "Setor não encontrado" });
  }

  res.status(200).json({ ok: true, data: setor });
});

/** POST /setores  { setor } */
const createSetor = asyncHandler(async (req, res) => {
  const { setor } = req.body;

  if (!setor || typeof setor !== "string" || !setor.trim()) {
    return res.status(400).json({ ok: false, message: "Campo 'setor' é obrigatório" });
  }

  const novo = await createSetorModel(setor.trim());
  res.status(201).json({ ok: true, data: novo });
});

/** PATCH /setores/:id  { setor? } */
const updateSetor = asyncHandler(async (req, res) => {
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
    const atualizado = await updateSetorModel(id, payload);
    res.status(200).json({ ok: true, data: atualizado });
  } catch (err) {
    // P2025 já é tratado no model? Se não, tratamos aqui.
    if (err?.code === "P2025") {
      return res.status(404).json({ ok: false, message: "Setor não encontrado" });
    }
    throw err; // cai no error handler global
  }
});

/** DELETE /setores/:id */
const deleteSetor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await deleteSetorModel(id);
  } catch (err) {
    if (err?.code === "P2025") {
      return res.status(404).json({ ok: false, message: "Setor não encontrado" });
    }
    throw err;
  }
  res.status(204).send(); // sem corpo
});

module.exports = {
  listSetores,
  getSetor,
  createSetor,
  updateSetor,
  deleteSetor,
};
