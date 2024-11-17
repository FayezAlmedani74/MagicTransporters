import Joi from "joi";

export const addMagicItemSchema = Joi.object({
  name: Joi.string().required(),
  weight: Joi.number().positive().required(),
});

export const addMagicMoverSchema = Joi.object({
  name: Joi.string().required(),
  weightLimit: Joi.number().positive().required(),
});

export const loadMagicMoverItemsSchema = Joi.object({
  moverId: Joi.string().required(),
  itemIds: Joi.array().items(Joi.string().required()).min(1).required(),
});

export const missionSchema = Joi.object({
  moverId: Joi.string().required(),
});
